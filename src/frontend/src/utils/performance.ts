/**
 * Performance optimization utilities for the frontend
 */

// Cache for expensive computations
const computationCache = new Map<string, { result: any; timestamp: number }>();

// Maximum cache size in items
const MAX_CACHE_SIZE = 100;

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Memoizes a function to cache its results
 * @param fn Function to memoize
 * @param keyFn Optional function to generate a cache key from the arguments
 * @param ttl Time to live in milliseconds (optional)
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args),
  ttl: number = CACHE_EXPIRATION
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn(...args);
    const now = Date.now();
    const cachedItem = computationCache.get(key);

    // Return cached result if it exists and hasn't expired
    if (cachedItem && now - cachedItem.timestamp < ttl) {
      return cachedItem.result as ReturnType<T>;
    }

    // Compute result
    const result = fn(...args);

    // Store in cache
    computationCache.set(key, { result, timestamp: now });

    // Prune cache if it's too large
    if (computationCache.size > MAX_CACHE_SIZE) {
      pruneCache();
    }

    return result;
  }) as T;
}

/**
 * Removes the oldest items from the cache
 */
function pruneCache(): void {
  // Convert to array for sorting
  const cacheEntries = Array.from(computationCache.entries());

  // Sort by timestamp (oldest first)
  cacheEntries.sort((a, b) => a[1].timestamp - b[1].timestamp);

  // Remove oldest 20% of entries
  const entriesToRemove = Math.ceil(cacheEntries.length * 0.2);
  for (let i = 0; i < entriesToRemove; i++) {
    computationCache.delete(cacheEntries[i][0]);
  }
}

/**
 * Clears expired items from the cache
 */
export function clearExpiredCache(): void {
  const now = Date.now();
  for (const [key, { timestamp }] of computationCache.entries()) {
    if (now - timestamp > CACHE_EXPIRATION) {
      computationCache.delete(key);
    }
  }
}

/**
 * Clears the entire cache
 */
export function clearCache(): void {
  computationCache.clear();
}

/**
 * Debounces a function to limit how often it can be called
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function(this: any, ...args: Parameters<T>): void {
    const context = this;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(context, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttles a function to limit how often it can be called
 * @param fn Function to throttle
 * @param limit Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;

  return function(this: any, ...args: Parameters<T>): void {
    const now = Date.now();
    const context = this;

    if (now - lastCall >= limit) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      fn.apply(context, args);
    } else {
      lastArgs = args;
      lastThis = context;

      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          lastCall = Date.now();
          timeoutId = null;
          fn.apply(lastThis, lastArgs as Parameters<T>);
        }, limit - (now - lastCall));
      }
    }
  };
}

/**
 * Measures the execution time of a function
 * @param fn Function to measure
 * @param label Label for the console output
 * @returns Function with timing measurement
 */
export function measureTime<T extends (...args: any[]) => any>(
  fn: T,
  label: string
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`${label}: ${end - start}ms`);
    return result;
  }) as T;
}

/**
 * Lazy loads an image
 * @param src Image source URL
 * @returns Promise that resolves when the image is loaded
 */
export function lazyLoadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preloads an image
 * @param src Image source URL
 */
export function preloadImage(src: string): void {
  const img = new Image();
  img.src = src;
}

/**
 * Preloads multiple images
 * @param srcs Image source URLs
 */
export function preloadImages(srcs: string[]): void {
  srcs.forEach(preloadImage);
}

/**
 * Checks if the browser supports the Intersection Observer API
 * @returns True if supported, false otherwise
 */
export function supportsIntersectionObserver(): boolean {
  return 'IntersectionObserver' in window;
}

/**
 * Creates a lazy loading observer for elements
 * @param callback Callback function to run when an element is intersecting
 * @param options Intersection observer options
 * @returns Intersection observer
 */
export function createLazyLoadObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = { rootMargin: '100px', threshold: 0 }
): IntersectionObserver {
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, options);
}

/**
 * Checks if the browser is in a reduced motion mode
 * @returns True if reduced motion is preferred, false otherwise
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Gets the current FPS (frames per second)
 * @param sampleSize Number of frames to sample
 * @returns Promise that resolves to the FPS
 */
export function getFPS(sampleSize: number = 60): Promise<number> {
  return new Promise((resolve) => {
    const times: number[] = [];
    let frameCount = 0;

    function sample(timestamp: number) {
      times.push(timestamp);
      frameCount++;

      if (frameCount < sampleSize) {
        requestAnimationFrame(sample);
      } else {
        const fps = calculateFPS(times);
        resolve(fps);
      }
    }

    requestAnimationFrame(sample);
  });
}

/**
 * Calculates FPS from an array of timestamps
 * @param times Array of timestamps
 * @returns FPS
 */
function calculateFPS(times: number[]): number {
  if (times.length <= 1) {
    return 0;
  }

  const diffs: number[] = [];
  for (let i = 1; i < times.length; i++) {
    diffs.push(times[i] - times[i - 1]);
  }

  const averageFrameTime = diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length;
  return Math.round(1000 / averageFrameTime);
}

// Set up a periodic cache cleanup
setInterval(clearExpiredCache, CACHE_EXPIRATION);
