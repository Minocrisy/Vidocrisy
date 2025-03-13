import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import env from '../config/env.js';

// Define the Hedra API base URL
const HEDRA_API_BASE_URL = 'https://mercury.dev.dream-ai.com/api';

// Create an axios instance for Hedra API
const hedraClient = axios.create({
  baseURL: HEDRA_API_BASE_URL,
  headers: {
    'X-API-KEY': env.hedraApiKey
  }
});

// Cache for API responses
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Define interfaces for request and response types
export interface GenerateVideoRequest {
  script: string;
  avatar: string;
  voice?: string;
  emotions?: string[];
  resolution?: '720p' | '1080p';
  aspectRatio?: '16:9' | '9:16' | '1:1';
}

export interface GenerateVideoResponse {
  jobId: string;
  estimatedTime: string;
}

export interface JobStatusResponse {
  id: string;
  createdAt: string;
  username: string;
  videoUrl: string;
  avatarImageUrl: string;
  aspectRatio: string;
  text: string;
  voiceId: string;
  voiceUrl: string;
  userId: string;
  jobType: string;
  status: 'Queued' | 'Processing' | 'Completed' | 'Failed';
  stage: string;
  progress: number;
  errorMessage: string;
  audioSource: string;
  avatarImageInput: any;
  shared: boolean;
}

export interface Avatar {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export interface Voice {
  voice_id: string;
  service: string;
  name: string;
  description: string;
  labels: Record<string, string>;
  preview_url: string;
  premium: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Helper function to get cached response or fetch new data
const getCachedOrFetch = async <T>(
  cacheKey: string,
  fetchFn: () => Promise<T>
): Promise<T> => {
  const cachedResponse = responseCache.get(cacheKey);
  const now = Date.now();

  if (cachedResponse && now - cachedResponse.timestamp < CACHE_TTL) {
    console.log(`Using cached response for ${cacheKey}`);
    return cachedResponse.data as T;
  }

  try {
    const data = await fetchFn();
    responseCache.set(cacheKey, { data, timestamp: now });
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${cacheKey}:`, error);
    throw error;
  }
};

const hedraService = {
  /**
   * Upload audio file to Hedra API
   */
  uploadAudio: async (audioFilePath: string) => {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(audioFilePath));
      
      const response = await hedraClient.post('/v1/audio', formData, {
        headers: {
          ...formData.getHeaders()
        }
      });
      
      return (response.data as { url: string }).url;
    } catch (error) {
      console.error('Error uploading audio to Hedra:', error);
      throw error;
    }
  },

  /**
   * Upload image file to Hedra API
   */
  uploadImage: async (imageFilePath: string, aspectRatio: string = '1:1') => {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(imageFilePath));
      
      const response = await hedraClient.post(`/v1/portrait?aspect_ratio=${aspectRatio}`, formData, {
        headers: {
          ...formData.getHeaders()
        }
      });
      
      return (response.data as { url: string }).url;
    } catch (error) {
      console.error('Error uploading image to Hedra:', error);
      throw error;
    }
  },

  /**
   * Generate a video using Hedra API
   */
  generateVideo: async (params: GenerateVideoRequest) => {
    try {
      // First, we need to upload the avatar image
      const avatarImageUrl = await hedraService.uploadImage(params.avatar, params.aspectRatio || '1:1');
      
      // Then, we need to handle the audio
      let voiceUrl;
      let audioSource = 'tts';
      let text = params.script;
      
      if (params.voice && params.voice.endsWith('.mp3')) {
        // If voice is a file path, upload it
        voiceUrl = await hedraService.uploadAudio(params.voice);
        audioSource = 'audio';
        text = '';
      }
      
      // Generate the character video
      const requestBody = {
        text,
        voiceId: audioSource === 'tts' ? params.voice : null,
        voiceUrl: audioSource === 'audio' ? voiceUrl : null,
        avatarImage: avatarImageUrl,
        aspectRatio: params.aspectRatio || '1:1',
        audioSource
      };
      
      const response = await hedraClient.post('/v1/characters', requestBody);
      
      return {
        jobId: (response.data as { jobId: string }).jobId,
        estimatedTime: '30 seconds' // Estimated time is not returned by the API
      };
    } catch (error) {
      console.error('Error generating video with Hedra:', error);
      throw error;
    }
  },

  /**
   * Check the status of a video generation job
   */
  checkJobStatus: async (jobId: string) => {
    try {
      const response = await hedraClient.get(`/v1/projects/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking job status with Hedra:', error);
      throw error;
    }
  },

  /**
   * Get available avatars
   * Note: Hedra API doesn't have a specific endpoint for avatars,
   * so we're returning our predefined avatars
   */
  getAvatars: async () => {
    return [
      {
        id: 'mike',
        name: 'Mike',
        imageUrl: '/assets/images/Mike_Avatar.jpeg',
        description: 'Professional male avatar with a friendly demeanor'
      },
      {
        id: 'mira',
        name: 'Mira',
        imageUrl: '/assets/images/MIra_Avatar.jpeg',
        description: 'Professional female avatar with a confident presence'
      }
    ];
  },

  /**
   * Get available voices from Hedra API
   */
  getVoices: async () => {
    return getCachedOrFetch('hedra_voices', async () => {
      try {
        const response = await hedraClient.get('/v1/voices');
        return (response.data as { supported_voices: Voice[] }).supported_voices;
      } catch (error) {
        console.error('Error fetching voices from Hedra:', error);
        throw error;
      }
    });
  }
};

export default hedraService;
