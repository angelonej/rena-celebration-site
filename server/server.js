/**
 * Backend API for S3 uploads
 * Handles uploads securely using IAM credentials server-side
 */

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
const envPath = path.resolve(__dirname, '..', '.env');
console.log('📄 Loading .env from:', envPath);
config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configure multer for file uploads (store in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// Initialize S3 client
console.log('🔍 Loading AWS credentials from environment:');
console.log('   Access Key ID:', process.env.VITE_AWS_ACCESS_KEY_ID);
console.log('   Secret Key (first 4 chars):', process.env.VITE_AWS_SECRET_ACCESS_KEY?.substring(0, 4));
console.log('   Region:', process.env.VITE_AWS_REGION);
console.log('   Bucket:', process.env.VITE_AWS_S3_BUCKET);

const s3Client = new S3Client({
  region: process.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

// Helper function to sanitize user ID for S3 path
function sanitizeUserId(userId) {
  return userId.replace(/[^a-zA-Z0-9-_]/g, '_').toLowerCase();
}

// Helper function to get file type category
function getFileTypeCategory(mimetype) {
  if (mimetype.startsWith('image/')) return 'images';
  if (mimetype.startsWith('video/')) return 'videos';
  if (mimetype.startsWith('audio/')) return 'audios';
  return 'files';
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Upload API is running' });
});

// List user's uploaded files
app.get('/api/files/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sanitizedUserId = sanitizeUserId(userId);

    console.log('📂 Listing files for user:', sanitizedUserId);

    const { ListObjectsV2Command } = await import('@aws-sdk/client-s3');
    const command = new ListObjectsV2Command({
      Bucket: process.env.VITE_AWS_S3_BUCKET,
      Prefix: `users/${sanitizedUserId}/`,
    });

    const response = await s3Client.send(command);
    
    const files = (response.Contents || []).map(item => ({
      key: item.Key,
      url: `https://${process.env.VITE_AWS_S3_BUCKET}.s3.${process.env.VITE_AWS_REGION}.amazonaws.com/${item.Key}`,
      size: item.Size,
      lastModified: item.LastModified,
      // Extract file type from path
      type: item.Key.includes('/images/') ? 'image' : 
            item.Key.includes('/videos/') ? 'video' : 
            item.Key.includes('/audios/') ? 'audio' : 'file',
    }));

    console.log('✅ Found', files.length, 'files');
    res.json({ success: true, files });

  } catch (error) {
    console.error('❌ Error listing files:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to list files',
    });
  }
});

// Delete file endpoint
app.delete('/api/files/:userId/:fileKey(*)', async (req, res) => {
  try {
    const { userId, fileKey } = req.params;
    const sanitizedUserId = sanitizeUserId(userId);

    console.log('🗑️  Delete request received');
    console.log('   User ID:', userId);
    console.log('   Sanitized User ID:', sanitizedUserId);
    console.log('   File Key (raw):', fileKey);
    console.log('   File Key (decoded):', decodeURIComponent(fileKey));

    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
    const command = new DeleteObjectCommand({
      Bucket: process.env.VITE_AWS_S3_BUCKET,
      Key: decodeURIComponent(fileKey), // Decode the key
    });

    console.log('   Sending delete command to S3...');
    await s3Client.send(command);
    
    console.log('✅ File deleted successfully from S3');
    res.json({ success: true, message: 'File deleted successfully' });

  } catch (error) {
    console.error('❌ Error deleting file:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete file',
    });
  }
});

// Upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId, caption, metadata } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log('📤 Upload request received');
    console.log('   User:', userId);
    console.log('   File:', req.file.originalname);
    console.log('   Size:', req.file.size, 'bytes');
    console.log('   Type:', req.file.mimetype);

    // Generate S3 key
    const sanitizedUserId = sanitizeUserId(userId);
    const fileTypeCategory = getFileTypeCategory(req.file.mimetype);
    const fileName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    // Use filename without timestamp to enable overwriting
    const s3Key = `users/${sanitizedUserId}/${fileTypeCategory}/${fileName}`;

    console.log('📁 S3 Key:', s3Key);

    // Prepare metadata
    const uploadTimestamp = Date.now();
    const s3Metadata = {
      'user-id': sanitizedUserId,
      'original-name': req.file.originalname,
      'upload-timestamp': uploadTimestamp.toString(),
    };

    if (caption) {
      s3Metadata['caption'] = caption;
    }

    if (metadata) {
      try {
        const parsedMetadata = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
        Object.assign(s3Metadata, parsedMetadata);
      } catch (e) {
        console.warn('Failed to parse metadata:', e);
      }
    }

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.VITE_AWS_S3_BUCKET,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      Metadata: s3Metadata,
    });

    console.log('☁️  Uploading to S3...');
    await s3Client.send(command);
    console.log('✅ Upload successful!');

    // Generate public URL
    const publicUrl = `https://${process.env.VITE_AWS_S3_BUCKET}.s3.${process.env.VITE_AWS_REGION}.amazonaws.com/${s3Key}`;

    res.json({
      success: true,
      url: publicUrl,
      key: s3Key,
      metadata: {
        size: req.file.size,
        type: req.file.mimetype,
        uploadedAt: new Date(uploadTimestamp).toISOString(),
      },
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Upload API server running on http://localhost:${PORT}`);
  console.log(`📦 Bucket: ${process.env.VITE_AWS_S3_BUCKET}`);
  console.log(`🌍 Region: ${process.env.VITE_AWS_REGION}`);
});
