/**
 * Backend API Client for S3 Uploads
 * Communicates with the Express backend to upload files securely
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface BackendUploadResult {
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

/**
 * Upload file to S3 via backend API
 */
export async function uploadToBackend(
  file: File | Blob,
  fileName: string,
  options: {
    userId: string;
    caption?: string;
    metadata?: Record<string, string>;
    onProgress?: (progress: number) => void;
  }
): Promise<BackendUploadResult> {
  try {
    console.log('🚀 Starting backend upload for:', fileName);
    console.log('   User:', options.userId);
    console.log('   File size:', file.size, 'bytes');

    // Create FormData
    const formData = new FormData();
    formData.append('file', file, fileName);
    formData.append('userId', options.userId);
    
    if (options.caption) {
      formData.append('caption', options.caption);
    }
    
    if (options.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata));
    }

    // Upload with progress tracking
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      // Track upload progress
      if (options.onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            options.onProgress!(progress);
          }
        });
      }

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            console.log('✅ Backend upload successful!');
            console.log('   URL:', result.url);
            resolve(result);
          } catch (e) {
            reject({
              success: false,
              error: 'Failed to parse response',
            });
          }
        } else {
          console.error('❌ Backend upload failed:', xhr.status);
          try {
            const error = JSON.parse(xhr.responseText);
            reject(error);
          } catch (e) {
            reject({
              success: false,
              error: `Upload failed with status ${xhr.status}`,
            });
          }
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        console.error('❌ Network error during upload');
        reject({
          success: false,
          error: 'Network error - is the backend server running?',
        });
      });

      // Send request
      xhr.open('POST', `${API_BASE_URL}/api/upload`);
      xhr.send(formData);
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Check if backend API is available
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}

/**
 * Fetch user's uploaded files from S3
 */
export async function fetchUserFiles(userId: string): Promise<{
  success: boolean;
  files?: Array<{
    key: string;
    url: string;
    size: number;
    lastModified: string;
    type: string;
  }>;
  error?: string;
}> {
  try {
    console.log('📂 Fetching files for user:', userId);
    const response = await fetch(`${API_BASE_URL}/api/files/${encodeURIComponent(userId)}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Fetched', data.files.length, 'files');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching files:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch files',
    };
  }
}

/**
 * Delete a file from S3
 */
export async function deleteFile(userId: string, fileKey: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log('🗑️  Deleting file:', fileKey);
    const response = await fetch(
      `${API_BASE_URL}/api/files/${encodeURIComponent(userId)}/${encodeURIComponent(fileKey)}`,
      { method: 'DELETE' }
    );
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ File deleted successfully');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file',
    };
  }
}
