import api from './api';

export interface VideoMetadata {
  id: string;
  filename: string;
  originalName?: string;
  path?: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  duration?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  category?: string;
  tags?: string[];
  source: 'hedra' | 'runway' | 'upload' | 'edited';
  description?: string;
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
  getAllVideos: async (options?: {
    source?: 'hedra' | 'runway' | 'upload' | 'edited';
    category?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }) => {
    let url = '/videos';
    
    // Add query parameters if options are provided
    if (options) {
      const params = new URLSearchParams();
      
      if (options.source) {
        params.append('source', options.source);
      }
      
      if (options.category) {
        params.append('category', options.category);
      }
      
      if (options.tags && options.tags.length > 0) {
        params.append('tags', options.tags.join(','));
      }
      
      if (options.limit) {
        params.append('limit', options.limit.toString());
      }
      
      if (options.offset) {
        params.append('offset', options.offset.toString());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    const response = await api.get<{ videos: VideoMetadata[] }>(url);
    return response.data.videos || [];
  },

  /**
   * Get a single video by ID
   */
  getVideo: async (id: string) => {
    const response = await api.get<{ video: VideoMetadata }>(`/videos/${id}`);
    return response.data.video;
  },

  /**
   * Upload a video file
   */
  uploadVideo: async (file: File, metadata: { category?: string; description?: string; tags?: string[] }, onProgress?: (percentage: number) => void) => {
    const formData = new FormData();
    formData.append('video', file);
    
    if (metadata.category) {
      formData.append('category', metadata.category);
    }
    
    if (metadata.description) {
      formData.append('description', metadata.description);
    }
    
    if (metadata.tags && metadata.tags.length > 0) {
      formData.append('tags', metadata.tags.join(','));
    }
    
    const response = await api.upload<{ video: VideoMetadata }>('/videos/upload', formData, onProgress);
    return response.data.video;
  },

  /**
   * Save a generated video from Hedra or RunwayML
   */
  saveGeneratedVideo: async (videoUrl: string, metadata: { 
    source: 'hedra' | 'runway';
    category?: string;
    description?: string;
    tags?: string[];
  }) => {
    const response = await api.post<{ video: VideoMetadata }>('/videos/save-generated', {
      videoUrl,
      source: metadata.source,
      category: metadata.category,
      description: metadata.description,
      tags: metadata.tags ? metadata.tags.join(',') : undefined
    });
    return response.data.video;
  },

  /**
   * Delete a video
   */
  deleteVideo: async (id: string) => {
    const response = await api.delete<{ message: string }>(`/videos/${id}`);
    return response.data;
  },

  /**
   * Update video metadata
   */
  updateVideo: async (id: string, updates: {
    category?: string;
    description?: string;
    tags?: string[];
  }) => {
    const response = await api.put<{ video: VideoMetadata }>(`/videos/${id}`, {
      category: updates.category,
      description: updates.description,
      tags: updates.tags ? updates.tags.join(',') : undefined
    });
    return response.data.video;
  },

  /**
   * Get video stream URL
   */
  getVideoStreamUrl: (id: string) => {
    return `${api.getBaseUrl()}/videos/${id}/stream`;
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
    const response = await api.post<{ video: VideoMetadata }>(`/videos/${id}/brand`, branding);
    return response.data.video;
  },

  /**
   * Get videos by category
   */
  getVideosByCategory: async (category: string) => {
    return videoService.getAllVideos({ category });
  },

  /**
   * Get videos by source
   */
  getVideosBySource: async (source: 'hedra' | 'runway' | 'upload' | 'edited') => {
    return videoService.getAllVideos({ source });
  }
};

export default videoService;
