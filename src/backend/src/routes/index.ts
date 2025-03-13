import express from 'express';
import videoRoutes from './video.routes.js';
import hedraRoutes from './hedra.routes.js';
import runwayRoutes from './runway.routes.js';
import editorRoutes from './editor.routes.js';

const router = express.Router();

// Health check for API
router.get('/', (req, res) => {
  res.status(200).json({ message: 'VideoGen API is running' });
});

// Mount routes
router.use('/videos', videoRoutes);
router.use('/hedra', hedraRoutes);
router.use('/runway', runwayRoutes);
router.use('/editor', editorRoutes);

export default router;
