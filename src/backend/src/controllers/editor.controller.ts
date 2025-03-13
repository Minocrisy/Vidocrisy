import { Request, Response } from 'express';
import editorService, { ConcatOptions, TrimOptions, BrandingOptions } from '../services/editor.service.js';

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
