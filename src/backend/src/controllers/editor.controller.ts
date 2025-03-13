import { Request, Response } from 'express';
import editorService, { ConcatOptions, TrimOptions, BrandingOptions, ExportOptions } from '../services/editor.service.js';

// Define editor controller
const editorController = {
  /**
   * Initialize editor service
   */
  init: async () => {
    try {
      await editorService.init();
      console.log('Editor service initialized');
    } catch (error) {
      console.error('Error initializing editor service:', error);
    }
  },
  
  /**
   * Concatenate videos
   */
  concatenateVideos: async (req: Request, res: Response) => {
    try {
      const { videos, transitions, output } = req.body;
      
      // Validate required fields
      if (!videos || !Array.isArray(videos) || videos.length < 2) {
        return res.status(400).json({ error: 'At least two videos are required' });
      }
      
      if (!output || !output.filename) {
        return res.status(400).json({ error: 'Output filename is required' });
      }
      
      // Create options
      const options: ConcatOptions = {
        videos,
        transitions,
        output: {
          filename: output.filename,
          description: output.description,
          category: output.category,
          tags: output.tags
        }
      };
      
      // Concatenate videos
      const videoId = await editorService.concatenateVideos(options);
      
      res.status(200).json({
        message: 'Videos concatenated successfully',
        videoId
      });
    } catch (error: any) {
      console.error('Error concatenating videos:', error);
      res.status(500).json({ 
        error: 'Failed to concatenate videos',
        details: error.message || 'Unknown error'
      });
    }
  },
  
  /**
   * Trim video
   */
  trimVideo: async (req: Request, res: Response) => {
    try {
      const { videoId, startTime, endTime, output } = req.body;
      
      // Validate required fields
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }
      
      if (startTime === undefined || endTime === undefined) {
        return res.status(400).json({ error: 'Start time and end time are required' });
      }
      
      if (!output || !output.filename) {
        return res.status(400).json({ error: 'Output filename is required' });
      }
      
      // Create options
      const options: TrimOptions = {
        videoId,
        startTime: parseFloat(startTime),
        endTime: parseFloat(endTime),
        output: {
          filename: output.filename,
          description: output.description,
          category: output.category,
          tags: output.tags
        }
      };
      
      // Trim video
      const newVideoId = await editorService.trimVideo(options);
      
      res.status(200).json({
        message: 'Video trimmed successfully',
        videoId: newVideoId
      });
    } catch (error: any) {
      console.error('Error trimming video:', error);
      res.status(500).json({ 
        error: 'Failed to trim video',
        details: error.message || 'Unknown error'
      });
    }
  },
  
  /**
   * Add branding to video
   */
  addBranding: async (req: Request, res: Response) => {
    try {
      const { videoId, intro, outro, lowerThird, output } = req.body;
      
      // Validate required fields
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }
      
      if (!output || !output.filename) {
        return res.status(400).json({ error: 'Output filename is required' });
      }
      
      // Create options
      const options: BrandingOptions = {
        videoId,
        intro,
        outro,
        lowerThird,
        output: {
          filename: output.filename,
          description: output.description,
          category: output.category,
          tags: output.tags
        }
      };
      
      // Add branding
      const newVideoId = await editorService.addBranding(options);
      
      res.status(200).json({
        message: 'Branding added successfully',
        videoId: newVideoId
      });
    } catch (error: any) {
      console.error('Error adding branding:', error);
      res.status(500).json({ 
        error: 'Failed to add branding',
        details: error.message || 'Unknown error'
      });
    }
  },
  
  /**
   * Apply transition between videos
   */
  applyTransition: async (req: Request, res: Response) => {
    try {
      const { video1, video2, type, duration } = req.body;
      
      // Validate required fields
      if (!video1 || !video2) {
        return res.status(400).json({ error: 'Two video IDs are required' });
      }
      
      if (!type || !['fade', 'dissolve', 'wipe', 'zoom'].includes(type)) {
        return res.status(400).json({ error: 'Valid transition type is required' });
      }
      
      if (!duration) {
        return res.status(400).json({ error: 'Transition duration is required' });
      }
      
      // Apply transition
      const videoId = await editorService.applyTransition(
        video1,
        video2,
        type as 'fade' | 'dissolve' | 'wipe' | 'zoom',
        parseFloat(duration)
      );
      
      res.status(200).json({
        message: 'Transition applied successfully',
        videoId
      });
    } catch (error: any) {
      console.error('Error applying transition:', error);
      res.status(500).json({ 
        error: 'Failed to apply transition',
        details: error.message || 'Unknown error'
      });
    }
  },
  
  /**
   * Export video with specific format, resolution, and quality settings
   */
  exportVideo: async (req: Request, res: Response) => {
    try {
      const { videoId, format, resolution, quality, fps, output } = req.body;
      
      // Validate required fields
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }
      
      if (!format || !['mp4', 'webm', 'mov'].includes(format)) {
        return res.status(400).json({ error: 'Valid format is required (mp4, webm, or mov)' });
      }
      
      if (quality && !['low', 'medium', 'high'].includes(quality)) {
        return res.status(400).json({ error: 'Valid quality is required (low, medium, or high)' });
      }
      
      if (!output || !output.filename) {
        return res.status(400).json({ error: 'Output filename is required' });
      }
      
      // Parse resolution if provided
      let parsedResolution;
      if (resolution) {
        if (!resolution.width || !resolution.height) {
          return res.status(400).json({ error: 'Resolution must include width and height' });
        }
        
        parsedResolution = {
          width: parseInt(resolution.width.toString(), 10),
          height: parseInt(resolution.height.toString(), 10)
        };
        
        if (isNaN(parsedResolution.width) || isNaN(parsedResolution.height)) {
          return res.status(400).json({ error: 'Resolution width and height must be numbers' });
        }
      }
      
      // Parse fps if provided
      let parsedFps;
      if (fps) {
        parsedFps = parseInt(fps.toString(), 10);
        
        if (isNaN(parsedFps)) {
          return res.status(400).json({ error: 'FPS must be a number' });
        }
      }
      
      // Create options
      const options: ExportOptions = {
        videoId,
        format: format as 'mp4' | 'webm' | 'mov',
        resolution: parsedResolution,
        quality: quality as 'low' | 'medium' | 'high' | undefined,
        fps: parsedFps,
        output: {
          filename: output.filename,
          description: output.description,
          category: output.category,
          tags: output.tags
        }
      };
      
      // Export video
      const newVideoId = await editorService.exportVideo(options);
      
      res.status(200).json({
        message: 'Video exported successfully',
        videoId: newVideoId
      });
    } catch (error: any) {
      console.error('Error exporting video:', error);
      res.status(500).json({ 
        error: 'Failed to export video',
        details: error.message || 'Unknown error'
      });
    }
  },
  
  /**
   * Get job status
   */
  getJobStatus: async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      
      // Get job metadata
      const job = await editorService.getJobMetadata(jobId);
      
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      
      res.status(200).json({ job });
    } catch (error: any) {
      console.error('Error getting job status:', error);
      res.status(500).json({ 
        error: 'Failed to get job status',
        details: error.message || 'Unknown error'
      });
    }
  }
};

export default editorController;
