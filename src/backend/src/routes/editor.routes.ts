import express from 'express';
import editorController from '../controllers/editor.controller.js';

const router = express.Router();

// Initialize editor service
editorController.init().catch(err => {
  console.error('Failed to initialize editor service:', err);
});

// Concatenate videos
router.post('/concat', editorController.concatenateVideos);

// Trim video
router.post('/trim', editorController.trimVideo);

// Add branding to video
router.post('/brand', editorController.addBranding);

// Apply transition between videos
router.post('/transition', editorController.applyTransition);

// Export video with specific format, resolution, and quality settings
router.post('/export', editorController.exportVideo);

// Get job status
router.get('/job/:jobId', editorController.getJobStatus);

export default router;
