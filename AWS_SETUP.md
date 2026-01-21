# AWS S3 Setup Guide for Memorial Site

This guide will walk you through setting up AWS S3 for uploading and storing media files (photos, videos, and audio) for the memorial celebration site.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Create S3 Bucket](#create-s3-bucket)
3. [Configure CORS](#configure-cors)
4. [Set Up IAM User](#set-up-iam-user)
5. [Configure Environment Variables](#configure-environment-variables)
6. [Security Best Practices](#security-best-practices)
7. [Folder Structure](#folder-structure)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- AWS Account ([Sign up here](https://aws.amazon.com/))
- AWS CLI installed (optional but recommended)
- Basic knowledge of AWS services

---

## Create S3 Bucket

### Step 1: Sign in to AWS Console
1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Navigate to **S3** service

### Step 2: Create a New Bucket
1. Click **"Create bucket"**
2. Enter a unique bucket name (e.g., `rena-memorial-media`)
3. Choose your AWS Region (e.g., `us-east-1`)
4. **Block Public Access settings:**
   - Uncheck "Block all public access" (we'll configure specific access later)
   - Acknowledge the warning
5. **Bucket Versioning:** Enable (recommended for backup)
6. **Tags (optional):**
   - Key: `Project`, Value: `MemorialSite`
   - Key: `Environment`, Value: `Production`
7. Click **"Create bucket"**

### Step 3: Configure Bucket Policy
1. Select your bucket
2. Go to **Permissions** tab
3. Scroll to **Bucket policy**
4. Click **Edit** and paste the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::rena-memorial-media/*"
    }
  ]
}
```

**Note:** Replace `rena-memorial-media` with your actual bucket name.

---

## Configure CORS

CORS (Cross-Origin Resource Sharing) allows your website to upload files directly to S3.

### Step 1: Set CORS Configuration
1. In your S3 bucket, go to **Permissions** tab
2. Scroll to **Cross-origin resource sharing (CORS)**
3. Click **Edit** and paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": ["ETag", "x-amz-server-side-encryption"],
    "MaxAgeSeconds": 3000
  }
]
```

**Note:** Update `AllowedOrigins` with your actual domain(s).

---

## Set Up IAM User

### Step 1: Create IAM User
1. Navigate to **IAM** service in AWS Console
2. Click **Users** → **Add users**
3. User name: `memorial-site-uploader`
4. Select **Access key - Programmatic access**
5. Click **Next: Permissions**

### Step 2: Attach Permissions
1. Click **Attach existing policies directly**
2. Click **Create policy**
3. Select **JSON** tab and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::rena-memorial-media",
        "arn:aws:s3:::rena-memorial-media/*"
      ]
    }
  ]
}
```

4. Click **Review policy**
5. Name: `MemorialSiteS3UploadPolicy`
6. Click **Create policy**
7. Go back to user creation and attach this new policy
8. Click **Next: Tags** → **Next: Review** → **Create user**

### Step 3: Save Credentials
**IMPORTANT:** Save the **Access Key ID** and **Secret Access Key** immediately. You won't be able to view the secret key again!

---

## Configure Environment Variables

### Step 1: Create .env File
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your AWS credentials:
   ```env
   VITE_AWS_REGION=us-east-1
   VITE_AWS_S3_BUCKET=rena-memorial-media
   VITE_AWS_ACCESS_KEY_ID=your-access-key-id-here
   VITE_AWS_SECRET_ACCESS_KEY=your-secret-access-key-here
   ```

### Step 2: Verify Configuration
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Upload page
3. Toggle on "AWS S3 Upload"
4. Try uploading a test image

---

## Security Best Practices

### ⚠️ Important Security Considerations

#### 1. **Never Commit Credentials**
- Add `.env` to `.gitignore` (already done)
- Never hardcode credentials in source code
- Use environment variables only

#### 2. **Production Recommendations**

For production environments, **DO NOT** store AWS credentials in the frontend. Instead:

**Option A: Use AWS Cognito (Recommended)**
```typescript
// Authenticate users with Cognito
// Get temporary credentials with limited permissions
// Users can only upload to their own folder
```

**Option B: Backend API Proxy**
```typescript
// Frontend → Your Backend API → AWS S3
// Backend validates user and generates signed URLs
// More secure as credentials stay on server
```

**Option C: Pre-signed URLs**
```typescript
// Backend generates time-limited pre-signed URLs
// Frontend uploads directly to S3 using signed URL
// No credentials exposed to frontend
```

#### 3. **Bucket Security Checklist**
- ✅ Enable bucket versioning
- ✅ Enable server-side encryption (SSE-S3 or SSE-KMS)
- ✅ Enable CloudWatch logging
- ✅ Set up lifecycle policies to manage storage costs
- ✅ Implement MFA Delete for extra protection
- ✅ Regularly audit IAM policies
- ✅ Use AWS CloudTrail for API logging

#### 4. **Cost Management**
- Set up billing alerts in AWS
- Implement S3 Intelligent-Tiering for cost optimization
- Configure lifecycle rules to move old files to cheaper storage classes

---

## Folder Structure

The application automatically organizes uploads by user:

```
rena-memorial-media/
├── users/
│   ├── john_doe_example_com/
│   │   ├── images/
│   │   │   ├── 1705234567890_photo1.jpg
│   │   │   ├── 1705234568123_photo2.png
│   │   │   └── ...
│   │   ├── videos/
│   │   │   ├── 1705234569456_video1.mp4
│   │   │   └── ...
│   │   └── audios/
│   │       ├── 1705234570789_song1.mp3
│   │       └── ...
│   ├── jane_smith_example_com/
│   │   ├── images/
│   │   ├── videos/
│   │   └── audios/
│   └── ...
```

### Naming Convention
- User folders: Email/name sanitized (e.g., `john.doe@example.com` → `john_doe_example_com`)
- Files: `{timestamp}_{sanitized_filename}.{ext}`
- All special characters replaced with underscores

---

## Troubleshooting

### Error: "Missing AWS configuration"
**Solution:** Ensure all environment variables are set in `.env` file and restart the dev server.

### Error: "Access Denied"
**Solutions:**
1. Verify IAM user has correct permissions
2. Check bucket policy allows public read access
3. Ensure CORS configuration includes your domain

### Error: "CORS policy error"
**Solutions:**
1. Add your domain to CORS AllowedOrigins
2. Verify CORS headers include necessary methods
3. Clear browser cache and try again

### Uploads are slow
**Solutions:**
1. Check your internet connection
2. Verify you selected appropriate AWS region (closer is faster)
3. Consider implementing multipart uploads for large files (already implemented for files > 5MB)

### Files not visible after upload
**Solutions:**
1. Verify bucket policy allows public read
2. Check file was uploaded successfully in S3 console
3. Ensure correct bucket name and region in configuration

---

## Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [S3 Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html)
- [AWS Cognito for User Authentication](https://aws.amazon.com/cognito/)
- [Pre-signed URLs Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)

---

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review AWS CloudWatch logs
3. Check browser console for detailed error messages
4. Verify all configuration steps were completed

---

## Next Steps

After completing this setup:

1. ✅ Test uploads with different file types
2. ✅ Verify files are accessible via generated URLs
3. ✅ Monitor initial costs in AWS Billing Dashboard
4. ✅ Set up CloudWatch alarms for unusual activity
5. ✅ Plan migration to Cognito for production deployment

**Remember:** The current configuration is suitable for development and testing. For production, implement one of the recommended security options above.
