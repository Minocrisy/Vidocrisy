import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import env from '../config/env.js';

// Promisify fs functions
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const rename = promisify(fs.rename);
const copyFile = promisify(fs.copyFile);

// Define video metadata interface
export interface VideoMetadata {
  id: string;
  filename: string;
  originalName?: string;
  path: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  tags?: string[];
  source: 'hedra' | 'runway' | 'upload' | 'edited';
  description?: string;
}

// Define storage service
const storageService = {
  /**
   * Initialize storage directories
   */
  init: async () => {
    try {
      // Ensure uploads directory exists
      if (!fs.existsSync(env.uploadsDir)) {
        await mkdir(env.uploadsDir, { recursive: true });
      }
      
      // Ensure videos directory exists
      if (!fs.existsSync(env.videosDir)) {
        await mkdir(env.videosDir, { recursive: true });
      }
      
      // Ensure images directory exists
      if (!fs.existsSync(env.imagesDir)) {
        await mkdir(env.imagesDir, { recursive: true });
      }
      
      // Create subdirectories for organization
      const videoDirs = ['hedra', 'runway', 'uploads', 'edited'];
      for (const dir of videoDirs) {
        const dirPath = path.join(env.videosDir, dir);
        if (!fs.existsSync(dirPath)) {
          await mkdir(dirPath, { recursive: true });
        }
      }
      
      console.log('Storage directories initialized');
    } catch (error) {
      console.error('Error initializing storage directories:', error);
      throw error;
    }
  },
  
  /**
   * Save a video file to storage
   */
  saveVideo: async (
    filePath: string, 
    options: {
      source: 'hedra' | 'runway' | 'upload' | 'edited';
      originalName?: string;
      category?: string;
      tags?: string[];
      description?: string;
    }
  ): Promise<VideoMetadata> => {
    try {
      const { source, originalName, category, tags, description } = options;
      
      // Generate a unique ID for the video
      const id = `${source}-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      
      // Get file extension
      const ext = path.extname(filePath);
      
      // Create destination filename
      const filename = `${id}${ext}`;
      
      // Create destination path
      const destDir = path.join(env.videosDir, source);
      const destPath = path.join(destDir, filename);
      
      // Copy file to destination
      await copyFile(filePath, destPath);
      
      // Get file stats
      const stats = await stat(destPath);
      
      // Create video metadata
      const metadata: VideoMetadata = {
        id,
        filename,
        originalName,
        path: destPath,
        url: `/uploads/videos/${source}/${filename}`,
        size: stats.size,
        createdAt: new Date(),
        updatedAt: new Date(),
        category,
        tags,
        source,
        description
      };
      
      // Save metadata to JSON file
      await storageService.saveMetadata(metadata);
      
      return metadata;
    } catch (error) {
      console.error('Error saving video:', error);
      throw error;
    }
  },
  
  /**
   * Save video metadata to JSON file
   */
  saveMetadata: async (metadata: VideoMetadata): Promise<void> => {
    try {
      const metadataDir = path.join(env.videosDir, 'metadata');
      
      // Ensure metadata directory exists
      if (!fs.existsSync(metadataDir)) {
        await mkdir(metadataDir, { recursive: true });
      }
      
      // Create metadata file path
      const metadataPath = path.join(metadataDir, `${metadata.id}.json`);
      
      // Write metadata to file
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    } catch (error) {
      console.error('Error saving metadata:', error);
      throw error;
    }
  },
  
  /**
   * Get video metadata by ID
   */
  getVideoMetadata: async (id: string): Promise<VideoMetadata | null> => {
    try {
      const metadataPath = path.join(env.videosDir, 'metadata', `${id}.json`);
      
      // Check if metadata file exists
      if (!fs.existsSync(metadataPath)) {
        return null;
      }
      
      // Read metadata file
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      
      return metadata;
    } catch (error) {
      console.error('Error getting video metadata:', error);
      throw error;
    }
  },
  
  /**
   * Get all videos
   */
  getAllVideos: async (options?: {
    source?: 'hedra' | 'runway' | 'upload' | 'edited';
    category?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<VideoMetadata[]> => {
    try {
      const metadataDir = path.join(env.videosDir, 'metadata');
      
      // Ensure metadata directory exists
      if (!fs.existsSync(metadataDir)) {
        await mkdir(metadataDir, { recursive: true });
        return [];
      }
      
      // Get all metadata files
      const files = await readdir(metadataDir);
      
      // Filter JSON files
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      // Read all metadata files
      const metadataPromises = jsonFiles.map(async file => {
        const filePath = path.join(metadataDir, file);
        const content = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(content) as VideoMetadata;
      });
      
      let metadata = await Promise.all(metadataPromises);
      
      // Apply filters
      if (options) {
        if (options.source) {
          metadata = metadata.filter(m => m.source === options.source);
        }
        
        if (options.category) {
          metadata = metadata.filter(m => m.category === options.category);
        }
        
        if (options.tags && options.tags.length > 0) {
          metadata = metadata.filter(m => {
            if (!m.tags) return false;
            return options.tags!.some(tag => m.tags!.includes(tag));
          });
        }
        
        // Sort by createdAt (newest first)
        metadata.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        
        // Apply pagination
        if (options.offset !== undefined && options.limit !== undefined) {
          metadata = metadata.slice(options.offset, options.offset + options.limit);
        } else if (options.limit !== undefined) {
          metadata = metadata.slice(0, options.limit);
        }
      }
      
      return metadata;
    } catch (error) {
      console.error('Error getting all videos:', error);
      throw error;
    }
  },
  
  /**
   * Delete a video
   */
  deleteVideo: async (id: string): Promise<boolean> => {
    try {
      // Get video metadata
      const metadata = await storageService.getVideoMetadata(id);
      
      if (!metadata) {
        return false;
      }
      
      // Delete video file
      if (fs.existsSync(metadata.path)) {
        await unlink(metadata.path);
      }
      
      // Delete thumbnail if exists
      if (metadata.thumbnailUrl) {
        const thumbnailPath = path.join(env.uploadsDir, metadata.thumbnailUrl.replace('/uploads/', ''));
        if (fs.existsSync(thumbnailPath)) {
          await unlink(thumbnailPath);
        }
      }
      
      // Delete metadata file
      const metadataPath = path.join(env.videosDir, 'metadata', `${id}.json`);
      if (fs.existsSync(metadataPath)) {
        await unlink(metadataPath);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },
  
  /**
   * Update video metadata
   */
  updateVideoMetadata: async (id: string, updates: Partial<VideoMetadata>): Promise<VideoMetadata | null> => {
    try {
      // Get existing metadata
      const metadata = await storageService.getVideoMetadata(id);
      
      if (!metadata) {
        return null;
      }
      
      // Update metadata
      const updatedMetadata = {
        ...metadata,
        ...updates,
        updatedAt: new Date()
      };
      
      // Save updated metadata
      await storageService.saveMetadata(updatedMetadata);
      
      return updatedMetadata;
    } catch (error) {
      console.error('Error updating video metadata:', error);
      throw error;
    }
  },
  
  /**
   * Create a thumbnail for a video
   * Note: This is a placeholder. In a real implementation, you would use FFmpeg to generate a thumbnail.
   */
  createThumbnail: async (videoPath: string, videoId: string): Promise<string> => {
    try {
      // In a real implementation, you would use FFmpeg to generate a thumbnail
      // For now, we'll just return a placeholder
      const thumbnailUrl = `/uploads/images/thumbnails/${videoId}.jpg`;
      
      return thumbnailUrl;
    } catch (error) {
      console.error('Error creating thumbnail:', error);
      throw error;
    }
  }
};

export default storageService;
