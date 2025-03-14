#!/bin/bash

# Script to optimize performance for video processing in the Vidocrisy backend

# Set error handling
set -e

# Print colored messages
print_message() {
  echo -e "\e[1;34m$1\e[0m"
}

print_success() {
  echo -e "\e[1;32m$1\e[0m"
}

print_error() {
  echo -e "\e[1;31m$1\e[0m"
}

print_warning() {
  echo -e "\e[1;33m$1\e[0m"
}

# Navigate to the backend directory
cd "$(dirname "$0")/.."
print_message "Working directory: $(pwd)"

# Check if FFmpeg is installed
print_message "Checking FFmpeg installation..."
if command -v ffmpeg &> /dev/null; then
  FFMPEG_VERSION=$(ffmpeg -version | head -n 1)
  print_success "FFmpeg is installed: $FFMPEG_VERSION"
else
  print_error "FFmpeg is not installed. Please install FFmpeg before continuing."
  exit 1
fi

# Create optimization directory if it doesn't exist
print_message "Creating optimization directory..."
mkdir -p src/utils/optimization

# Create video processing optimization utility
print_message "Creating video processing optimization utility..."
cat > src/utils/optimization/video.ts << 'EOL'
/**
 * Video processing optimization utilities
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Cache for processed videos to avoid redundant processing
const processedVideoCache = new Map<string, string>();

/**
 * Optimizes a video file for faster processing
 * @param inputPath Path to the input video file
 * @param options Optimization options
 * @returns Path to the optimized video file
 */
export async function optimizeVideoForProcessing(
  inputPath: string,
  options: {
    width?: number;
    height?: number;
    fps?: number;
    format?: string;
    crf?: number; // Constant Rate Factor (quality): 0-51, lower is better quality
    preset?: string; // ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow
    threads?: number; // Number of threads to use for processing
  } = {}
): Promise<string> {
  // Check if the video has already been optimized
  const cacheKey = `${inputPath}-${JSON.stringify(options)}`;
  if (processedVideoCache.has(cacheKey)) {
    return processedVideoCache.get(cacheKey)!;
  }

  // Default options
  const {
    width,
    height,
    fps = 30,
    format = 'mp4',
    crf = 23,
    preset = 'veryfast',
    threads = 0, // 0 means auto-detect
  } = options;

  // Create output filename
  const parsedPath = path.parse(inputPath);
  const outputDir = path.join(parsedPath.dir, 'optimized');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(
    outputDir,
    `${parsedPath.name}-optimized.${format}`
  );

  // Build FFmpeg command
  let ffmpegCommand = `ffmpeg -i "${inputPath}" -c:v libx264 -crf ${crf} -preset ${preset}`;
  
  // Add resolution if specified
  if (width && height) {
    ffmpegCommand += ` -vf "scale=${width}:${height}"`;
  }
  
  // Add framerate
  ffmpegCommand += ` -r ${fps}`;
  
  // Add threads
  if (threads > 0) {
    ffmpegCommand += ` -threads ${threads}`;
  }
  
  // Add output format and path
  ffmpegCommand += ` -y "${outputPath}"`;

  try {
    // Execute FFmpeg command
    await execAsync(ffmpegCommand);
    
    // Add to cache
    processedVideoCache.set(cacheKey, outputPath);
    
    return outputPath;
  } catch (error) {
    console.error('Error optimizing video:', error);
    throw new Error(`Failed to optimize video: ${error.message}`);
  }
}

/**
 * Clears the processed video cache
 */
export function clearProcessedVideoCache(): void {
  processedVideoCache.clear();
}

/**
 * Gets the optimal FFmpeg settings based on system resources
 */
export async function getOptimalFfmpegSettings(): Promise<{
  threads: number;
  preset: string;
  crf: number;
}> {
  try {
    // Get CPU info
    const { stdout: cpuInfo } = await execAsync('cat /proc/cpuinfo');
    const cpuCores = (cpuInfo.match(/processor\s+:/g) || []).length;
    
    // Get memory info
    const { stdout: memInfo } = await execAsync('free -m');
    const memoryLine = memInfo.split('\n')[1];
    const memoryValues = memoryLine.trim().split(/\s+/);
    const totalMemoryMB = parseInt(memoryValues[1], 10);
    
    // Calculate optimal settings
    let threads = Math.max(1, Math.min(cpuCores - 1, 4)); // Leave one core free, max 4 threads
    
    // Choose preset based on available resources
    let preset: string;
    let crf: number;
    
    if (cpuCores >= 8 && totalMemoryMB >= 8192) {
      // High-end system
      preset = 'faster';
      crf = 22;
    } else if (cpuCores >= 4 && totalMemoryMB >= 4096) {
      // Mid-range system
      preset = 'veryfast';
      crf = 23;
    } else {
      // Low-end system
      preset = 'ultrafast';
      crf = 25;
    }
    
    return { threads, preset, crf };
  } catch (error) {
    console.warn('Could not determine optimal FFmpeg settings:', error);
    // Return default settings
    return { threads: 2, preset: 'veryfast', crf: 23 };
  }
}

/**
 * Creates a low-resolution proxy video for editing
 * @param inputPath Path to the input video file
 * @returns Path to the proxy video file
 */
export async function createProxyVideo(inputPath: string): Promise<string> {
  // Create output filename
  const parsedPath = path.parse(inputPath);
  const outputDir = path.join(parsedPath.dir, 'proxies');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(
    outputDir,
    `${parsedPath.name}-proxy.mp4`
  );

  // Build FFmpeg command for proxy creation
  // Lower resolution, higher compression, faster decode
  const ffmpegCommand = `ffmpeg -i "${inputPath}" -c:v libx264 -crf 28 -preset ultrafast -vf "scale=640:-2" -r 24 -y "${outputPath}"`;

  try {
    // Execute FFmpeg command
    await execAsync(ffmpegCommand);
    return outputPath;
  } catch (error) {
    console.error('Error creating proxy video:', error);
    throw new Error(`Failed to create proxy video: ${error.message}`);
  }
}
EOL

# Create memory optimization utility
print_message "Creating memory optimization utility..."
cat > src/utils/optimization/memory.ts << 'EOL'
/**
 * Memory optimization utilities
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

// Cache for frequently accessed data
const dataCache = new Map<string, { data: any; timestamp: number }>();

// Maximum cache size in items
const MAX_CACHE_SIZE = 100;

// Cache expiration time in milliseconds (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000;

/**
 * Gets data from cache or calls the provider function
 * @param key Cache key
 * @param provider Function to provide data if not in cache
 * @param ttl Time to live in milliseconds (optional)
 * @returns Cached or newly provided data
 */
export async function getCachedData<T>(
  key: string,
  provider: () => Promise<T>,
  ttl: number = CACHE_EXPIRATION
): Promise<T> {
  const now = Date.now();
  const cachedItem = dataCache.get(key);

  // Return cached data if it exists and hasn't expired
  if (cachedItem && now - cachedItem.timestamp < ttl) {
    return cachedItem.data as T;
  }

  // Get fresh data
  const data = await provider();

  // Store in cache
  dataCache.set(key, { data, timestamp: now });

  // Prune cache if it's too large
  if (dataCache.size > MAX_CACHE_SIZE) {
    pruneCache();
  }

  return data;
}

/**
 * Removes the oldest items from the cache
 */
function pruneCache(): void {
  // Convert to array for sorting
  const cacheEntries = Array.from(dataCache.entries());

  // Sort by timestamp (oldest first)
  cacheEntries.sort((a, b) => a[1].timestamp - b[1].timestamp);

  // Remove oldest 20% of entries
  const entriesToRemove = Math.ceil(cacheEntries.length * 0.2);
  for (let i = 0; i < entriesToRemove; i++) {
    dataCache.delete(cacheEntries[i][0]);
  }
}

/**
 * Clears expired items from the cache
 */
export function clearExpiredCache(): void {
  const now = Date.now();
  for (const [key, { timestamp }] of dataCache.entries()) {
    if (now - timestamp > CACHE_EXPIRATION) {
      dataCache.delete(key);
    }
  }
}

/**
 * Clears the entire cache
 */
export function clearCache(): void {
  dataCache.clear();
}

/**
 * Cleans up temporary files older than the specified age
 * @param directory Directory to clean
 * @param maxAgeHours Maximum age in hours
 */
export async function cleanupTempFiles(
  directory: string,
  maxAgeHours: number = 24
): Promise<void> {
  try {
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
    const now = Date.now();
    
    // Read directory
    const files = await fs.promises.readdir(directory);
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      
      try {
        // Get file stats
        const stats = await fs.promises.stat(filePath);
        
        // Check if it's a file and older than maxAge
        if (stats.isFile() && now - stats.mtime.getTime() > maxAgeMs) {
          await fs.promises.unlink(filePath);
          console.log(`Deleted old temporary file: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
    }
  } catch (error) {
    console.error(`Error cleaning up directory ${directory}:`, error);
  }
}

/**
 * Gets the current memory usage of the process
 * @returns Memory usage in MB
 */
export function getMemoryUsage(): number {
  const memoryUsage = process.memoryUsage();
  return Math.round(memoryUsage.heapUsed / 1024 / 1024);
}

/**
 * Gets the system memory information
 * @returns Object containing total, free, and available memory in MB
 */
export async function getSystemMemory(): Promise<{
  total: number;
  free: number;
  available: number;
}> {
  try {
    const { stdout } = await execAsync('free -m');
    const lines = stdout.trim().split('\n');
    const memoryLine = lines[1].trim().split(/\s+/);
    
    return {
      total: parseInt(memoryLine[1], 10),
      free: parseInt(memoryLine[3], 10),
      available: parseInt(memoryLine[6], 10)
    };
  } catch (error) {
    console.error('Error getting system memory:', error);
    return { total: 0, free: 0, available: 0 };
  }
}
EOL

# Create API optimization utility
print_message "Creating API optimization utility..."
cat > src/utils/optimization/api.ts << 'EOL'
/**
 * API optimization utilities
 */

import { Request, Response, NextFunction } from 'express';

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message: string; // Error message
}

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting middleware
 * @param config Rate limiting configuration
 * @returns Express middleware function
 */
export function rateLimit(config: RateLimitConfig) {
  const { windowMs, maxRequests, message } = config;
  
  return (req: Request, res: Response, next: NextFunction) => {
    // Get client IP
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    
    // Get current time
    const now = Date.now();
    
    // Get or create rate limit entry
    let entry = rateLimitStore.get(clientIp);
    if (!entry || now > entry.resetTime) {
      entry = { count: 0, resetTime: now + windowMs };
      rateLimitStore.set(clientIp, entry);
    }
    
    // Increment request count
    entry.count++;
    
    // Check if rate limit exceeded
    if (entry.count > maxRequests) {
      // Calculate remaining time
      const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000);
      
      // Set rate limit headers
      res.set('X-RateLimit-Limit', String(maxRequests));
      res.set('X-RateLimit-Remaining', '0');
      res.set('X-RateLimit-Reset', String(Math.ceil(entry.resetTime / 1000)));
      res.set('Retry-After', String(resetInSeconds));
      
      // Return rate limit error
      return res.status(429).json({
        error: 'Too Many Requests',
        message,
        retryAfter: resetInSeconds
      });
    }
    
    // Set rate limit headers
    res.set('X-RateLimit-Limit', String(maxRequests));
    res.set('X-RateLimit-Remaining', String(maxRequests - entry.count));
    res.set('X-RateLimit-Reset', String(Math.ceil(entry.resetTime / 1000)));
    
    // Continue to next middleware
    next();
  };
}

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number; expiresAt: number }>();

/**
 * API response caching middleware
 * @param duration Cache duration in seconds
 * @returns Express middleware function
 */
export function cacheResponse(duration: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Create cache key from URL
    const cacheKey = req.originalUrl || req.url;
    
    // Check if response is in cache
    const cachedResponse = apiCache.get(cacheKey);
    if (cachedResponse && Date.now() < cachedResponse.expiresAt) {
      // Return cached response
      return res.json(cachedResponse.data);
    }
    
    // Store original res.json method
    const originalJson = res.json;
    
    // Override res.json method to cache response
    res.json = function(body) {
      // Store in cache
      apiCache.set(cacheKey, {
        data: body,
        timestamp: Date.now(),
        expiresAt: Date.now() + (duration * 1000)
      });
      
      // Call original method
      return originalJson.call(this, body);
    };
    
    // Continue to next middleware
    next();
  };
}

/**
 * Clears expired items from the API cache
 */
export function clearExpiredApiCache(): void {
  const now = Date.now();
  for (const [key, { expiresAt }] of apiCache.entries()) {
    if (now > expiresAt) {
      apiCache.delete(key);
    }
  }
}

/**
 * Clears the entire API cache
 */
export function clearApiCache(): void {
  apiCache.clear();
}

/**
 * Clears the rate limit store
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}

/**
 * Compression middleware configuration
 * @returns Express middleware configuration object
 */
export function getCompressionConfig() {
  return {
    // Compression level (1-9, where 9 is maximum compression)
    level: 6,
    // Only compress responses larger than 1KB
    threshold: 1024,
    // Don't compress responses with these content types
    filter: (req: Request, res: Response) => {
      if (res.getHeader('Content-Type')) {
        const contentType = res.getHeader('Content-Type') as string;
        return /text|json|javascript|css|xml/i.test(contentType);
      }
      return true;
    }
  };
}
EOL

# Create database optimization utility
print_message "Creating database optimization utility..."
cat > src/utils/optimization/database.ts << 'EOL'
/**
 * Database optimization utilities
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Cache for database queries
const queryCache = new Map<string, { data: any; timestamp: number }>();

// Maximum cache size in items
const MAX_CACHE_SIZE = 100;

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Gets query result from cache or executes the query
 * @param key Cache key
 * @param queryFn Function to execute the query
 * @param ttl Time to live in milliseconds (optional)
 * @returns Cached or newly queried data
 */
export async function getCachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = CACHE_EXPIRATION
): Promise<T> {
  const now = Date.now();
  const cachedItem = queryCache.get(key);

  // Return cached data if it exists and hasn't expired
  if (cachedItem && now - cachedItem.timestamp < ttl) {
    return cachedItem.data as T;
  }

  // Execute query
  const data = await queryFn();

  // Store in cache
  queryCache.set(key, { data, timestamp: now });

  // Prune cache if it's too large
  if (queryCache.size > MAX_CACHE_SIZE) {
    pruneCache();
  }

  return data;
}

/**
 * Removes the oldest items from the cache
 */
function pruneCache(): void {
  // Convert to array for sorting
  const cacheEntries = Array.from(queryCache.entries());

  // Sort by timestamp (oldest first)
  cacheEntries.sort((a, b) => a[1].timestamp - b[1].timestamp);

  // Remove oldest 20% of entries
  const entriesToRemove = Math.ceil(cacheEntries.length * 0.2);
  for (let i = 0; i < entriesToRemove; i++) {
    queryCache.delete(cacheEntries[i][0]);
  }
}

/**
 * Clears expired items from the query cache
 */
export function clearExpiredQueryCache(): void {
  const now = Date.now();
  for (const [key, { timestamp }] of queryCache.entries()) {
    if (now - timestamp > CACHE_EXPIRATION) {
      queryCache.delete(key);
    }
  }
}

/**
 * Clears the entire query cache
 */
export function clearQueryCache(): void {
  queryCache.clear();
}

/**
 * Invalidates cache entries that match a pattern
 * @param pattern Regex pattern to match cache keys
 */
export function invalidateCachePattern(pattern: RegExp): void {
  for (const key of queryCache.keys()) {
    if (pattern.test(key)) {
      queryCache.delete(key);
    }
  }
}

/**
 * Batch processes database operations
 * @param items Items to process
 * @param batchSize Size of each batch
 * @param processFn Function to process each batch
 */
export async function batchProcess<T, R>(
  items: T[],
  batchSize: number,
  processFn: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = [];
  
  // Process in batches
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processFn(batch);
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Creates an optimized index for a JSON data store
 * @param dataPath Path to the JSON data file
 * @param indexField Field to index
 * @param indexPath Path to save the index
 */
export async function createIndex(
  dataPath: string,
  indexField: string,
  indexPath: string
): Promise<void> {
  try {
    // Read data file
    const data = JSON.parse(await fs.promises.readFile(dataPath, 'utf8'));
    
    // Create index
    const index: Record<string, number[]> = {};
    
    data.forEach((item: any, i: number) => {
      const value = item[indexField];
      
      if (value !== undefined) {
        // Handle array values
        if (Array.isArray(value)) {
          value.forEach(v => {
            if (!index[v]) index[v] = [];
            index[v].push(i);
          });
        } else {
          // Handle scalar values
          if (!index[value]) index[value] = [];
          index[value].push(i);
        }
      }
    });
    
    // Write index to file
    await fs.promises.writeFile(indexPath, JSON.stringify(index));
  } catch (error) {
    console.error(`Error creating index for ${dataPath}:`, error);
    throw error;
  }
}

/**
 * Queries data using an index
 * @param dataPath Path to the JSON data file
 * @param indexPath Path to the index file
 * @param value Value to query
 * @returns Matching data items
 */
export async function queryWithIndex<T>(
  dataPath: string,
  indexPath: string,
  value: string | number
): Promise<T[]> {
  try {
    // Read data and index
    const data = JSON.parse(await fs.promises.readFile(dataPath, 'utf8'));
    const index = JSON.parse(await fs.promises.readFile(indexPath, 'utf8'));
    
    // Get matching indices
    const indices = index[value] || [];
    
    // Return matching items
    return indices.map((i: number) => data[i]);
  } catch (error) {
    console.error(`Error querying with index for ${dataPath}:`, error);
    throw error;
  }
}
EOL

# Create optimization index file
print_message "Creating optimization index file..."
cat > src/utils/optimization/index.ts << 'EOL'
/**
 * Optimization utilities index
 */

export * from './video';
export * from './memory';
export * from './api';
export * from './database';

// Schedule regular cleanup tasks
import { clearExpiredCache, cleanupTempFiles } from './memory';
import { clearExpiredApiCache, clearExpiredQueryCache } from './api';
import path from 'path';

// Run cleanup tasks every hour
setInterval(() => {
  // Clear expired caches
  clearExpiredCache();
  clearExpiredApiCache();
  clearExpiredQueryCache();
  
  // Clean up temporary files
  const uploadsDir = path.join(__dirname, '../../../uploads');
  cleanupTempFiles(path.join(uploadsDir, 'videos/temp'), 24);
  cleanupTempFiles(path.join(uploadsDir, 'videos/proxies'), 48);
  cleanupTempFiles(path.join(uploadsDir, 'videos/optimized'), 48);
}, 60 * 60 * 1000);
EOL

# Update editor service to use optimizations
print_message "Updating editor service to use optimizations..."
cat > src/services/editor.service.ts.new << 'EOL'
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { 
  optimizeVideoForProcessing, 
  getOptimalFfmpegSettings,
  createProxyVideo,
  getCachedData
} from '../utils/optimization';

const execAsync = promisify(exec);

// Base directories
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const VIDEOS_DIR = path.join(UPLOADS_DIR, 'videos');
const EDITED_VIDEOS_DIR = path.join(VIDEOS_DIR, 'edited');
const METADATA_DIR = path.join(VIDEOS_DIR, 'metadata');

// Ensure directories exist
[EDITED_VIDEOS_DIR, METADATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Video format options
const EXPORT_FORMATS = [
  { id: 'mp4', name: 'MP4', description: 'Standard video format', extension: '.mp4' },
  { id: 'webm', name: 'WebM', description: 'Open web format', extension: '.webm' },
  { id: 'mov', name: 'QuickTime', description: 'Apple QuickTime format', extension: '.mov' }
];

// Video quality presets
const EXPORT_QUALITIES = [
  { 
    id: 'low', 
    name: 'Low', 
    description: 'Lower quality, smaller file size',
    resolution: { width: 640, height: 360 },
    fps: 24
  },
  { 
    id: 'medium', 
    name: 'Medium', 
    description: 'Balanced quality and size',
    resolution: { width: 1280, height: 720 },
    fps: 30
  },
  { 
    id: 'high', 
    name: 'High', 
    description: 'High quality, larger file size',
    resolution: { width: 1920, height: 1080 },
    fps: 60
  }
];

// Transition effects
const TRANSITIONS = [
  { id: 'fade', name: 'Fade', description: 'Fade to black and back' },
  { id: 'dissolve', name: 'Dissolve', description: 'Gradual transition between clips' },
  { id: 'wipe', name: 'Wipe', description: 'Wipe from one clip to another' },
  { id: 'zoom', name: 'Zoom', description: 'Zoom transition between clips' }
];

// Branding templates
const BRANDING_TEMPLATES = [
  { id: 'intro1', name: 'Standard Intro', type: 'intro', duration: 5 },
  { id: 'outro1', name: 'Standard Outro', type: 'outro', duration: 5 },
  { id: 'lowerthird1', name: 'Name Lower Third', type: 'lowerthird', duration: 5 }
];

/**
 * Get available export formats
 */
export function getAvailableExportFormats() {
  return EXPORT_FORMATS;
}

/**
 * Get available export quality presets
 */
export function getAvailableExportQualities() {
  return EXPORT_QUALITIES;
}

/**
 * Get available transition effects
 */
export function getAvailableTransitions() {
  return TRANSITIONS;
}

/**
 * Get available branding templates
 */
export function getAvailableBrandingTemplates() {
  return BRANDING_TEMPLATES;
}

/**
 * Combine multiple video clips into a single video
 */
export async function combineVideos(videoIds: string[], transitions: string[] = []) {
  try {
    // Get optimal FFmpeg settings
    const ffmpegSettings = await getOptimalFfmpegSettings();
    
    // Create a unique ID for the combined video
    const combinedVideoId = uuidv4();
    const outputPath = path.join(EDITED_VIDEOS_DIR, `${combinedVideoId}.mp4`);
    
    // Create a temporary file list for FFmpeg
    const tempFilePath = path.join(VIDEOS_DIR, `${combinedVideoId}-list.txt`);
    
    let fileContent = '';
    
    // Optimize videos for processing
    const optimizedVideos = await Promise.all(
      videoIds.map(async (videoId) => {
        const videoPath = path.join(VIDEOS_DIR, `${videoId}.mp4`);
        return optimizeVideoForProcessing(videoPath, {
          preset: ffmpegSettings.preset,
          threads: ffmpegSettings.threads,
          crf: ffmpegSettings.crf
        });
      })
    );
    
    // Create file list with transitions
    for (let i = 0; i < optimizedVideos.length; i++) {
      fileContent += `file '${optimizedVideos[i]}'\n`;
      
      // Add transition if available and not the last video
      if (i < optimizedVideos.length - 1 && transitions[i]) {
        const transitionPath = getTransitionPath(transitions[i]);
        if (transitionPath) {
          fileContent += `file '${transitionPath}'\n`;
        }
      }
    }
    
    // Write file list
    fs.writeFileSync(tempFilePath, fileContent);
    
    // Combine videos using FFmpeg
    const ffmpegCommand = `ffmpeg -f concat -safe 0 -i "${tempFilePath}" -c:v libx264 -preset ${ffmpegSettings.preset} -crf ${ffmpegSettings.crf} -threads ${ffmpegSettings.threads} "${outputPath}"`;
    
    await execAsync(ffmpegCommand);
    
    // Clean up temp file
    fs.unlinkSync(tempFilePath);
    
    // Save metadata
    const metadata = {
      id: combinedVideoId,
      sourceVideos: videoIds,
      transitions,
