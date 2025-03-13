import api from './api';

export interface GenerateVideoParams {
  prompt: string;
  duration?: number;
  style?: string;
  resolution?: '720p' | '1080p';
}

export interface TextToVideoParams {
  prompt: string;
  duration?: number;
  style?: string;
}

export interface ImageToVideoParams {
  imageUrl: string;
  duration?: number;
  motion?: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down';
}

export interface VideoJob {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  videoUrl?: string;
}

export interface VideoStyle {
  id: string;
  name: string;
  description: string;
}

const runwayService = {
  /**
   * Generate a video using RunwayML API
   */
  generateVideo: async (params: GenerateVideoParams) => {
    const response = await api.post<{ jobId: string; estimatedTime: string }>('/runway/generate', params);
    return response.data;
  },

  /**
   * Check the status of a video generation job
   */
  checkJobStatus: async (jobId: string) => {
    const response = await api.get<VideoJob>(`/runway/status/${jobId}`);
    return response.data;
  },

  /**
   * Get available video styles
   */
  getStyles: async () => {
    const response = await api.get<{ styles: VideoStyle[] }>('/runway/styles');
    return response.data.styles;
  },

  /**
   * Generate video from text prompt
   */
  textToVideo: async (params: TextToVideoParams) => {
    const response = await api.post<{ jobId: string; estimatedTime: string }>('/runway/text-to-video', params);
    return response.data;
  },

  /**
   * Generate video from image
   */
  imageToVideo: async (params: ImageToVideoParams) => {
    const response = await api.post<{ jobId: string; estimatedTime: string }>('/runway/image-to-video', params);
    return response.data;
  }
};

export default runwayService;
