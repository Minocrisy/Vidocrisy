// @ts-nocheck
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import VideoPlayer from '../index';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock video.js
jest.mock('video.js', () => {
  const mockPlayer = {
    on: jest.fn(),
    ready: jest.fn((callback) => callback()),
    dispose: jest.fn(),
    src: jest.fn(),
    poster: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    currentTime: jest.fn(),
    duration: jest.fn(() => 100),
    volume: jest.fn(),
    muted: jest.fn(),
    playbackRate: jest.fn(),
  };
  
  return jest.fn(() => mockPlayer);
});

// Mock the video service
jest.mock('../../../services/video.service', () => ({
  getVideoStreamUrl: jest.fn((videoId) => `http://localhost:5000/api/videos/${videoId}/stream`),
}));

describe('VideoPlayer Component', () => {
  const mockProps = {
    src: 'test-video.mp4',
    poster: 'test-poster.jpg',
    onEnded: jest.fn(),
    onTimeUpdate: jest.fn(),
    onPlay: jest.fn(),
    onPause: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the video player', () => {
    render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    const videoElement = document.querySelector('video');
    expect(videoElement).toBeInTheDocument();
  });

  test('renders custom controls', () => {
    render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    const playButton = screen.getByLabelText(/Play/i);
    const volumeButton = screen.getByLabelText(/Mute/i);
    const fullscreenButton = screen.getByLabelText(/Fullscreen/i);
    
    expect(playButton).toBeInTheDocument();
    expect(volumeButton).toBeInTheDocument();
    expect(fullscreenButton).toBeInTheDocument();
  });

  test('renders progress bar', () => {
    render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    const progressBar = screen.getByLabelText(/video-progress/i);
    expect(progressBar).toBeInTheDocument();
  });

  test('handles play button click', () => {
    render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    const playButton = screen.getByLabelText(/Play/i);
    fireEvent.click(playButton);
    
    // Since we're mocking video.js, we can't directly test the play method
    // But we can test that the onPlay callback was called
    expect(mockProps.onPlay).toHaveBeenCalled();
  });

  test('handles volume button click', () => {
    render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    const volumeButton = screen.getByLabelText(/Mute/i);
    fireEvent.click(volumeButton);
    fireEvent.mouseEnter(volumeButton);
    
    // Volume control should be visible after clicking the button
    const volumeSlider = screen.getByLabelText(/volume-slider/i);
    expect(volumeSlider).toBeInTheDocument();
  });

  test('handles fullscreen button click', () => {
    // Mock the requestFullscreen method
    const requestFullscreenMock = jest.fn().mockReturnValue(Promise.resolve());
    // Save original method
    const originalRequestFullscreen = Element.prototype.requestFullscreen;
    // Type assertion to avoid TypeScript errors
    Element.prototype.requestFullscreen = requestFullscreenMock;
    
    render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    const fullscreenButton = screen.getByLabelText(/Fullscreen/i);
    fireEvent.click(fullscreenButton);
    
    // Check if requestFullscreen was called
    expect(requestFullscreenMock).toHaveBeenCalled();
    
    // Restore original method
    Element.prototype.requestFullscreen = originalRequestFullscreen;
  });

  test('handles time update', () => {
    render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    // Simulate time update event
    const videoElement = document.querySelector('video');
    if (videoElement) {
      fireEvent.timeUpdate(videoElement);
      
      // Check if onTimeUpdate callback was called
      expect(mockProps.onTimeUpdate).toHaveBeenCalled();
    }
  });

  test('handles video end', () => {
    render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    // Simulate ended event
    const videoElement = document.querySelector('video');
    if (videoElement) {
      fireEvent.ended(videoElement);
      
      // Check if onEnded callback was called
      expect(mockProps.onEnded).toHaveBeenCalled();
    }
  });

  test('shows loading state initially', () => {
    render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    const loadingText = screen.getByText(/Loading.../i);
    expect(loadingText).toBeInTheDocument();
  });
});
