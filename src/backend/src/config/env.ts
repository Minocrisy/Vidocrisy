import dotenv from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../../../.env') });

export default {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API keys
  hedraApiKey: process.env.HEDRA_API_KEY || '',
  runwayApiKey: process.env.RUNWAY_API_KEY || '',
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || '',
  elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ID || '',
  
  // Storage paths
  uploadsDir: join(__dirname, '../../../uploads'),
  videosDir: join(__dirname, '../../../uploads/videos'),
  imagesDir: join(__dirname, '../../../uploads/images'),
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Video processing
  maxVideoSize: 100 * 1024 * 1024, // 100MB
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};
