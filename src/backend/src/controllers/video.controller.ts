import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import storageService, { VideoMetadata } from '../services/storage.service.js';
import env from '../config/env.js';

// Define video controller
const videoController = {
  /**
   * Get all videos
   */
  getAllVideos: async (req: Request, res: Response) => {
    try {
      const { source, category, tags, limit, offset } = req.query;
      
      // Parse query parameters
      const options: {
        source?: 'hedra' | 'runway' | 'upload' | 'edited';
        category?: string;
        tags?: string[];
        limit?: number;
        offset?: number;
      } = {};
      
      if (source && ['hedra', 'runway', 'upload', 'edited'].includes(source as string)) {
        options.source = source as 'hedra' | 'runway' | 'upload' | 'edited';
      }
      
      if (category) {
        options.category = category as string;
      }
      
      if (tags) {
        options.tags = (tags as string).split(',');
      }
      
      if (limit) {
        options.limit = parseInt(limit as string, 10);
      }
      
      if (offset) {
        options.offset = parseInt(offset as string, 10);
      }
      
      // Get videos
      const videos = await storageService.getAllVideos(options);
      
      res.status(200).json({ videos });
    } catch (error: any) {
      console.error('Error getting videos:', error);
      res.status(500).json({ 
        error: 'Failed to get videos',
        details: error.message || 'Unknown error'
      });
    }
  },
  
  /**
   * Get video by ID
   */
  getVideoById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Get video metadata
      const video = await storageService.getVideoMetadata(id);
      
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      
      res.status(200).json({ video });
    } catch (error: any) {
      console.error('Error getting video:', error);
      res.status(500).json({ 
        error: 'Failed to get video',
        details: error.message || 'Unknown error'
      });
    }
  },
  
  /**
   * Upload a video
   */
  uploadVideo: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
      }
      
      const { category, tags, description } = req.body;
      
      // Save video to storage
      const metadata = await storageService.saveVideo(req.file.path, {
        source: 'upload',
        originalName: req.file.originalname,
        category,
        tags: tags ? tags.split(',') : undefined,
        description
      });
      
      res.status(201).json({
        message: 'Video uploaded successfully',
        video: metadata
      });
    } catch (error: any) {
      console.error('Error uploading video:', error);
      res.status(500).json({ 
        error: 'Failed to upload video',
        details: error.message || 'Unknown error'
      });
    }
  },
  
  /**
   * Delete a video
   */
  deleteVideo: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Delete video
      const deleted = await storageService.deleteVideo(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Video not found' });
      }
      
      res.status(200).json({
        message: 'Video deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting video:', error);
      res.status(500).json({ 
        error: 'Failed to delete video',
        details: error.message || 'Unknown error'
      });
    }
  },
  
  /**
   * Update video metadata
   */
  updateVideo: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { category, tags, description } = req.body;
      
      // Create updates object
      const updates: Partial<VideoMetadata> = {};
      
      if (category !== undefined) {
        updates.category = category;
      }
      
      if (tags !== undefined) {
        updates.tags = tags.split(',');
      }
      
      if (description !== undefined) {
        updates.description = description;
      }
      
      // Update video metadata
      const updatedVideo = await storageService.updateVideoMetadata(id, updates);
      
      if (!updatedVideo) {
        return res.status(404).json({ error: 'Video not found' });
      }
      
      res.status(200).json({
        message: 'Video updated successfully',
        video: updatedVideo
      });
    } catch (error: any) {
      console.error('Error updating video:', error);
      res.status(500).json({ 
        error: 'Failed to update video',
        details: error.message || 'Unknown error'
      });
    }
  },
  
  /**
   * Save a generated video from Hedra
   */
  saveGeneratedVideo: async (req: Request, res: Response) => {
    try {
      const { videoUrl, source, category, tags, description } = req.body;
      
      if (!videoUrl) {
        return res.status(400).json({ error: 'Video URL is required' });
      }
      
      if (!source || !['hedra', 'runway'].includes(source)) {
        return res.status(400).json({ error: 'Valid source is required (hedra or runway)' });
      }
      
      // Download video from URL
      // In a real implementation, you would download the video from the URL
      // For now, we'll just create a placeholder file
      const tempFilePath = path.join(env.uploadsDir, `temp-${Date.now()}.mp4`);
      fs.writeFileSync(tempFilePath, 'Placeholder video content');
      
      // Save video to storage
      const metadata = await storageService.saveVideo(tempFilePath, {
        source: source as 'hedra' | 'runway',
        category,
        tags: tags ? tags.split(',') : undefined,
        description
      });
      
      // Delete temporary file
      fs.unlinkSync(tempFilePath);
      
      res.status(201).json({
        message: 'Generated video saved successfully',
        video: metadata
      });
    } catch (error: any) {
      console.error('Error saving generated video:', error);
      res.status(500).json({ 
        error: 'Failed to save generated video',
        details: error.message || 'Unknown error'
      });
    }
  },
  
  /**
   * Stream a video
   */
  streamVideo: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Get video metadata
      const video = await storageService.getVideoMetadata(id);
      
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      
      // Check if file exists
      if (!fs.existsSync(video.path)) {
        return res.status(404).json({ error: 'Video file not found' });
      }
      
      // Get file stats
      const stat = fs.statSync(video.path);
      const fileSize = stat.size;
      const range = req.headers.range;
      
      if (range) {
        // Parse range
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;
        const file = fs.createReadStream(video.path, { start, end });
        
        // Set headers
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4'
        });
        
        // Stream file
        file.pipe(res);
      } else {
        // Set headers
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4'
        });
        
        // Stream file
        fs.createReadStream(video.path).pipe(res);
      }
    } catch (error: any) {
      console.error('Error streaming video:', error);
      res.status(500).json({ 
        error: 'Failed to stream video',
        details: error.message || 'Unknown error'
      });
    }
  }
};

export default videoController;
