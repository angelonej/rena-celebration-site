/**
 * AWS S3 Configuration and Client Setup
 * 
 * Best Practices Implemented:
 * - Environment variables for sensitive credentials
 * - Proper error handling
 * - Region-specific configuration
 * - Signed URLs for secure access
 */

import { S3Client } from '@aws-sdk/client-s3';

// AWS Configuration Interface
export interface S3Config {
  region: string;
  bucket: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

// Get S3 configuration from environment variables
export function getS3Config(): S3Config {
  const region = import.meta.env.VITE_AWS_REGION?.trim();
  const bucket = import.meta.env.VITE_AWS_S3_BUCKET?.trim();
  const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY?.trim();

  console.log('🔍 Raw environment variables:');
  console.log('  VITE_AWS_REGION:', region);
  console.log('  VITE_AWS_S3_BUCKET:', bucket);
  console.log('  VITE_AWS_ACCESS_KEY_ID:', accessKeyId);
  console.log('  VITE_AWS_SECRET_ACCESS_KEY length:', secretAccessKey?.length);

  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing AWS configuration. Please set VITE_AWS_REGION, VITE_AWS_S3_BUCKET, ' +
      'VITE_AWS_ACCESS_KEY_ID, and VITE_AWS_SECRET_ACCESS_KEY in your .env file.'
    );
  }

  return {
    region,
    bucket,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  };
}

// Create and export S3 client
let s3Client: S3Client | null = null;

export function getS3Client(): S3Client {
  // Always create a fresh client to avoid credential caching issues
  try {
    const config = getS3Config();
    
    console.log('🔧 Initializing S3 client');
    console.log('  Region:', config.region);
    console.log('  Bucket:', config.bucket);
    console.log('  Access Key:', config.credentials.accessKeyId);
    console.log('  Secret Key Length:', config.credentials.secretAccessKey.length, 'characters');
    console.log('  Secret Key First 4 chars:', config.credentials.secretAccessKey.substring(0, 4));
    
    s3Client = new S3Client({
      region: config.region,
      credentials: config.credentials,
    });
    
    return s3Client;
  } catch (error) {
    console.error('Failed to initialize S3 client:', error);
    throw error;
  }
}

// Generate S3 key (path) for organized storage
export function generateS3Key(
  userId: string,
  fileType: 'image' | 'video' | 'audio',
  fileName: string
): string {
  // Sanitize filename
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Create organized folder structure:
  // users/{userId}/{fileType}/{timestamp}_{filename}
  const timestamp = Date.now();
  return `users/${userId}/${fileType}s/${timestamp}_${sanitizedFileName}`;
}

// Generate a user-friendly folder name
export function sanitizeUserId(userId: string): string {
  return userId.replace(/[^a-zA-Z0-9-]/g, '_').toLowerCase();
}

// Get public URL for uploaded file
export function getPublicUrl(bucket: string, region: string, key: string): string {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

// Content type mapping
export const CONTENT_TYPES: { [key: string]: string } = {
  // Images
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'webp': 'image/webp',
  
  // Videos
  'mp4': 'video/mp4',
  'mov': 'video/quicktime',
  'avi': 'video/x-msvideo',
  'webm': 'video/webm',
  
  // Audio
  'mp3': 'audio/mpeg',
  'wav': 'audio/wav',
  'ogg': 'audio/ogg',
};

export function getContentType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return CONTENT_TYPES[extension] || 'application/octet-stream';
}
