// @ts-nocheck
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import LibraryPage from '../LibraryPage';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock the useState hook to control loading state
jest.mock('react', () => {
  const originalModule = jest.requireActual('react') as object;
  return {
    ...originalModule,
    useState: jest.fn((initialValue) => [initialValue, jest.fn()]),
  };
});

describe('LibraryPage Component', () => {
  const renderLibraryPage = () => {
    return render(
      <ChakraProvider>
        <BrowserRouter>
          <LibraryPage />
        </BrowserRouter>
      </ChakraProvider>
    );
  };

  beforeEach(() => {
    // Reset the useState mock before each test
    jest.spyOn(React, 'useState').mockImplementation((initialValue) => [initialValue, jest.fn()]);
  });

  test('renders the page title', () => {
    renderLibraryPage();
    const titleElement = screen.getByText(/Video Library/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the search input', () => {
    renderLibraryPage();
    const searchInput = screen.getByPlaceholderText(/Search videos.../i);
    expect(searchInput).toBeInTheDocument();
  });

  test('renders the filter dropdown', () => {
    renderLibraryPage();
    const filterButton = screen.getByText(/Filter/i);
    expect(filterButton).toBeInTheDocument();
  });

  test('renders the new folder button', () => {
    renderLibraryPage();
    const newFolderButton = screen.getByText(/New Folder/i);
    expect(newFolderButton).toBeInTheDocument();
  });

  test('renders the recent videos section', () => {
    renderLibraryPage();
    const recentVideosHeading = screen.getByText(/Recent Videos/i);
    expect(recentVideosHeading).toBeInTheDocument();
  });

  test('renders the folders section', () => {
    renderLibraryPage();
    const foldersHeading = screen.getByText(/Folders/i);
    expect(foldersHeading).toBeInTheDocument();
  });

  test('renders loading skeletons when loading is true', () => {
    // Mock the useState hook to return loading as true
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
    
    renderLibraryPage();
    
    // Check for skeleton elements
    const skeletons = document.querySelectorAll('.chakra-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('renders video cards when loading is false', async () => {
    // Mock the useState hook to return loading as false
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, jest.fn()]);
    
    renderLibraryPage();
    
    // Check for video cards
    await waitFor(() => {
      const productIntroCard = screen.getByText(/Product Introduction/i);
      const featureWalkthroughCard = screen.getByText(/Feature Walkthrough/i);
      const fullPresentationCard = screen.getByText(/Full Presentation/i);
      
      expect(productIntroCard).toBeInTheDocument();
      expect(featureWalkthroughCard).toBeInTheDocument();
      expect(fullPresentationCard).toBeInTheDocument();
    });
  });
});
