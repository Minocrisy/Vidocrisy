import { useEffect, useRef, useState, useCallback } from 'react';
import {
  debounce,
  throttle,
  memoize,
  prefersReducedMotion,
  getFPS,
  createLazyLoadObserver
} from '../utils/performance';

/**
 * Hook to debounce a function
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  const debouncedFn = useRef(debounce(fn, delay));

  useEffect(() => {
    debouncedFn.current = debounce(fn, delay);
  }, [fn, delay]);

  return useCallback(
    ((...args: Parameters<T>) => debouncedFn.current(...args)) as T,
    [debouncedFn]
  );
}

/**
 * Hook to throttle a function
 * @param fn Function to throttle
 * @param limit Time limit in milliseconds
 * @returns Throttled function
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): T {
  const throttledFn = useRef(throttle(fn, limit));

  useEffect(() => {
    throttledFn.current = throttle(fn, limit);
  }, [fn, limit]);

  return useCallback(
    ((...args: Parameters<T>) => throttledFn.current(...args)) as T,
    [throttledFn]
  );
}

/**
 * Hook to memoize a function
 * @param fn Function to memoize
 * @param deps Dependencies array
 * @returns Memoized function
 */
export function useMemoize<T extends (...args: any[]) => any>(
  fn: T,
  deps: any[] = []
): T {
  const memoizedFn = useRef(memoize(fn));

  useEffect(() => {
    memoizedFn.current = memoize(fn);
  }, deps);

  return useCallback(
    ((...args: Parameters<T>) => memoizedFn.current(...args)) as T,
    [memoizedFn]
  );
}

/**
 * Hook to check if reduced motion is preferred
 * @returns Boolean indicating if reduced motion is preferred
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      setReducedMotion(prefersReducedMotion());
    };

    // Add listener for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Clean up
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return reducedMotion;
}

/**
 * Hook to measure FPS
 * @param interval Interval in milliseconds between measurements
 * @returns Current FPS
 */
export function useFPS(interval: number = 1000): number {
  const [fps, setFPS] = useState(60);
  
  useEffect(() => {
    let mounted = true;
    
    const measureFPS = async () => {
      while (mounted) {
        const currentFPS = await getFPS();
        if (mounted) {
          setFPS(currentFPS);
          await new Promise(resolve => setTimeout(resolve, interval));
        }
      }
    };
    
    measureFPS();
    
    return () => {
      mounted = false;
    };
  }, [interval]);
  
  return fps;
}

/**
 * Hook to lazy load elements when they enter the viewport
 * @param options Intersection observer options
 * @returns Object with ref and isVisible
 */
export function useLazyLoad(
  options: IntersectionObserverInit = { rootMargin: '100px', threshold: 0 }
): { ref: React.RefObject<HTMLElement>; isVisible: boolean } {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = createLazyLoadObserver((entry) => {
      setIsVisible(true);
      observer.unobserve(entry.target);
    }, options);
    
    observer.observe(element);
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);
  
  return { ref, isVisible };
}

/**
 * Hook to detect if the browser is idle
 * @param idleTime Time in milliseconds before considering the browser idle
 * @returns Boolean indicating if the browser is idle
 */
export function useIdle(idleTime: number = 60000): boolean {
  const [isIdle, setIsIdle] = useState(false);
  
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;
    
    const handleActivity = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsIdle(true), idleTime);
    };
    
    // Set up initial timer
    idleTimer = setTimeout(() => setIsIdle(true), idleTime);
    
    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });
    
    // Clean up
    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [idleTime]);
  
  return isIdle;
}

/**
 * Hook to detect if the app is in the background
 * @returns Boolean indicating if the app is in the background
 */
export function usePageVisibility(): boolean {
  const [isVisible, setIsVisible] = useState(!document.hidden);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return isVisible;
}

/**
 * Hook to detect network status
 * @returns Object with online status and connection type
 */
export function useNetworkStatus(): { online: boolean; connectionType: string | null } {
  const [online, setOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string | null>(
    // @ts-ignore - Some browsers don't have navigator.connection
    navigator.connection?.effectiveType || null
  );
  
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    
    const handleConnectionChange = () => {
      // @ts-ignore - Some browsers don't have navigator.connection
      setConnectionType(navigator.connection?.effectiveType || null);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // @ts-ignore - Some browsers don't have navigator.connection
    if (navigator.connection) {
      // @ts-ignore
      navigator.connection.addEventListener('change', handleConnectionChange);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // @ts-ignore - Some browsers don't have navigator.connection
      if (navigator.connection) {
        // @ts-ignore
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);
  
  return { online, connectionType };
}
