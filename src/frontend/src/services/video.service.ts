import api from './api';

export interface Video {
  id: string;
  title: string;
  description?: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  source: 'hedra' | 'runway' | 'upload' | 'edited';
  thumbnailUrl: string;
  videoUrl: string;
  size: number;
  tags?: string[];
  folderId?: string;
}

export interface VideoFolder {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  videoCount: number;
}

export interface CombineVideosParams {
  videos: string[]; // Array of video IDs
  transitions?: {
    type: 'fade' | 'dissolve' | 'wipe' | 'zoom';
    duration: number;
  }[];
  output?: {
    title: string;
    description?: string;
    tags?: string[];
    folderId?: string;
  };
}

export interface BrandingParams {
  intro?: boolean;
  outro?: boolean;
  lowerThird?: {
    text: string;
    position: 'top' | 'bottom';
    duration: number;
  };
}

const videoService = {
  /**
   * Get all videos
   */
  getAllVideos: async () => {
    const response = await api.get<{ videos: Video[] }>('/videos');
    return response.data.videos || [];
  },

  /**
   * Get a single video by ID
   */
  getVideo: async (id: string) => {
    const response = await api.get<Video>(`/videos/${id}`);
    return response.data;
  },

  /**
   * Upload a video file
   */
  uploadVideo: async (file: File, metadata: { title: string; description?: string; tags?: string[] }, onProgress?: (percentage: number) => void) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('metadata', JSON.stringify(metadata));
    
    const response = await api.upload<{ video: Video }>('/videos/upload', formData, onProgress);
    return response.data.video;
  },

  /**
   * Delete a video
   */
  deleteVideo: async (id: string) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  },

  /**
   * Combine multiple videos
   */
  combineVideos: async (params: CombineVideosParams) => {
    const response = await api.post<{ jobId: string }>('/videos/combine', params);
    return response.data;
  },

  /**
   * Add branding to a video
   */
  addBranding: async (id: string, branding: BrandingParams) => {
    const response = await api.post<{ video: Video }>(`/videos/${id}/brand`, branding);
    return response.data.video;
  },

  /**
   * Get all folders
   */
  getFolders: async () => {
    const response = await api.get<{ folders: VideoFolder[] }>('/videos/folders');
    return response.data.folders || [];
  },

  /**
   * Create a new folder
   */
  createFolder: async (name: string, description?: string) => {
    const response = await api.post<{ folder: VideoFolder }>('/videos/folders', { name, description });
    return response.data.folder;
  },

  /**
   * Get videos in a folder
   */
  getVideosInFolder: async (folderId: string) => {
    const response = await api.get<{ videos: Video[] }>(`/videos/folders/${folderId}`);
    return response.data.videos || [];
  }
};

export default videoService;
