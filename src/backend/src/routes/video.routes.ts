import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import videoController from '../controllers/video.controller.js';
import env from '../config/env.js';
import storageService from '../services/storage.service.js';

// Initialize storage directories
storageService.init().catch(err => {
  console.error('Failed to initialize storage directories:', err);
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create temp directory if it doesn't exist
    const tempDir = path.join(env.uploadsDir, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: env.maxVideoSize }, // Use the configured max video size
  fileFilter: (req, file, cb) => {
    // Accept only video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});

const router = express.Router();

// Get all videos
router.get('/', videoController.getAllVideos);

// Get a single video by ID
router.get('/:id', videoController.getVideoById);

// Stream a video
router.get('/:id/stream', videoController.streamVideo);

// Upload a new video
router.post('/upload', upload.single('video'), videoController.uploadVideo);

// Save a generated video from Hedra or RunwayML
router.post('/save-generated', videoController.saveGeneratedVideo);

// Delete a video
router.delete('/:id', videoController.deleteVideo);

// Update video metadata
router.put('/:id', videoController.updateVideo);

// Combine videos (placeholder for future implementation)
router.post('/combine', (req, res) => {
  const { videos, transitions } = req.body;
  
  if (!videos || !Array.isArray(videos) || videos.length < 2) {
    return res.status(400).json({ error: 'At least two videos are required' });
  }
  
  // This would be replaced with actual video combining logic using FFmpeg
  res.status(200).json({ 
    message: 'Videos combined successfully',
    videos,
    transitions: transitions || []
  });
});

// Add branding to video (placeholder for future implementation)
router.post('/:id/brand', (req, res) => {
  const { id } = req.params;
  const { intro, outro, lowerThird } = req.body;
  
  // This would be replaced with actual branding logic using FFmpeg
  res.status(200).json({ 
    message: `Branding added to video with ID: ${id}`,
    branding: { intro, outro, lowerThird }
  });
});

export default router;
