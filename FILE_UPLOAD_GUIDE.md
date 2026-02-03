# File Upload Implementation Guide

Currently, `UploadFile` in `src/api/integrations.js` uses a **mock implementation**. Files are converted to temporary blob URLs which work for development but don't persist.

## Option 1: Add File Upload to Backend (Recommended)

### 1. Install multer for file handling

```bash
cd backend
npm install multer
```

### 2. Create upload route in backend

Create `backend/src/routes/upload.js`:

```javascript
import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// POST /api/upload
router.post('/', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.json({
    url: fileUrl,
    filename: req.file.originalname,
    size: req.file.size,
    type: req.file.mimetype,
  });
});

export default router;
```

### 3. Add to server.js

```javascript
import uploadRoutes from './routes/upload.js';

// Create uploads directory
import fs from 'fs';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Add upload route
app.use('/api/upload', uploadRoutes);
```

### 4. Update frontend integrations.js

```javascript
export const UploadFile = async ({ file, folder = 'uploads', public: isPublic = true }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('public', isPublic);

    const token = localStorage.getItem('auth_token');

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
};
```

## Option 2: Use Cloud Storage (AWS S3, Cloudinary, etc.)

### Using AWS S3

1. Install AWS SDK:
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

2. Update integrations.js:
```javascript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export const UploadFile = async ({ file, folder = 'uploads' }) => {
  const key = `${folder}/${Date.now()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: import.meta.env.VITE_AWS_BUCKET,
    Key: key,
    Body: file,
    ContentType: file.type,
  });

  await s3Client.send(command);

  const url = `https://${import.meta.env.VITE_AWS_BUCKET}.s3.amazonaws.com/${key}`;

  return {
    url,
    filename: file.name,
    size: file.size,
    type: file.type,
  };
};
```

### Using Cloudinary

1. Install Cloudinary SDK:
```bash
npm install cloudinary
```

2. Create backend upload endpoint with Cloudinary:
```javascript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    res.json({
      url: result.secure_url,
      filename: req.file.originalname,
      size: result.bytes,
      type: req.file.mimetype,
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});
```

## Option 3: Use Free Services for Development

### ImgBB (Free image hosting)
```javascript
export const UploadFile = async ({ file }) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  return {
    url: data.data.url,
    filename: file.name,
    size: file.size,
  };
};
```

## Current Mock Implementation

The current implementation creates temporary blob URLs:

```javascript
const mockUrl = URL.createObjectURL(file);
```

**Limitations:**
- Files only exist in browser memory
- Lost on page reload
- Not accessible from other devices
- Only works for images/files displayed in current session

**Good for:**
- Initial development and testing
- Quick prototyping
- Previewing uploads before implementing real storage

## Recommendation

For production, use **Option 1** (backend upload) for simplicity, or **Option 2** (cloud storage) for scalability.

For development, the current mock implementation works fine for testing UI/UX.
