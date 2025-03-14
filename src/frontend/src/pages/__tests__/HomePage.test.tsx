import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import HomePage from '../HomePage';
import { jest, describe, test, expect } from '@jest/globals';

// Mock the react-router-dom useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
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

  test('renders the main heading', () => {
    renderHomePage();
    const headingElement = screen.getByRole('heading', { name: /AI-Powered Video Generation/i });
    expect(headingElement).toBeInTheDocument();
  });

  test('renders the feature cards', () => {
    renderHomePage();
    const generateFeature = screen.getByText(/Generate Videos/i);
    const editFeature = screen.getByText(/Edit Videos/i);
    const libraryFeature = screen.getByText(/Manage Library/i);
    
    expect(generateFeature).toBeInTheDocument();
    expect(editFeature).toBeInTheDocument();
    expect(libraryFeature).toBeInTheDocument();
  });

  test('renders the get started button', () => {
    renderHomePage();
    const getStartedButton = screen.getByRole('button', { name: /Get Started/i });
    expect(getStartedButton).toBeInTheDocument();
  });
});
