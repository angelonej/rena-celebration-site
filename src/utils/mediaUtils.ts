/**
 * Media utility functions for validation, compression, and processing
 */

export interface MediaValidation {
  isValid: boolean;
  error?: string;
  fileType: 'image' | 'video' | 'audio' | 'unknown';
}
export interface ProcessedMedia {
  original: File;
  compressed?: Blob;
  thumbnail?: string;
  metadata: MediaMetadata;
}
export interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number;
  size: number;
  type: string;
  name: string;
}

// File type validation
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
  audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
};
const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024,
  // 10MB
  video: 100 * 1024 * 1024,
  // 100MB
  audio: 20 * 1024 * 1024 // 20MB
};
export function validateFile(file: File): MediaValidation {
  // Determine file type
  let fileType: 'image' | 'video' | 'audio' | 'unknown' = 'unknown';
  if (ALLOWED_TYPES.image.includes(file.type)) {
    fileType = 'image';
  } else if (ALLOWED_TYPES.video.includes(file.type)) {
    fileType = 'video';
  } else if (ALLOWED_TYPES.audio.includes(file.type)) {
    fileType = 'audio';
  }

  // Check if file type is allowed
  if (fileType === 'unknown') {
    return {
      isValid: false,
      error: 'File type not supported. Please upload images (JPG, PNG, GIF, WebP), videos (MP4, MOV, AVI), or audio (MP3, WAV).',
      fileType
    };
  }

  // Check file size
  const maxSize = MAX_FILE_SIZES[fileType];
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit for ${fileType} files.`,
      fileType
    };
  }
  return {
    isValid: true,
    fileType
  };
}

// Compress image using canvas
export async function compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = height * maxWidth / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Could not compress image'));
          }
        }, file.type, quality);
      };
      img.onerror = () => reject(new Error('Could not load image'));
    };
    reader.onerror = () => reject(new Error('Could not read file'));
  });
}

// Generate thumbnail for image
export async function generateImageThumbnail(file: File, size = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const aspectRatio = img.width / img.height;
        let width = size;
        let height = size;
        if (aspectRatio > 1) {
          height = size / aspectRatio;
        } else {
          width = size * aspectRatio;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL(file.type));
      };
      img.onerror = () => reject(new Error('Could not load image'));
    };
    reader.onerror = () => reject(new Error('Could not read file'));
  });
}

// Generate thumbnail for video
export async function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 2); // Seek to middle or 1 second
    };
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg'));
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Could not load video'));
    };
  });
}

// Extract metadata from media file
export async function extractMetadata(file: File): Promise<MediaMetadata> {
  const validation = validateFile(file);
  const metadata: MediaMetadata = {
    size: file.size,
    type: file.type,
    name: file.name
  };
  if (validation.fileType === 'image') {
    try {
      const dimensions = await getImageDimensions(file);
      metadata.width = dimensions.width;
      metadata.height = dimensions.height;
    } catch (error) {
      console.error('Could not extract image dimensions:', error);
    }
  } else if (validation.fileType === 'video') {
    try {
      const videoDuration = await getVideoDuration(file);
      metadata.duration = videoDuration;
    } catch (error) {
      console.error('Could not extract video duration:', error);
    }
  } else if (validation.fileType === 'audio') {
    try {
      const audioDuration = await getAudioDuration(file);
      metadata.duration = audioDuration;
    } catch (error) {
      console.error('Could not extract audio duration:', error);
    }
  }
  return metadata;
}

// Get image dimensions
function getImageDimensions(file: File): Promise<{
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Could not load image'));
    };
  });
}

// Get video duration
function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      resolve(video.duration);
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Could not load video'));
    };
  });
}

// Get audio duration
function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
      URL.revokeObjectURL(audio.src);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(audio.src);
      reject(new Error('Could not load audio'));
    };
  });
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Format duration for display
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}