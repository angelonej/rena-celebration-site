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
import { ListObjectsV2Command, DeleteObjectCommand, HeadObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
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
  caption?: string;
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
    
    // Convert S3 objects to file info and fetch metadata (including captions)
    const filePromises = response.Contents
      .filter(obj => {
        if (!obj.Key || !obj.Size || obj.Size === 0) return false; // Filter out folders and empty files
        // Filter out JSON metadata files
        if (obj.Key.endsWith('.json')) return false;
        // Only include image and video files
        const key = obj.Key.toLowerCase();
        return key.includes('/images/') || key.includes('/videos/');
      })
      .map(async (obj) => {
        const key = obj.Key!;
        const url = getPublicUrl(config.bucket, config.region, key);
        
        // Determine file type from path
        let type: 'image' | 'video' | 'audio' = 'image';
        if (key.includes('/videos/')) type = 'video';
        else if (key.includes('/audios/')) type = 'audio';
        
        // Fetch object metadata to get caption
        let caption = '';
        try {
          const headCommand = new HeadObjectCommand({
            Bucket: config.bucket,
            Key: key,
          });
          const headResponse = await s3Client.send(headCommand);
          caption = headResponse.Metadata?.caption || '';
          console.log('📝 Fetched metadata for', key, '- Caption:', caption);
        } catch (error) {
          console.warn('⚠️ Could not fetch metadata for', key, error);
        }
        
        return {
          key,
          url,
          type,
          size: obj.Size!,
          lastModified: obj.LastModified || new Date(),
          caption,
        };
      });
    
    const files = await Promise.all(filePromises);
    
    console.log('✅ Found', files.length, 'files with captions');
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

/**
 * Save captions to S3 as a JSON file
 * This avoids CORS issues with CopyObject by using simple PutObject
 */
export async function saveCaptionsToS3(userId: string, captions: Record<string, string>): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('💾 Saving captions file to S3 for user:', userId);
    
    const s3Client = getS3Client();
    const config = getS3Config();
    const sanitizedUserId = sanitizeUserId(userId);
    
    // Save captions as a JSON file in user's folder
    const captionsKey = `users/${sanitizedUserId}/captions.json`;
    const captionsData = JSON.stringify(captions, null, 2);
    
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: config.bucket,
        Key: captionsKey,
        Body: captionsData,
        ContentType: 'application/json',
      },
    });
    
    await upload.done();
    
    console.log('✅ Captions saved to S3 successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error saving captions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save captions',
    };
  }
}

/**
 * Save deleted files list to S3 JSON file
 */
export async function saveDeletedFilesToS3(userId: string, deletedKeys: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🗑️ Saving deleted files list to S3 for user:', userId);
    
    const s3Client = getS3Client();
    const config = getS3Config();
    const sanitizedUserId = sanitizeUserId(userId);
    
    const deletedKey = `users/${sanitizedUserId}/deleted.json`;
    const deletedData = JSON.stringify(deletedKeys);
    
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: config.bucket,
        Key: deletedKey,
        Body: deletedData,
        ContentType: 'application/json',
      },
    });
    
    await upload.done();
    
    console.log('✅ Deleted files list saved to S3 successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error saving deleted files list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save deleted files list',
    };
  }
}

/**
 * Load deleted files list from S3 JSON file
 */
export async function loadDeletedFilesFromS3(userId: string): Promise<{ success: boolean; deletedKeys?: string[]; error?: string }> {
  try {
    console.log('🗑️ Loading deleted files list from S3 for user:', userId);
    
    const config = getS3Config();
    const sanitizedUserId = sanitizeUserId(userId);
    
    const deletedKey = `users/${sanitizedUserId}/deleted.json`;
    const url = getPublicUrl(config.bucket, config.region, deletedKey);
    
    // Fetch the deleted files list
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('🗑️ No deleted files list found (this is normal)');
        return { success: true, deletedKeys: [] };
      }
      throw new Error(`Failed to fetch deleted files: ${response.statusText}`);
    }
    
    const deletedKeys = await response.json();
    console.log('✅ Loaded', deletedKeys.length, 'deleted file keys from S3');
    
    return { success: true, deletedKeys };
    
  } catch (error) {
    console.error('❌ Error loading deleted files list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load deleted files list',
    };
  }
}

/**
 * Load captions from S3 JSON file
 */
export async function loadCaptionsFromS3(userId: string): Promise<{ success: boolean; captions?: Record<string, string>; error?: string }> {
  try {
    console.log('📖 Loading captions from S3 for user:', userId);
    
    const config = getS3Config();
    const sanitizedUserId = sanitizeUserId(userId);
    
    const captionsKey = `users/${sanitizedUserId}/captions.json`;
    const url = getPublicUrl(config.bucket, config.region, captionsKey);
    
    // Fetch the captions file
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('📝 No captions file found (this is normal for new users)');
        return { success: true, captions: {} };
      }
      throw new Error(`Failed to fetch captions: ${response.statusText}`);
    }
    
    const captions = await response.json();
    console.log('✅ Loaded', Object.keys(captions).length, 'captions from S3');
    
    return { success: true, captions };
    
  } catch (error) {
    console.error('❌ Error loading captions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load captions',
    };
  }
}

/**
 * Update caption for an existing S3 object
 * Uses CopyObject to update metadata without re-uploading the file
 * NOTE: This approach has CORS issues in browsers, use saveCaptionsToS3 instead
 */
export async function updateS3Caption(key: string, caption: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('✏️ Updating caption for:', key);
    
    const s3Client = getS3Client();
    const config = getS3Config();
    
    // First, get the current metadata
    const headCommand = new HeadObjectCommand({
      Bucket: config.bucket,
      Key: key,
    });
    const headResponse = await s3Client.send(headCommand);
    
    // Copy the object over itself with updated metadata
    const copyCommand = new CopyObjectCommand({
      Bucket: config.bucket,
      Key: key,
      CopySource: `${config.bucket}/${key}`,
      Metadata: {
        ...headResponse.Metadata,
        caption: caption,
      },
      MetadataDirective: 'REPLACE',
      ContentType: headResponse.ContentType,
    });
    
    await s3Client.send(copyCommand);
    
    console.log('✅ Caption updated successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error updating caption:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update caption',
    };
  }
}

/**
 * Batch update captions for multiple S3 objects
 * Used to sync captions from localStorage to S3
 */
export async function syncCaptionsToS3(captionMap: Record<string, string>): Promise<{ 
  success: boolean; 
  updatedCount: number;
  failedCount: number;
  errors?: string[];
}> {
  console.log('🔄 Syncing', Object.keys(captionMap).length, 'captions to S3...');
  
  let updatedCount = 0;
  let failedCount = 0;
  const errors: string[] = [];
  
  for (const [key, caption] of Object.entries(captionMap)) {
    const result = await updateS3Caption(key, caption);
    if (result.success) {
      updatedCount++;
    } else {
      failedCount++;
      if (result.error) {
        errors.push(`${key}: ${result.error}`);
      }
    }
  }
  
  console.log(`✅ Sync complete: ${updatedCount} updated, ${failedCount} failed`);
  
  return {
    success: failedCount === 0,
    updatedCount,
    failedCount,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * List all user folders in S3 (admin function)
 * Returns list of user IDs who have uploaded content
 */
export async function listAllUsers(): Promise<{ success: boolean; users?: string[]; error?: string }> {
  try {
    console.log('👥 Listing all users from S3...');
    
    const s3Client = getS3Client();
    const config = getS3Config();
    
    const command = new ListObjectsV2Command({
      Bucket: config.bucket,
      Prefix: 'users/',
      Delimiter: '/',
    });
    
    const response = await s3Client.send(command);
    
    if (!response.CommonPrefixes || response.CommonPrefixes.length === 0) {
      console.log('👥 No users found');
      return { success: true, users: [] };
    }
    
    // Extract user IDs from folder prefixes
    const users = response.CommonPrefixes
      .map(prefix => prefix.Prefix?.replace('users/', '').replace('/', ''))
      .filter((user): user is string => !!user);
    
    console.log('✅ Found', users.length, 'users');
    return { success: true, users };
    
  } catch (error) {
    console.error('❌ Error listing users:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list users',
    };
  }
}

/**
 * List all files for all users (admin function)
 */
export async function listAllUsersFiles(): Promise<{ 
  success: boolean; 
  userFiles?: Record<string, S3File[]>; 
  error?: string 
}> {
  try {
    console.log('📂 Listing all users files from S3...');
    
    // First get all users
    const usersResult = await listAllUsers();
    if (!usersResult.success || !usersResult.users) {
      return { success: false, error: usersResult.error || 'Failed to get users' };
    }
    
    // Then get files for each user
    const userFiles: Record<string, S3File[]> = {};
    
    for (const userId of usersResult.users) {
      const filesResult = await listUserFiles(userId);
      if (filesResult.success && filesResult.files) {
        userFiles[userId] = filesResult.files;
      }
    }
    
    console.log('✅ Loaded files for', Object.keys(userFiles).length, 'users');
    return { success: true, userFiles };
    
  } catch (error) {
    console.error('❌ Error listing all files:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list all files',
    };
  }
}
