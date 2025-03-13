import api from './api';

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

export interface TransitionOptions {
  video1: string;
  video2: string;
  type: 'fade' | 'dissolve' | 'wipe' | 'zoom';
  duration: number;
}

export interface EditJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  outputPath?: string;
  errorMessage?: string;
  command?: string;
}

const editorService = {
  /**
   * Concatenate videos
   */
  concatenateVideos: async (options: ConcatOptions, onProgress?: (progress: number) => void) => {
    const response = await api.post<{ videoId: string }>('/editor/concat', options);
    
    if (onProgress && response.data.videoId) {
      // Start polling for job status
      const jobId = response.data.videoId;
      const interval = setInterval(async () => {
        try {
          const jobStatus = await editorService.getJobStatus(jobId);
          
          if (jobStatus) {
            onProgress(jobStatus.progress);
            
            if (jobStatus.status === 'completed' || jobStatus.status === 'failed') {
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.error('Error checking job status:', error);
          clearInterval(interval);
        }
      }, 2000);
    }
    
    return response.data.videoId;
  },
  
  /**
   * Trim video
   */
  trimVideo: async (options: TrimOptions, onProgress?: (progress: number) => void) => {
    const response = await api.post<{ videoId: string }>('/editor/trim', options);
    
    if (onProgress && response.data.videoId) {
      // Start polling for job status
      const jobId = response.data.videoId;
      const interval = setInterval(async () => {
        try {
          const jobStatus = await editorService.getJobStatus(jobId);
          
          if (jobStatus) {
            onProgress(jobStatus.progress);
            
            if (jobStatus.status === 'completed' || jobStatus.status === 'failed') {
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.error('Error checking job status:', error);
          clearInterval(interval);
        }
      }, 2000);
    }
    
    return response.data.videoId;
  },
  
  /**
   * Add branding to video
   */
  addBranding: async (options: BrandingOptions, onProgress?: (progress: number) => void) => {
    const response = await api.post<{ videoId: string }>('/editor/brand', options);
    
    if (onProgress && response.data.videoId) {
      // Start polling for job status
      const jobId = response.data.videoId;
      const interval = setInterval(async () => {
        try {
          const jobStatus = await editorService.getJobStatus(jobId);
          
          if (jobStatus) {
            onProgress(jobStatus.progress);
            
            if (jobStatus.status === 'completed' || jobStatus.status === 'failed') {
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.error('Error checking job status:', error);
          clearInterval(interval);
        }
      }, 2000);
    }
    
    return response.data.videoId;
  },
  
  /**
   * Apply transition between videos
   */
  applyTransition: async (options: TransitionOptions, onProgress?: (progress: number) => void) => {
    const response = await api.post<{ videoId: string }>('/editor/transition', options);
    
    if (onProgress && response.data.videoId) {
      // Start polling for job status
      const jobId = response.data.videoId;
      const interval = setInterval(async () => {
        try {
          const jobStatus = await editorService.getJobStatus(jobId);
          
          if (jobStatus) {
            onProgress(jobStatus.progress);
            
            if (jobStatus.status === 'completed' || jobStatus.status === 'failed') {
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.error('Error checking job status:', error);
          clearInterval(interval);
        }
      }, 2000);
    }
    
    return response.data.videoId;
  },
  
  /**
   * Get job status
   */
  getJobStatus: async (jobId: string) => {
    try {
      const response = await api.get<{ job: EditJob }>(`/editor/job/${jobId}`);
      return response.data.job;
    } catch (error) {
      console.error('Error getting job status:', error);
      return null;
    }
  },
  
  /**
   * Get available transitions
   */
  getAvailableTransitions: () => {
    return [
      {
        id: 'fade',
        name: 'Fade',
        description: 'Smooth fade transition between videos',
        previewUrl: '/assets/images/transitions/fade.gif'
      },
      {
        id: 'dissolve',
        name: 'Dissolve',
        description: 'Gradual dissolve between videos',
        previewUrl: '/assets/images/transitions/dissolve.gif'
      },
      {
        id: 'wipe',
        name: 'Wipe',
        description: 'Wipe from left to right',
        previewUrl: '/assets/images/transitions/wipe.gif'
      },
      {
        id: 'zoom',
        name: 'Zoom',
        description: 'Zoom in/out transition',
        previewUrl: '/assets/images/transitions/zoom.gif'
      }
    ];
  },
  
  /**
   * Get available branding templates
   */
  getAvailableBrandingTemplates: () => {
    return [
      {
        id: 'intro1',
        name: 'Corporate Intro',
        description: 'Professional corporate intro with logo',
        previewUrl: '/assets/images/branding/intro1.gif',
        type: 'intro'
      },
      {
        id: 'outro1',
        name: 'Corporate Outro',
        description: 'Professional corporate outro with call to action',
        previewUrl: '/assets/images/branding/outro1.gif',
        type: 'outro'
      },
      {
        id: 'lowerthird1',
        name: 'Name Tag',
        description: 'Simple lower third with name and title',
        previewUrl: '/assets/images/branding/lowerthird1.gif',
        type: 'lowerThird'
      }
    ];
  }
};

export default editorService;
