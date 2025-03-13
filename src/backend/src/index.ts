import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Routes
import apiRoutes from './routes/index.js';

// Services
import storageService from './services/storage.service.js';
import editorService from './services/editor.service.js';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(join(__dirname, '../uploads')));
app.use('/assets', express.static(join(__dirname, '../../public/assets')));
app.use(express.static(join(__dirname, '../../public')));
app.use(express.static(join(__dirname, '../..')));

// API routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Initialize services
Promise.all([
  storageService.init().then(() => console.log('Storage service initialized')),
  editorService.init().then(() => console.log('Editor service initialized'))
])
.catch(err => {
  console.error('Failed to initialize services:', err);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
