// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import HomePage from '../HomePage';
import { jest, describe, test, expect } from '@jest/globals';

// Mock the react-router-dom useNavigate hook
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useNavigate: () => jest.fn(),
}));

describe('HomePage Component', () => {
  const renderHomePage = () => {
    return render(
      <ChakraProvider>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </ChakraProvider>
    );
  };

  test('renders the page title', () => {
    renderHomePage();
    const titleElement = screen.getByText(/Vidocrisy/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the subtitle', () => {
    renderHomePage();
    const subtitleElement = screen.getByText(/Your personal AI video generation platform/i);
    expect(subtitleElement).toBeInTheDocument();
  });

  test('renders the feature cards', () => {
    renderHomePage();
    // Use more specific selectors to find the headings within the card headers
    const generateFeature = screen.getByRole('heading', { name: /Generate/i });
    const editFeature = screen.getByRole('heading', { name: /Edit/i });
    const libraryFeature = screen.getByRole('heading', { name: /Library/i });
    
    expect(generateFeature).toBeInTheDocument();
    expect(editFeature).toBeInTheDocument();
    expect(libraryFeature).toBeInTheDocument();
  });

  test('renders the get started button', () => {
    renderHomePage();
    const getStartedButton = screen.getByText(/Get Started Now/i);
    expect(getStartedButton).toBeInTheDocument();
  });

  test('renders the avatar section', () => {
    renderHomePage();
    const avatarSectionHeading = screen.getByText(/Your Avatars/i);
    const mikeAvatar = screen.getByAltText(/Mike Avatar/i);
    const miraAvatar = screen.getByAltText(/Mira Avatar/i);
    
    expect(avatarSectionHeading).toBeInTheDocument();
    expect(mikeAvatar).toBeInTheDocument();
    expect(miraAvatar).toBeInTheDocument();
  });
});
