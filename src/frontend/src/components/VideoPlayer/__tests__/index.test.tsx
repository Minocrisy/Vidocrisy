import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import VideoPlayer from '../index';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock video.js
jest.mock('video.js', () => {
  const mockPlayer = {
    on: jest.fn(),
    ready: jest.fn(callback => callback()),
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
    
    const videoElement = document.querySelector('.video-js');
    expect(videoElement).toBeInTheDocument();
  });

  test('renders custom controls', () => {
    render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    const playButton = screen.getByLabelText(/play/i);
    const volumeButton = screen.getByLabelText(/volume/i);
    const fullscreenButton = screen.getByLabelText(/fullscreen/i);
    
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
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  test('handles play button click', () => {
    render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    const playButton = screen.getByLabelText(/play/i);
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
    
    const volumeButton = screen.getByLabelText(/volume/i);
    fireEvent.click(volumeButton);
    
    // Volume control should be visible after clicking the button
    const volumeSlider = screen.getByLabelText(/volume slider/i);
    expect(volumeSlider).toBeInTheDocument();
  });

  test('handles fullscreen button click', () => {
    // Mock the requestFullscreen method
    const requestFullscreenMock = jest.fn();
    Element.prototype.requestFullscreen = requestFullscreenMock;
    
    render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    const fullscreenButton = screen.getByLabelText(/fullscreen/i);
    fireEvent.click(fullscreenButton);
    
    // Check if requestFullscreen was called
    expect(requestFullscreenMock).toHaveBeenCalled();
  });

  test('handles time update', () => {
    render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    // Simulate time update event
    const videoElement = document.querySelector('.video-js');
    fireEvent.timeUpdate(videoElement);
    
    // Check if onTimeUpdate callback was called
    expect(mockProps.onTimeUpdate).toHaveBeenCalled();
  });

  test('handles video end', () => {
    render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    // Simulate ended event
    const videoElement = document.querySelector('.video-js');
    fireEvent.ended(videoElement);
    
    // Check if onEnded callback was called
    expect(mockProps.onEnded).toHaveBeenCalled();
  });

  test('cleans up on unmount', () => {
    const { unmount } = render(
      <ChakraProvider>
        <VideoPlayer {...mockProps} />
      </ChakraProvider>
    );
    
    // Unmount the component
    unmount();
    
    // Check if dispose was called
    const videojs = require('video.js');
    const mockPlayer = videojs();
    expect(mockPlayer.dispose).toHaveBeenCalled();
  });
});
