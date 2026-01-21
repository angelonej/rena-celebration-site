# Band Gallery S3 Implementation Prompt

Implement AWS S3 direct browser upload functionality for a band member gallery application with the following requirements:

## Architecture
- **Direct browser uploads** to S3 (no backend server required)
- Uses `@aws-sdk/client-s3` v3 and `@aws-sdk/lib-storage` for multipart uploads
- TypeScript with React frontend

## Folder Structure
Organize S3 files by band member:
```
band-gallery/
  ├── members/
  │   ├── {member-name-sanitized}/
  │   │   ├── images/
  │   │   │   ├── photo1.jpg
  │   │   │   ├── photo2.png
  │   │   └── videos/
  │   │       ├── performance1.mp4
```

## Core Files to Create

### 1. `/src/utils/s3Config.ts`
- Initialize S3Client with credentials from environment variables
- Functions: 
  - `getS3Config()` - Load AWS credentials from env vars
  - `getS3Client()` - Create singleton S3Client instance
  - `generateS3Key()` - Generate organized S3 paths
  - `getPublicUrl()` - Generate public URLs for files
  - `sanitizeUserId()` - Sanitize member names for folder structure
  - `getContentType()` - Detect MIME types
- Generate S3 keys: `members/{sanitized-member-name}/{images|videos}/{filename}`

### 2. `/src/utils/s3Upload.ts`
- `uploadToS3(file, fileName, options)` - Upload with progress tracking
- `listUserFiles(memberId)` - List all files for a member using `ListObjectsV2Command`
- `deleteFromS3(key)` - Delete file using `DeleteObjectCommand`
- Progress tracking interface with loaded/total/percentage
- Multipart upload for files >5MB
- Metadata tagging (uploaded-by, upload-date, original-filename)
- Error handling with specific messages

### 3. Environment Variables (.env)
```env
VITE_AWS_REGION=us-east-2
VITE_AWS_S3_BUCKET=your-band-gallery-bucket
VITE_AWS_ACCESS_KEY_ID=AKIA...
VITE_AWS_SECRET_ACCESS_KEY=your-secret-key
```

## Key Features

### 1. Upload Component
- Drag-and-drop interface
- File validation (type, size limits)
- Image compression before upload
- Progress bars per file
- Preview thumbnails
- Multiple file selection
- Loading states during upload

### 2. Gallery View
- Load member's existing photos on mount via `listUserFiles()`
- Display in grid layout
- Delete button with confirmation
- Filter by image/video type
- Responsive design

### 3. File Management
- Allow file overwriting (no timestamps in keys)
- Auto-refresh gallery after upload/delete
- Handle errors gracefully with user feedback
- Track upload count
- Maintain state across page reloads

## AWS Setup Required

### 1. S3 Bucket Configuration
- Create bucket with public read access or CloudFront distribution
- Enable CORS:
  ```json
  [
    {
      "AllowedOrigins": [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://your-production-domain.com"
      ],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
  ```

### 2. IAM User Permissions
Create an IAM user with the following policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-band-gallery-bucket/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::your-band-gallery-bucket"
    }
  ]
}
```

### 3. Bucket Policy (if using public access)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-band-gallery-bucket/*"
    }
  ]
}
```

## Implementation Examples

### Upload Function Signature
```typescript
interface UploadOptions {
  userId: string;
  fileType: 'image' | 'video' | 'audio';
  metadata?: { [key: string]: string };
  onProgress?: (progress: UploadProgress) => void;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadResult {
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

async function uploadToS3(
  file: File | Blob,
  fileName: string,
  options: UploadOptions
): Promise<UploadResult>
```

### List Files Function Signature
```typescript
interface S3File {
  key: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  size: number;
  lastModified: Date;
}

async function listUserFiles(
  userId: string
): Promise<{ success: boolean; files?: S3File[]; error?: string }>
```

### Delete Function Signature
```typescript
async function deleteFromS3(
  key: string
): Promise<{ success: boolean; error?: string }>
```

## Component Integration

### Upload Component
```typescript
const uploadFiles = async () => {
  for (const fileData of validFiles) {
    const result = await uploadToS3(
      fileData.file,
      fileData.file.name,
      {
        userId: memberName,
        fileType: fileData.type,
        metadata: {
          originalSize: fileData.file.size.toString(),
        },
        onProgress: (progress: UploadProgress) => {
          // Update UI with progress.percentage
        },
      }
    );
    
    if (result.success) {
      // Update state with result.url and result.key
    }
  }
};
```

### Gallery Load
```typescript
useEffect(() => {
  async function loadGallery() {
    const result = await listUserFiles(memberName);
    
    if (result.success && result.files) {
      setPhotos(result.files.filter(f => f.type === 'image'));
      setVideos(result.files.filter(f => f.type === 'video'));
    }
  }
  
  loadGallery();
}, [memberName]);
```

### Delete Handler
```typescript
const handleDelete = async (fileKey: string) => {
  const result = await deleteFromS3(fileKey);
  
  if (result.success) {
    // Refresh gallery
    const updatedFiles = await listUserFiles(memberName);
    setPhotos(updatedFiles.files);
  }
};
```

## Implementation Notes

- **No backend server needed** - all S3 operations happen directly from browser
- Use member ID/name as the folder prefix (sanitized: lowercase, spaces→hyphens, special chars removed)
- Store S3 key in component state for deletion operations
- Call `listUserFiles()` on component mount to load existing photos
- File overwriting: use same filename without timestamps
- Production deployment: Add production domain to S3 CORS and set environment variables in hosting platform
- Handle CORS errors by checking bucket CORS configuration
- Validate AWS credentials before attempting uploads
- Use proper error boundaries for S3 operation failures

## Package Dependencies
```json
{
  "dependencies": {
    "@aws-sdk/client-s3": "^3.x",
    "@aws-sdk/lib-storage": "^3.x",
    "react": "^18.x",
    "framer-motion": "^11.x"
  }
}
```

## Error Handling

Common errors to handle:
- **NetworkError**: Internet connection issues
- **AccessDenied/403**: IAM permissions issue
- **NoSuchBucket/404**: Bucket doesn't exist or wrong name
- **InvalidAccessKeyId**: Wrong access key
- **SignatureDoesNotMatch**: Wrong secret key
- **CORS errors**: Missing CORS configuration

Provide user-friendly error messages for each scenario.

## Security Best Practices

1. Never commit `.env` file to version control
2. Use IAM user with minimal required permissions
3. Rotate access keys regularly
4. Consider using CloudFront with signed URLs for production
5. Implement file size limits (e.g., 100MB max)
6. Validate file types on upload
7. Sanitize all user inputs used in S3 keys
8. Enable S3 bucket versioning for backup

## Production Deployment

1. **Build the application**: `npm run build`
2. **Deploy to hosting** (Amplify, Netlify, Vercel, etc.)
3. **Set environment variables** in hosting platform dashboard
4. **Update S3 CORS** to include production domain
5. **Test uploads** from production environment
6. **Monitor S3 costs** and set up billing alerts

Implement this with proper error handling, loading states, and user feedback for upload/delete operations.
