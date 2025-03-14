// @ts-nocheck
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ExportDialog from '../ExportDialog';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock the editorService
jest.mock('../../../services/editor.service', () => ({
  getAvailableExportFormats: jest.fn(() => [
    { id: 'mp4', name: 'MP4', description: 'Standard video format', extension: '.mp4' },
    { id: 'webm', name: 'WebM', description: 'Open web format', extension: '.webm' },
    { id: 'mov', name: 'QuickTime', description: 'Apple QuickTime format', extension: '.mov' }
  ]),
  getAvailableExportQualities: jest.fn(() => [
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
  ]),
  exportVideo: jest.fn(() => Promise.resolve('new-video-id'))
}));

// Mock the useToast hook
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useToast: jest.fn(() => ({
      title: '',
      description: '',
      status: '',
      duration: 5000,
      isClosable: true
    }))
  };
});

describe('ExportDialog Component', () => {
  const mockOnClose = jest.fn();
  const mockOnExportComplete = jest.fn();
  const videoId = 'test-video-id';

  const renderExportDialog = (isOpen = true) => {
    return render(
      <ChakraProvider>
        <ExportDialog
          isOpen={isOpen}
          onClose={mockOnClose}
          videoId={videoId}
          onExportComplete={mockOnExportComplete}
        />
      </ChakraProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the dialog when isOpen is true', () => {
    renderExportDialog(true);
    const dialogTitle = screen.getByRole('heading', { name: /Export Video/i });
    expect(dialogTitle).toBeInTheDocument();
  });

  test('does not render the dialog when isOpen is false', () => {
    renderExportDialog(false);
    const dialogTitle = screen.queryByText(/Export Video/i);
    expect(dialogTitle).not.toBeInTheDocument();
  });

  test('renders format options', () => {
    renderExportDialog();
    const mp4Option = screen.getByText('MP4');
    const webmOption = screen.getByText('WebM');
    const movOption = screen.getByText('QuickTime', { exact: true });
    
    expect(mp4Option).toBeInTheDocument();
    expect(webmOption).toBeInTheDocument();
    expect(movOption).toBeInTheDocument();
  });

  test('renders quality presets', () => {
    renderExportDialog();
    const lowOption = screen.getByText('Low', { exact: true });
    const mediumOption = screen.getByText('Medium', { exact: true });
    const highOption = screen.getByText('High', { exact: true });
    
    expect(lowOption).toBeInTheDocument();
    expect(mediumOption).toBeInTheDocument();
    expect(highOption).toBeInTheDocument();
  });

  test('renders resolution settings', () => {
    renderExportDialog();
    const resolutionSettings = screen.getByText(/Resolution Settings/i);
    expect(resolutionSettings).toBeInTheDocument();
  });

  test('renders output options', () => {
    renderExportDialog();
    const outputOptions = screen.getByText(/Output Options/i);
    expect(outputOptions).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    renderExportDialog();
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('disables export button when videoId is null', () => {
    render(
      <ChakraProvider>
        <ExportDialog
          isOpen={true}
          onClose={mockOnClose}
          videoId={null}
          onExportComplete={mockOnExportComplete}
        />
      </ChakraProvider>
    );
    
    const exportButton = screen.getByRole('button', { name: /Export Video/i });
    expect(exportButton).toBeDisabled();
  });

  test('enables export button when videoId is provided', () => {
    renderExportDialog();
    const exportButton = screen.getByRole('button', { name: /Export Video/i });
    expect(exportButton).not.toBeDisabled();
  });
});
