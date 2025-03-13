import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Tooltip,
  VStack,
  HStack,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiMinimize,
  FiSettings,
  FiDownload
} from 'react-icons/fi';
import videoService from '../../services/video.service';

interface VideoPlayerProps {
  videoId?: string;
  videoUrl?: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  poster?: string;
  width?: string | number;
  height?: string | number;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onError?: (error: any) => void;
}

const VideoPlayer = ({
  videoId,
  videoUrl,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  poster,
  width = '100%',
  height = 'auto',
  onEnded,
  onTimeUpdate,
  onError
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState<string>('auto');
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const { isOpen: isVolumeOpen, onToggle: onVolumeToggle, onClose: onVolumeClose } = useDisclosure();
  
  // Determine the video source URL
  const src = videoId 
    ? videoService.getVideoStreamUrl(videoId)
    : videoUrl || '';
  
  // Initialize video player
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Set initial properties
    video.autoplay = autoPlay;
    video.loop = loop;
    video.muted = muted;
    video.volume = volume;
    
    // Event listeners
    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    
    const onTimeUpdateHandler = () => {
      setCurrentTime(video.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime, video.duration);
      }
    };
    
    const onEndedHandler = () => {
      setIsPlaying(false);
      if (onEnded) {
        onEnded();
      }
    };
    
    const onErrorHandler = (e: any) => {
      setIsLoading(false);
      setError('Error loading video');
      if (onError) {
        onError(e);
      }
    };
    
    // Add event listeners
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('timeupdate', onTimeUpdateHandler);
    video.addEventListener('ended', onEndedHandler);
    video.addEventListener('error', onErrorHandler);
    
    // Clean up event listeners
    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('timeupdate', onTimeUpdateHandler);
      video.removeEventListener('ended', onEndedHandler);
      video.removeEventListener('error', onErrorHandler);
    };
  }, [videoId, videoUrl, autoPlay, loop, muted, volume, onTimeUpdate, onEnded, onError]);
  
  // Handle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle mute/unmute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = value;
    setVolume(value);
    
    if (value === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };
  
  // Handle seek
  const handleSeek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = value;
    setCurrentTime(value);
  };
  
  // Handle fullscreen
  const toggleFullscreen = () => {
    const videoContainer = document.getElementById('video-container');
    if (!videoContainer) return;
    
    if (!isFullscreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };
  
  // Handle playback rate change
  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Show/hide controls on mouse movement
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  // Handle download
  const handleDownload = () => {
    if (videoId) {
      window.open(src, '_blank');
    } else if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = 'video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  
  return (
    <Box
      id="video-container"
      position="relative"
      width={width}
      height={height}
      bg="black"
      borderRadius="md"
      overflow="hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        playsInline
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <Flex
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          justify="center"
          align="center"
          bg="rgba(0, 0, 0, 0.5)"
        >
          <Text color="white">Loading...</Text>
        </Flex>
      )}
      
      {/* Error message */}
      {error && (
        <Flex
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          justify="center"
          align="center"
          bg="rgba(0, 0, 0, 0.7)"
        >
          <Text color="red.500">{error}</Text>
        </Flex>
      )}
      
      {/* Controls */}
      {controls && showControls && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={4}
          bg="linear-gradient(transparent, rgba(0, 0, 0, 0.7))"
          transition="opacity 0.3s"
          opacity={showControls ? 1 : 0}
        >
          {/* Progress bar */}
          <Slider
            aria-label="video-progress"
            value={currentTime}
            min={0}
            max={duration || 100}
            onChange={handleSeek}
            mb={2}
          >
            <SliderTrack bg="gray.600">
              <SliderFilledTrack bg="brand.500" />
            </SliderTrack>
            <SliderThumb boxSize={3} />
          </Slider>
          
          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              {/* Play/Pause button */}
              <IconButton
                aria-label={isPlaying ? 'Pause' : 'Play'}
                icon={isPlaying ? <FiPause /> : <FiPlay />}
                onClick={togglePlay}
                variant="ghost"
                color="white"
                size="sm"
              />
              
              {/* Volume control */}
              <Box position="relative">
                <IconButton
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  icon={isMuted ? <FiVolumeX /> : <FiVolume2 />}
                  onClick={toggleMute}
                  onMouseEnter={onVolumeToggle}
                  variant="ghost"
                  color="white"
                  size="sm"
                />
                
                {isVolumeOpen && (
                  <Box
                    position="absolute"
                    bottom="100%"
                    left="50%"
                    transform="translateX(-50%)"
                    p={2}
                    bg="gray.800"
                    borderRadius="md"
                    width="40px"
                    height="100px"
                    onMouseLeave={onVolumeClose}
                  >
                    <Slider
                      aria-label="volume-slider"
                      value={isMuted ? 0 : volume}
                      min={0}
                      max={1}
                      step={0.1}
                      onChange={handleVolumeChange}
                      orientation="vertical"
                      height="80px"
                    >
                      <SliderTrack bg="gray.600">
                        <SliderFilledTrack bg="brand.500" />
                      </SliderTrack>
                      <SliderThumb boxSize={2} />
                    </Slider>
                  </Box>
                )}
              </Box>
              
              {/* Time display */}
              <Text color="white" fontSize="sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
            </HStack>
            
            <HStack spacing={2}>
              {/* Settings menu */}
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Settings"
                  icon={<FiSettings />}
                  variant="ghost"
                  color="white"
                  size="sm"
                />
                <MenuList bg="gray.800" borderColor="gray.700">
                  <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }} onClick={() => handlePlaybackRateChange(0.5)}>
                    0.5x {playbackRate === 0.5 && '✓'}
                  </MenuItem>
                  <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }} onClick={() => handlePlaybackRateChange(1)}>
                    1x {playbackRate === 1 && '✓'}
                  </MenuItem>
                  <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }} onClick={() => handlePlaybackRateChange(1.5)}>
                    1.5x {playbackRate === 1.5 && '✓'}
                  </MenuItem>
                  <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }} onClick={() => handlePlaybackRateChange(2)}>
                    2x {playbackRate === 2 && '✓'}
                  </MenuItem>
                </MenuList>
              </Menu>
              
              {/* Download button */}
              <IconButton
                aria-label="Download"
                icon={<FiDownload />}
                onClick={handleDownload}
                variant="ghost"
                color="white"
                size="sm"
              />
              
              {/* Fullscreen button */}
              <IconButton
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                icon={isFullscreen ? <FiMinimize /> : <FiMaximize />}
                onClick={toggleFullscreen}
                variant="ghost"
                color="white"
                size="sm"
              />
            </HStack>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default VideoPlayer;
