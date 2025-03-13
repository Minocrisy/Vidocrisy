import express from 'express';
import multer from 'multer';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, '../../uploads/videos'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
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
router.get('/', (req, res) => {
  // This would be replaced with actual controller logic
  res.status(200).json({ message: 'Get all videos' });
});

// Get a single video by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: `Get video with ID: ${id}` });
});

// Upload a new video
router.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded' });
  }
  
  res.status(201).json({ 
    message: 'Video uploaded successfully',
    video: {
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    }
  });
});

// Delete a video
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: `Delete video with ID: ${id}` });
});

// Combine videos
router.post('/combine', (req, res) => {
  const { videos, transitions } = req.body;
  
  if (!videos || !Array.isArray(videos) || videos.length < 2) {
    return res.status(400).json({ error: 'At least two videos are required' });
  }
  
  res.status(200).json({ 
    message: 'Videos combined successfully',
    videos,
    transitions: transitions || []
  });
});

// Add branding to video
router.post('/:id/brand', (req, res) => {
  const { id } = req.params;
  const { intro, outro, lowerThird } = req.body;
  
  res.status(200).json({ 
    message: `Branding added to video with ID: ${id}`,
    branding: { intro, outro, lowerThird }
  });
});

export default router;
