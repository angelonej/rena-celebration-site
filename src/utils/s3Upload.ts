/**
 * AWS S3 Upload Utilities
 * 
 * Best Practices Implemented:
 * - Multipart upload for large files
 * - Progress tracking
 * - Error handling and retry logic
 * - Organized folder structure by user
 * - Metadata tagging
 * - Content type detection
 */

import { Upload } from '@aws-sdk/lib-storage';
import { ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import {
  getS3Client,
  getS3Config,
  generateS3Key,
  getPublicUrl,
  getContentType,
  sanitizeUserId,
} from './s3Config';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
  metadata?: {
    size: number;
    type: string;
    uploadedAt: string;
  };
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  metadata?: { [key: string]: string };
  userId: string;
  fileType: 'image' | 'video' | 'audio';
}

/**
 * Upload a single file to S3
 * Uses multipart upload for files larger than 5MB
 */
export async function uploadToS3(
  file: File | Blob,
  fileName: string,
  options: UploadOptions
): Promise<UploadResult> {
  try {
    console.log('🚀 Starting S3 upload for:', fileName);
    console.log('📧 User ID:', options.userId);
    
    const s3Client = getS3Client();
    const config = getS3Config();
    
    console.log('🪣 S3 Config:', { bucket: config.bucket, region: config.region });
    
    // Sanitize user ID for folder structure
    const sanitizedUserId = sanitizeUserId(options.userId);
    
    // Generate S3 key with organized structure
    const key = generateS3Key(sanitizedUserId, options.fileType, fileName);
    
    console.log('📁 S3 Key (path):', key);
    
    // Detect content type
    const contentType = getContentType(fileName);
    
    // Prepare metadata
    const metadata = {
      'uploaded-by': sanitizedUserId,
      'upload-date': new Date().toISOString(),
      'original-filename': fileName,
      ...options.metadata,
    };

    // Use Upload from @aws-sdk/lib-storage for automatic multipart handling
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: config.bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
        Metadata: metadata,
        // Make files publicly readable (adjust ACL based on your needs)
        // ACL: 'public-read', // Note: ACLs must be enabled on your bucket
      },
    });

    // Track upload progress
    upload.on('httpUploadProgress', (progress) => {
      if (options.onProgress && progress.loaded && progress.total) {
        options.onProgress({
          loaded: progress.loaded,
          total: progress.total,
          percentage: Math.round((progress.loaded / progress.total) * 100),
        });
      }
    });

    // Execute upload
    console.log('⏫ Starting upload to S3...');
    await upload.done();
    console.log('✅ Upload completed successfully!');

    // Generate public URL
    const url = getPublicUrl(config.bucket, config.region, key);
    console.log('🔗 Public URL:', url);

    return {
      success: true,
      url,
      key,
      metadata: {
        size: file.size,
        type: contentType,
        uploadedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('❌ S3 upload error:', error);
    
    let errorMessage = 'Upload failed';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Provide more helpful error messages
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Network error: Cannot connect to AWS S3. Check your internet connection and AWS credentials.';
      } else if (error.message.includes('Access Denied') || error.message.includes('403')) {
        errorMessage = 'Access denied: Check your AWS IAM permissions and bucket policy.';
      } else if (error.message.includes('NoSuchBucket') || error.message.includes('404')) {
        errorMessage = 'Bucket not found: Verify your S3 bucket name in .env file.';
      } else if (error.message.includes('InvalidAccessKeyId')) {
        errorMessage = 'Invalid AWS credentials: Check your access key ID in .env file.';
      } else if (error.message.includes('SignatureDoesNotMatch')) {
        errorMessage = 'Invalid AWS credentials: Check your secret access key in .env file.';
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Upload multiple files with progress tracking for each
 */
export async function uploadMultipleToS3(
  files: Array<{ file: File | Blob; fileName: string; fileType: 'image' | 'video' | 'audio' }>,
  userId: string,
  onFileProgress?: (index: number, progress: UploadProgress) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const { file, fileName, fileType } = files[i];
    
    const result = await uploadToS3(file, fileName, {
      userId,
      fileType,
      onProgress: (progress) => {
        if (onFileProgress) {
          onFileProgress(i, progress);
        }
      },
    });

    results.push(result);
  }

  return results;
}

/**
 * Upload with retry logic for failed uploads
 */
export async function uploadWithRetry(
  file: File | Blob,
  fileName: string,
  options: UploadOptions,
  maxRetries: number = 3
): Promise<UploadResult> {
  let lastError: string = '';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await uploadToS3(file, fileName, options);
    
    if (result.success) {
      return result;
    }

    lastError = result.error || 'Unknown error';
    
    if (attempt < maxRetries) {
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return {
    success: false,
    error: `Upload failed after ${maxRetries} attempts: ${lastError}`,
  };
}

/**
 * Generate a unique upload session ID
 */
export function generateUploadSessionId(): string {
  return uuidv4();
}

/**
 * Get user's media folder path
 */
export function getUserMediaPath(userId: string, fileType?: 'image' | 'video' | 'audio'): string {
  const sanitizedUserId = sanitizeUserId(userId);
  if (fileType) {
    return `users/${sanitizedUserId}/${fileType}s/`;
  }
  return `users/${sanitizedUserId}/`;
}

/**
 * Validate file before upload
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateForUpload(file: File): ValidationResult {
  // Check file size (max 100MB)
  const maxSize = 100 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
    };
  }

  // Check file type
  const contentType = getContentType(file.name);
  if (contentType === 'application/octet-stream') {
    return {
      isValid: false,
      error: 'Unsupported file type',
    };
  }

  return { isValid: true };
}

/**
 * List all files for a user from S3
 */
export interface S3File {
  key: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  size: number;
  lastModified: Date;
}

export async function listUserFiles(userId: string): Promise<{ success: boolean; files?: S3File[]; error?: string }> {
  try {
    console.log('📂 Listing files for user:', userId);
    
    const s3Client = getS3Client();
    const config = getS3Config();
    const sanitizedUserId = sanitizeUserId(userId);
    
    // List all objects in user's folder
    const prefix = `users/${sanitizedUserId}/`;
    
    const command = new ListObjectsV2Command({
      Bucket: config.bucket,
      Prefix: prefix,
    });
    
    const response = await s3Client.send(command);
    
    if (!response.Contents || response.Contents.length === 0) {
      console.log('📂 No files found for user');
      return { success: true, files: [] };
    }
    
    // Convert S3 objects to file info
    const files: S3File[] = response.Contents
      .filter(obj => obj.Key && obj.Size && obj.Size > 0) // Filter out folders
      .map(obj => {
        const key = obj.Key!;
        const url = getPublicUrl(key);
        
        // Determine file type from path
        let type: 'image' | 'video' | 'audio' = 'image';
        if (key.includes('/videos/')) type = 'video';
        else if (key.includes('/audios/')) type = 'audio';
        
        return {
          key,
          url,
          type,
          size: obj.Size!,
          lastModified: obj.LastModified || new Date(),
        };
      });
    
    console.log('✅ Found', files.length, 'files');
    return { success: true, files };
    
  } catch (error) {
    console.error('❌ Error listing files:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list files',
    };
  }
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(key: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🗑️ Deleting file:', key);
    
    const s3Client = getS3Client();
    const config = getS3Config();
    
    const command = new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    });
    
    await s3Client.send(command);
    
    console.log('✅ File deleted successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file',
    };
  }
}
