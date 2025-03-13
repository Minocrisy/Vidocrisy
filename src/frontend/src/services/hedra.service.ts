import api from './api';

export interface GenerateVideoParams {
  script: string;
  avatar: string;
  voice?: string;
  emotions?: string[];
  resolution?: '720p' | '1080p';
  aspectRatio?: '16:9' | '9:16' | '1:1';
}

export interface VideoJob {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  videoUrl?: string;
}

export interface Avatar {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export interface Voice {
  id: string;
  name: string;
  gender: string;
  language: string;
}

const hedraService = {
  /**
   * Generate a video using Hedra API
   */
  generateVideo: async (params: GenerateVideoParams) => {
    const response = await api.post<{ jobId: string; estimatedTime: string }>('/hedra/generate', params);
    return response.data;
  },

  /**
   * Check the status of a video generation job
   */
  checkJobStatus: async (jobId: string) => {
    const response = await api.get<VideoJob>(`/hedra/status/${jobId}`);
    return response.data;
  },

  /**
   * Get available avatars
   */
  getAvatars: async () => {
    const response = await api.get<{ avatars: Avatar[] }>('/hedra/avatars');
    return response.data.avatars;
  },

  /**
   * Get available voices
   */
  getVoices: async () => {
    const response = await api.get<{ voices: Voice[] }>('/hedra/voices');
    return response.data.voices;
  }
};

export default hedraService;
