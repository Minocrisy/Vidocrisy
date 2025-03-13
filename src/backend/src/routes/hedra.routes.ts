import express from 'express';
import hedraService from '../services/hedra.service.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import env from '../config/env.js';

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';
    
    if (file.mimetype.startsWith('audio')) {
      uploadPath = path.join(env.uploadsDir, 'audio');
    } else if (file.mimetype.startsWith('image')) {
      uploadPath = path.join(env.uploadsDir, 'images');
    } else {
      uploadPath = env.uploadsDir;
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: env.maxVideoSize }
});

// Generate a video using Hedra API
router.post('/generate', async (req, res) => {
  try {
    const { script, avatar, voice, emotions, resolution, aspectRatio } = req.body;
    
    // Validate required fields
    if (!script || !avatar) {
      return res.status(400).json({ error: 'Script and avatar are required' });
    }
    
    // Call Hedra service to generate video
    const result = await hedraService.generateVideo({
      script,
      avatar,
      voice,
      emotions,
      resolution,
      aspectRatio
    });
    
    res.status(200).json({
      message: 'Video generation request submitted',
      jobId: result.jobId,
      estimatedTime: result.estimatedTime,
      details: {
        script,
        avatar,
        voice: voice || avatar, // Default to avatar name if voice not specified
        emotions: emotions || [],
        resolution: resolution || '720p',
        aspectRatio: aspectRatio || '16:9'
      }
    });
  } catch (error: any) {
    console.error('Error generating video:', error);
    res.status(500).json({ 
      error: 'Failed to generate video',
      details: error.message || 'Unknown error'
    });
  }
});

// Check the status of a video generation job
router.get('/status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Call Hedra service to check job status
    const status = await hedraService.checkJobStatus(jobId) as any;
    
    res.status(200).json({
      jobId,
      status: status.status || 'unknown',
      progress: status.progress || 0,
      message: `Job is ${status.status || 'unknown'}`,
      videoUrl: status.videoUrl || null
    });
  } catch (error: any) {
    console.error('Error checking job status:', error);
    res.status(500).json({ 
      error: 'Failed to check job status',
      details: error.message || 'Unknown error'
    });
  }
});

// Get available avatars
router.get('/avatars', async (req, res) => {
  try {
    const avatars = await hedraService.getAvatars();
    res.status(200).json({ avatars });
  } catch (error: any) {
    console.error('Error fetching avatars:', error);
    res.status(500).json({ 
      error: 'Failed to fetch avatars',
      details: error.message || 'Unknown error'
    });
  }
});

// Get available voices
router.get('/voices', async (req, res) => {
  try {
    const voices = await hedraService.getVoices();
    res.status(200).json({ voices });
  } catch (error: any) {
    console.error('Error fetching voices:', error);
    res.status(500).json({ 
      error: 'Failed to fetch voices',
      details: error.message || 'Unknown error'
    });
  }
});

// Upload audio file
router.post('/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }
    
    const audioUrl = await hedraService.uploadAudio(req.file.path);
    
    res.status(200).json({
      message: 'Audio uploaded successfully',
      audioUrl
    });
  } catch (error: any) {
    console.error('Error uploading audio:', error);
    res.status(500).json({ 
      error: 'Failed to upload audio',
      details: error.message || 'Unknown error'
    });
  }
});

// Upload image file
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    
    const aspectRatio = req.query.aspectRatio as string || '1:1';
    const imageUrl = await hedraService.uploadImage(req.file.path, aspectRatio);
    
    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message || 'Unknown error'
    });
  }
});

export default router;
