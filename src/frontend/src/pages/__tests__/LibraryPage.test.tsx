// @ts-nocheck
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import LibraryPage from '../LibraryPage';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock Chakra UI hooks
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useBreakpointValue: jest.fn().mockImplementation((values) => {
      // Return the base value as default
      if (values && typeof values === 'object' && 'base' in values) {
        return values.base;
      }
      return Object.values(values || {})[0] || '';
    }),
    useMediaQuery: jest.fn().mockReturnValue([true]),
    useBreakpoint: jest.fn().mockReturnValue('md'),
  };
});

// Mock the useState hook to control loading state
jest.mock('react', () => {
  const originalModule = jest.requireActual('react');
  return {
    ...originalModule,
    useState: jest.fn().mockImplementation((initialValue) => [initialValue, jest.fn()]),
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
    // Use a more specific selector to find the button with text "New Folder"
    const newFolderButton = screen.getByRole('button', { name: /New Folder/i });
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
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock the useState hook to return loading as false for all calls
    // This ensures the component's loading state is false
    jest.spyOn(React, 'useState').mockImplementation((init) => {
      if (init === true) { // If this is the loading state initialization
        return [false, jest.fn()]; // Return loading as false
      }
      return [init, jest.fn()]; // Otherwise return the initial value
    });
    
    renderLibraryPage();
    
    // Check for video cards with a longer timeout
    await waitFor(() => {
      // Look for headings within card bodies
      const headings = screen.getAllByRole('heading', { level: 3 });
      
      // Check if any of the headings contain our expected text
      const hasProductIntro = headings.some(h => h.textContent?.includes('Product Introduction'));
      const hasFeatureWalkthrough = headings.some(h => h.textContent?.includes('Feature Walkthrough'));
      const hasFullPresentation = headings.some(h => h.textContent?.includes('Full Presentation'));
      
      expect(hasProductIntro).toBe(true);
      expect(hasFeatureWalkthrough).toBe(true);
      expect(hasFullPresentation).toBe(true);
    }, { timeout: 3000 });
  });
});
