import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import env from '../config/env.js';
import storageService, { VideoMetadata } from './storage.service.js';

// Promisify fs functions
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const exists = promisify(fs.exists);

// Define interfaces
export interface EditJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  outputPath?: string;
  errorMessage?: string;
  command?: string;
}

export interface ConcatOptions {
  videos: string[]; // Array of video IDs
  transitions?: {
    type: 'fade' | 'dissolve' | 'wipe' | 'zoom';
    duration: number;
  }[];
  output: {
    filename: string;
    description?: string;
    category?: string;
    tags?: string[];
  };
}

export interface TrimOptions {
  videoId: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  output: {
    filename: string;
    description?: string;
    category?: string;
    tags?: string[];
  };
}

export interface BrandingOptions {
  videoId: string;
  intro?: string; // intro video ID
  outro?: string; // outro video ID
  lowerThird?: {
    text: string;
    position: 'top' | 'bottom';
    duration: number;
    startTime: number;
  };
  output: {
    filename: string;
    description?: string;
    category?: string;
    tags?: string[];
  };
}

export interface ExportOptions {
  videoId: string;
  format: 'mp4' | 'webm' | 'mov';
  resolution?: {
    width: number;
    height: number;
  };
  quality?: 'low' | 'medium' | 'high';
  fps?: number;
  output: {
    filename: string;
    description?: string;
    category?: string;
    tags?: string[];
  };
}

// Define editor service
const editorService = {
  /**
   * Initialize editor service
   */
  init: async () => {
    try {
      // Create jobs directory if it doesn't exist
      const jobsDir = path.join(env.videosDir, 'jobs');
      if (!fs.existsSync(jobsDir)) {
        await mkdir(jobsDir, { recursive: true });
      }
      
      console.log('Editor service initialized');
    } catch (error) {
      console.error('Error initializing editor service:', error);
      throw error;
    }
  },
  
  /**
   * Create a new edit job
   */
  createJob: async (): Promise<EditJob> => {
    const jobId = `job-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    
    const job: EditJob = {
      id: jobId,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Save job metadata
    await editorService.saveJobMetadata(job);
    
    return job;
  },
  
  /**
   * Save job metadata
   */
  saveJobMetadata: async (job: EditJob): Promise<void> => {
    try {
      const jobsDir = path.join(env.videosDir, 'jobs');
      
      // Ensure jobs directory exists
      if (!fs.existsSync(jobsDir)) {
        await mkdir(jobsDir, { recursive: true });
      }
      
      // Create job file path
      const jobPath = path.join(jobsDir, `${job.id}.json`);
      
      // Write job to file
      await writeFile(jobPath, JSON.stringify(job, null, 2));
    } catch (error) {
      console.error('Error saving job metadata:', error);
      throw error;
    }
  },
  
  /**
   * Get job metadata
   */
  getJobMetadata: async (jobId: string): Promise<EditJob | null> => {
    try {
      const jobPath = path.join(env.videosDir, 'jobs', `${jobId}.json`);
      
      // Check if job file exists
      if (!fs.existsSync(jobPath)) {
        return null;
      }
      
      // Read job file
      const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
      
      return job;
    } catch (error) {
      console.error('Error getting job metadata:', error);
      throw error;
    }
  },
  
  /**
   * Update job status
   */
  updateJobStatus: async (jobId: string, updates: Partial<EditJob>): Promise<EditJob | null> => {
    try {
      // Get existing job
      const job = await editorService.getJobMetadata(jobId);
      
      if (!job) {
        return null;
      }
      
      // Update job
      const updatedJob: EditJob = {
        ...job,
        ...updates,
        updatedAt: new Date()
      };
      
      // Save updated job
      await editorService.saveJobMetadata(updatedJob);
      
      return updatedJob;
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  },
  
  /**
   * Execute FFmpeg command
   */
  executeFFmpeg: async (args: string[], jobId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Create FFmpeg process
      const ffmpeg = spawn('ffmpeg', args);
      
      let output = '';
      let errorOutput = '';
      
      // Collect output
      ffmpeg.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      // Collect error output
      ffmpeg.stderr.on('data', async (data) => {
        const stderr = data.toString();
        errorOutput += stderr;
        
        // Parse progress
        const progressMatch = stderr.match(/time=(\d+):(\d+):(\d+.\d+)/);
        if (progressMatch) {
          const hours = parseInt(progressMatch[1]);
          const minutes = parseInt(progressMatch[2]);
          const seconds = parseFloat(progressMatch[3]);
          
          const currentTime = hours * 3600 + minutes * 60 + seconds;
          
          // Get job to check duration
          const job = await editorService.getJobMetadata(jobId);
          
          if (job && job.status === 'processing') {
            // Update job progress
            await editorService.updateJobStatus(jobId, {
              progress: Math.min(99, Math.round(currentTime / 60 * 100)) // Assuming 1 minute video
            });
          }
        }
      });
      
      // Handle process completion
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}: ${errorOutput}`));
        }
      });
      
      // Handle process error
      ffmpeg.on('error', (err) => {
        reject(err);
      });
    });
  },
  
  /**
   * Concatenate videos
   */
  concatenateVideos: async (options: ConcatOptions): Promise<string> => {
    try {
      // Create a new job
      const job = await editorService.createJob();
      
      // Update job status
      await editorService.updateJobStatus(job.id, {
        status: 'processing',
        progress: 0
      });
      
      // Get video metadata for all videos
      const videoPromises = options.videos.map(videoId => storageService.getVideoMetadata(videoId));
      const videos = await Promise.all(videoPromises);
      
      // Filter out null values
      const validVideos = videos.filter(video => video !== null) as VideoMetadata[];
      
      if (validVideos.length === 0) {
        throw new Error('No valid videos found');
      }
      
      // Create a temporary directory for the job
      const tempDir = path.join(env.uploadsDir, 'temp', job.id);
      await mkdir(tempDir, { recursive: true });
      
      // Create a file list for FFmpeg
      const fileListPath = path.join(tempDir, 'filelist.txt');
      let fileListContent = '';
      
      for (const video of validVideos) {
        fileListContent += `file '${video.path}'\n`;
      }
      
      await writeFile(fileListPath, fileListContent);
      
      // Create output path
      const outputFilename = options.output.filename || `concat-${Date.now()}.mp4`;
      const outputPath = path.join(env.videosDir, 'edited', outputFilename);
      
      // Build FFmpeg command
      const args = [
        '-f', 'concat',
        '-safe', '0',
        '-i', fileListPath,
        '-c', 'copy',
        outputPath
      ];
      
      // Update job with command
      await editorService.updateJobStatus(job.id, {
        command: `ffmpeg ${args.join(' ')}`
      });
      
      // Execute FFmpeg command
      await editorService.executeFFmpeg(args, job.id);
      
      // Save video metadata
      const stats = fs.statSync(outputPath);
      
      const metadata: VideoMetadata = {
        id: `edited-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
        filename: outputFilename,
        path: outputPath,
        url: `/uploads/videos/edited/${outputFilename}`,
        size: stats.size,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: options.output.category,
        tags: options.output.tags,
        source: 'edited',
        description: options.output.description
      };
      
      await storageService.saveMetadata(metadata);
      
      // Update job status
      await editorService.updateJobStatus(job.id, {
        status: 'completed',
        progress: 100,
        outputPath
      });
      
      // Clean up temporary files
      await unlink(fileListPath);
      
      return metadata.id;
    } catch (error) {
      console.error('Error concatenating videos:', error);
      throw error;
    }
  },
  
  /**
   * Trim video
   */
  trimVideo: async (options: TrimOptions): Promise<string> => {
    try {
      // Create a new job
      const job = await editorService.createJob();
      
      // Update job status
      await editorService.updateJobStatus(job.id, {
        status: 'processing',
        progress: 0
      });
      
      // Get video metadata
      const video = await storageService.getVideoMetadata(options.videoId);
      
      if (!video) {
        throw new Error('Video not found');
      }
      
      // Create output path
      const outputFilename = options.output.filename || `trim-${Date.now()}.mp4`;
      const outputPath = path.join(env.videosDir, 'edited', outputFilename);
      
      // Build FFmpeg command
      const args = [
        '-i', video.path,
        '-ss', options.startTime.toString(),
        '-to', options.endTime.toString(),
        '-c', 'copy',
        outputPath
      ];
      
      // Update job with command
      await editorService.updateJobStatus(job.id, {
        command: `ffmpeg ${args.join(' ')}`
      });
      
      // Execute FFmpeg command
      await editorService.executeFFmpeg(args, job.id);
      
      // Save video metadata
      const stats = fs.statSync(outputPath);
      
      const metadata: VideoMetadata = {
        id: `edited-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
        filename: outputFilename,
        path: outputPath,
        url: `/uploads/videos/edited/${outputFilename}`,
        size: stats.size,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: options.output.category,
        tags: options.output.tags,
        source: 'edited',
        description: options.output.description
      };
      
      await storageService.saveMetadata(metadata);
      
      // Update job status
      await editorService.updateJobStatus(job.id, {
        status: 'completed',
        progress: 100,
        outputPath
      });
      
      return metadata.id;
    } catch (error) {
      console.error('Error trimming video:', error);
      throw error;
    }
  },
  
  /**
   * Add branding to video
   */
  addBranding: async (options: BrandingOptions): Promise<string> => {
    try {
      // Create a new job
      const job = await editorService.createJob();
      
      // Update job status
      await editorService.updateJobStatus(job.id, {
        status: 'processing',
        progress: 0
      });
      
      // Get video metadata
      const video = await storageService.getVideoMetadata(options.videoId);
      
      if (!video) {
        throw new Error('Video not found');
      }
      
      // Create a temporary directory for the job
      const tempDir = path.join(env.uploadsDir, 'temp', job.id);
      await mkdir(tempDir, { recursive: true });
      
      // Create output path
      const outputFilename = options.output.filename || `branded-${Date.now()}.mp4`;
      const outputPath = path.join(env.videosDir, 'edited', outputFilename);
      
      // Build FFmpeg command based on branding options
      let args: string[] = [];
      
      if (options.intro && options.outro) {
        // Get intro and outro metadata
        const intro = await storageService.getVideoMetadata(options.intro);
        const outro = await storageService.getVideoMetadata(options.outro);
        
        if (!intro || !outro) {
          throw new Error('Intro or outro video not found');
        }
        
        // Create a file list for FFmpeg
        const fileListPath = path.join(tempDir, 'filelist.txt');
        const fileListContent = `file '${intro.path}'\nfile '${video.path}'\nfile '${outro.path}'\n`;
        
        await writeFile(fileListPath, fileListContent);
        
        args = [
          '-f', 'concat',
          '-safe', '0',
          '-i', fileListPath,
          '-c', 'copy',
          outputPath
        ];
      } else if (options.lowerThird) {
        // Create a text file for the lower third
        const textPath = path.join(tempDir, 'text.txt');
        await writeFile(textPath, options.lowerThird.text);
        
        // Position the text based on the option
        const y = options.lowerThird.position === 'top' ? '20' : 'h-60';
        
        args = [
          '-i', video.path,
          '-vf', `drawtext=fontfile=/path/to/font.ttf:textfile=${textPath}:fontcolor=white:fontsize=24:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=${y}:enable='between(t,${options.lowerThird.startTime},${options.lowerThird.startTime + options.lowerThird.duration})'`,
          '-codec:a', 'copy',
          outputPath
        ];
      } else {
        // Just copy the video if no branding options are provided
        args = [
          '-i', video.path,
          '-c', 'copy',
          outputPath
        ];
      }
      
      // Update job with command
      await editorService.updateJobStatus(job.id, {
        command: `ffmpeg ${args.join(' ')}`
      });
      
      // Execute FFmpeg command
      await editorService.executeFFmpeg(args, job.id);
      
      // Save video metadata
      const stats = fs.statSync(outputPath);
      
      const metadata: VideoMetadata = {
        id: `edited-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
        filename: outputFilename,
        path: outputPath,
        url: `/uploads/videos/edited/${outputFilename}`,
        size: stats.size,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: options.output.category,
        tags: options.output.tags,
        source: 'edited',
        description: options.output.description
      };
      
      await storageService.saveMetadata(metadata);
      
      // Update job status
      await editorService.updateJobStatus(job.id, {
        status: 'completed',
        progress: 100,
        outputPath
      });
      
      // Clean up temporary files
      if (options.intro && options.outro) {
        await unlink(path.join(tempDir, 'filelist.txt'));
      } else if (options.lowerThird) {
        await unlink(path.join(tempDir, 'text.txt'));
      }
      
      return metadata.id;
    } catch (error) {
      console.error('Error adding branding to video:', error);
      throw error;
    }
  },
  
  /**
   * Apply transition between videos
   * Note: This is a placeholder. In a real implementation, you would use FFmpeg to apply transitions.
   */
  applyTransition: async (video1: string, video2: string, type: 'fade' | 'dissolve' | 'wipe' | 'zoom', duration: number): Promise<string> => {
    try {
      // Create a new job
      const job = await editorService.createJob();
      
      // Update job status
      await editorService.updateJobStatus(job.id, {
        status: 'processing',
        progress: 0
      });
      
      // Get video metadata
      const video1Metadata = await storageService.getVideoMetadata(video1);
      const video2Metadata = await storageService.getVideoMetadata(video2);
      
      if (!video1Metadata || !video2Metadata) {
        throw new Error('Video not found');
      }
      
      // Create output path
      const outputFilename = `transition-${Date.now()}.mp4`;
      const outputPath = path.join(env.videosDir, 'edited', outputFilename);
      
      // Build FFmpeg command based on transition type
      let args: string[] = [];
      
      switch (type) {
        case 'fade':
          args = [
            '-i', video1Metadata.path,
            '-i', video2Metadata.path,
            '-filter_complex', `[0:v]fade=t=out:st=${duration}:d=${duration}[v0];[1:v]fade=t=in:st=0:d=${duration}[v1];[v0][v1]overlay[outv]`,
            '-map', '[outv]',
            '-c:v', 'libx264',
            outputPath
          ];
          break;
        case 'dissolve':
          args = [
            '-i', video1Metadata.path,
            '-i', video2Metadata.path,
            '-filter_complex', `[0:v][1:v]xfade=transition=fade:duration=${duration}[outv]`,
            '-map', '[outv]',
            '-c:v', 'libx264',
            outputPath
          ];
          break;
        case 'wipe':
          args = [
            '-i', video1Metadata.path,
            '-i', video2Metadata.path,
            '-filter_complex', `[0:v][1:v]xfade=transition=wiperight:duration=${duration}[outv]`,
            '-map', '[outv]',
            '-c:v', 'libx264',
            outputPath
          ];
          break;
        case 'zoom':
          args = [
            '-i', video1Metadata.path,
            '-i', video2Metadata.path,
            '-filter_complex', `[0:v][1:v]xfade=transition=zoomin:duration=${duration}[outv]`,
            '-map', '[outv]',
            '-c:v', 'libx264',
            outputPath
          ];
          break;
        default:
          throw new Error(`Unsupported transition type: ${type}`);
      }
      
      // Update job with command
      await editorService.updateJobStatus(job.id, {
        command: `ffmpeg ${args.join(' ')}`
      });
      
      // Execute FFmpeg command
      await editorService.executeFFmpeg(args, job.id);
      
      // Save video metadata
      const stats = fs.statSync(outputPath);
      
      const metadata: VideoMetadata = {
        id: `edited-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
        filename: outputFilename,
        path: outputPath,
        url: `/uploads/videos/edited/${outputFilename}`,
        size: stats.size,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: 'transitions',
        tags: ['transition', type],
        source: 'edited',
        description: `Transition (${type}) between videos`
      };
      
      await storageService.saveMetadata(metadata);
      
      // Update job status
      await editorService.updateJobStatus(job.id, {
        status: 'completed',
        progress: 100,
        outputPath
      });
      
      return metadata.id;
    } catch (error) {
      console.error('Error applying transition:', error);
      throw error;
    }
  },
  
  /**
   * Export video with specific format, resolution, and quality settings
   */
  exportVideo: async (options: ExportOptions): Promise<string> => {
    try {
      // Create a new job
      const job = await editorService.createJob();
      
      // Update job status
      await editorService.updateJobStatus(job.id, {
        status: 'processing',
        progress: 0
      });
      
      // Get video metadata
      const video = await storageService.getVideoMetadata(options.videoId);
      
      if (!video) {
        throw new Error('Video not found');
      }
      
      // Create output path
      const extension = options.format === 'webm' ? 'webm' : options.format === 'mov' ? 'mov' : 'mp4';
      const outputFilename = options.output.filename || `export-${Date.now()}.${extension}`;
      const outputPath = path.join(env.videosDir, 'edited', outputFilename);
      
      // Build FFmpeg command based on export options
      let args: string[] = ['-i', video.path];
      
      // Add video codec based on format
      if (options.format === 'webm') {
        args.push('-c:v', 'libvpx-vp9');
      } else if (options.format === 'mov' || options.format === 'mp4') {
        args.push('-c:v', 'libx264');
      }
      
      // Add audio codec based on format
      if (options.format === 'webm') {
        args.push('-c:a', 'libopus');
      } else if (options.format === 'mov' || options.format === 'mp4') {
        args.push('-c:a', 'aac');
      }
      
      // Add quality settings
      if (options.quality) {
        let crf: number;
        let audioBitrate: string;
        
        switch (options.quality) {
          case 'low':
            crf = options.format === 'webm' ? 35 : 28;
            audioBitrate = '96k';
            break;
          case 'medium':
            crf = options.format === 'webm' ? 30 : 23;
            audioBitrate = '128k';
            break;
          case 'high':
            crf = options.format === 'webm' ? 24 : 18;
            audioBitrate = '192k';
            break;
          default:
            crf = options.format === 'webm' ? 30 : 23; // Default to medium
            audioBitrate = '128k';
        }
        
        args.push('-crf', crf.toString());
        args.push('-b:a', audioBitrate);
      }
      
      // Add resolution settings
      if (options.resolution) {
        args.push('-vf', `scale=${options.resolution.width}:${options.resolution.height}`);
      }
      
      // Add framerate settings
      if (options.fps) {
        args.push('-r', options.fps.toString());
      }
      
      // Add output path
      args.push(outputPath);
      
      // Update job with command
      await editorService.updateJobStatus(job.id, {
        command: `ffmpeg ${args.join(' ')}`
      });
      
      // Execute FFmpeg command
      await editorService.executeFFmpeg(args, job.id);
      
      // Save video metadata
      const stats = fs.statSync(outputPath);
      
      const metadata: VideoMetadata = {
        id: `edited-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
        filename: outputFilename,
        path: outputPath,
        url: `/uploads/videos/edited/${outputFilename}`,
        size: stats.size,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: options.output.category,
        tags: options.output.tags ? [...options.output.tags, 'exported', options.format] : ['exported', options.format],
        source: 'edited',
        description: options.output.description || `Exported video (${options.format})`
      };
      
      await storageService.saveMetadata(metadata);
      
      // Update job status
      await editorService.updateJobStatus(job.id, {
        status: 'completed',
        progress: 100,
        outputPath
      });
      
      return metadata.id;
    } catch (error) {
      console.error('Error exporting video:', error);
      throw error;
    }
  }
};

export default editorService;
