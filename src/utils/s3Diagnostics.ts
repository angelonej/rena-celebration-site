/**
 * S3 Connection Diagnostic Utility
 * Use this to test your S3 connection and configuration
 */

import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getS3Client, getS3Config } from './s3Config';

export interface DiagnosticResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Test S3 connection and configuration
 */
export async function testS3Connection(): Promise<DiagnosticResult> {
  try {
    console.log('🔍 Testing S3 connection...');
    
    // Step 1: Check environment variables
    console.log('Step 1: Checking environment variables...');
    const config = getS3Config();
    console.log('✅ Environment variables loaded');
    console.log('  Region:', config.region);
    console.log('  Bucket:', config.bucket);
    console.log('  Access Key ID:', config.credentials.accessKeyId.substring(0, 8) + '...');
    
    // Step 2: Initialize S3 client
    console.log('Step 2: Initializing S3 client...');
    const s3Client = getS3Client();
    console.log('✅ S3 client initialized');
    
    // Step 3: Test connection by listing objects
    console.log('Step 3: Testing connection to S3...');
    const command = new ListObjectsV2Command({
      Bucket: config.bucket,
      MaxKeys: 1, // Just check if we can access the bucket
    });
    
    const response = await s3Client.send(command);
    console.log('✅ Successfully connected to S3!');
    console.log('  Bucket accessible:', config.bucket);
    console.log('  Region:', config.region);
    
    return {
      success: true,
      message: 'S3 connection successful! Your configuration is correct.',
      details: {
        region: config.region,
        bucket: config.bucket,
        objectCount: response.KeyCount || 0,
      }
    };
    
  } catch (error) {
    console.error('❌ S3 connection test failed:', error);
    
    let message = 'Connection test failed';
    let troubleshooting: string[] = [];
    
    if (error instanceof Error) {
      const errorMsg = error.message;
      
      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
        message = 'Network Error: Cannot reach AWS S3';
        troubleshooting = [
          '1. Check your internet connection',
          '2. Verify your AWS region is correct (e.g., us-east-1, us-west-2)',
          '3. Check if your firewall/VPN is blocking AWS',
          '4. Try a different AWS region in your .env file',
        ];
      } else if (errorMsg.includes('NoSuchBucket')) {
        message = 'Bucket Not Found';
        troubleshooting = [
          '1. Verify the bucket name in your .env file',
          '2. Make sure the bucket exists in your AWS account',
          '3. Check that you\'re using the correct AWS region',
        ];
      } else if (errorMsg.includes('InvalidAccessKeyId')) {
        message = 'Invalid Access Key ID';
        troubleshooting = [
          '1. Check your VITE_AWS_ACCESS_KEY_ID in .env',
          '2. Verify the IAM user exists in AWS Console',
          '3. Make sure you copied the full access key',
        ];
      } else if (errorMsg.includes('SignatureDoesNotMatch')) {
        message = 'Invalid Secret Access Key';
        troubleshooting = [
          '1. Check your VITE_AWS_SECRET_ACCESS_KEY in .env',
          '2. Make sure there are no extra spaces or characters',
          '3. Verify you copied the complete secret key',
        ];
      } else if (errorMsg.includes('Access Denied') || errorMsg.includes('403')) {
        message = 'Access Denied';
        troubleshooting = [
          '1. Check IAM user permissions',
          '2. Verify the bucket policy allows access',
          '3. Ensure IAM user has s3:ListBucket permission',
          '4. Check if bucket is in the same account',
        ];
      } else {
        message = `Error: ${errorMsg}`;
        troubleshooting = [
          '1. Check browser console for detailed error',
          '2. Verify all .env variables are set correctly',
          '3. Restart the development server',
        ];
      }
    }
    
    console.log('\n📋 Troubleshooting steps:');
    troubleshooting.forEach(step => console.log('  ' + step));
    
    return {
      success: false,
      message,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        troubleshooting,
      }
    };
  }
}

/**
 * Display diagnostic results in a user-friendly format
 */
export function displayDiagnostics(result: DiagnosticResult): void {
  if (result.success) {
    console.log('\n✅ S3 Connection: SUCCESS');
    console.log(result.message);
    if (result.details) {
      console.log('\nDetails:', result.details);
    }
  } else {
    console.log('\n❌ S3 Connection: FAILED');
    console.log(result.message);
    if (result.details?.troubleshooting) {
      console.log('\nTroubleshooting:');
      result.details.troubleshooting.forEach((step: string) => console.log('  ' + step));
    }
  }
}
