/**
 * S3 Presigned URL Upload
 * This approach uses presigned URLs for secure browser-based uploads
 */

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getS3Client, getS3Config, generateS3Key } from './s3Config';

export interface PresignedUploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

/**
 * Generate a presigned URL for uploading to S3
 */
export async function generatePresignedUploadUrl(
  userId: string,
  fileName: string,
  fileType: string
): Promise<PresignedUploadResult> {
  try {
    const config = getS3Config();
    const client = getS3Client();
    const key = generateS3Key(userId, fileName, fileType);

    const command = new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
    });

    // Generate presigned URL valid for 10 minutes with minimal config
    const presignedUrl = await getSignedUrl(client, command, {
      expiresIn: 600,
      unhoistableHeaders: new Set(),
      signableHeaders: new Set(),
    });

    console.log('📝 Presigned URL generated for:', key);

    return {
      success: true,
      url: presignedUrl,
      key: key,
    };
  } catch (error) {
    console.error('❌ Failed to generate presigned URL:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Upload file using presigned URL
 * This bypasses signature issues by using a pre-signed request
 */
export async function uploadWithPresignedUrl(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; key?: string; url?: string; error?: string }> {
  try {
    console.log('🚀 Starting presigned URL upload for:', file.name);

    // Step 1: Generate presigned URL
    const presignedResult = await generatePresignedUploadUrl(
      userId,
      file.name,
      file.type
    );

    if (!presignedResult.success || !presignedResult.url) {
      throw new Error(presignedResult.error || 'Failed to generate presigned URL');
    }

    console.log('✅ Presigned URL generated');

    // Step 2: Upload directly to S3 using presigned URL
    // Don't set any custom headers - let the browser handle it
    
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('✅ Upload successful');
          const config = getS3Config();
          const publicUrl = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${presignedResult.key}`;
          
          resolve({
            success: true,
            key: presignedResult.key,
            url: publicUrl,
          });
        } else {
          console.error('❌ Upload failed with status:', xhr.status);
          console.error('Response:', xhr.responseText);
          reject({
            success: false,
            error: `Upload failed with status ${xhr.status}: ${xhr.responseText}`,
          });
        }
      });

      xhr.addEventListener('error', () => {
        console.error('❌ Upload error');
        reject({
          success: false,
          error: 'Network error during upload',
        });
      });

      xhr.open('PUT', presignedResult.url!);
      // Don't set Content-Type - let it be unsigned
      console.log('📤 Sending file without custom headers');
      xhr.send(file);
    });
  } catch (error) {
    console.error('❌ Presigned upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}
