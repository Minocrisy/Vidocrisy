#!/bin/bash

# Script to set up and run tests for the Vidocrisy frontend

# Set error handling
set -e

# Print colored messages
print_message() {
  echo -e "\e[1;34m$1\e[0m"
}

print_success() {
  echo -e "\e[1;32m$1\e[0m"
}

print_error() {
  echo -e "\e[1;31m$1\e[0m"
}

# Navigate to the frontend directory
cd "$(dirname "$0")/.."
print_message "Working directory: $(pwd)"

# Install dependencies
print_message "Installing testing dependencies..."
npm install --save-dev \
  @jest/globals \
  @testing-library/jest-dom \
  @testing-library/react \
  @testing-library/user-event \
  @types/jest \
  identity-obj-proxy \
  jest \
  jest-environment-jsdom \
  ts-jest

# Check if installation was successful
if [ $? -eq 0 ]; then
  print_success "Dependencies installed successfully!"
else
  print_error "Failed to install dependencies."
  exit 1
fi

# Create necessary directories if they don't exist
print_message "Creating test directories if they don't exist..."
mkdir -p src/__mocks__
mkdir -p src/pages/__tests__
mkdir -p src/components/__tests__
mkdir -p src/components/VideoEditor/__tests__

# Check if the file mock exists, create it if it doesn't
if [ ! -f src/__mocks__/fileMock.js ]; then
  print_message "Creating file mock..."
  echo "// This file is used to mock file imports in Jest tests" > src/__mocks__/fileMock.js
  echo "module.exports = 'test-file-stub';" >> src/__mocks__/fileMock.js
fi

# Check if the setup file exists, create it if it doesn't
if [ ! -f src/setupTests.ts ]; then
  print_message "Creating setup file..."
  cat > src/setupTests.ts << 'EOL'
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Add Jest types
import { jest } from '@jest/globals';

// Mock the window.matchMedia function
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock the IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock the ResizeObserver
class MockResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// Mock the HTMLMediaElement API
Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: jest.fn(),
});

// Mock the fetch API
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    redirected: false,
    type: 'basic' as ResponseType,
    url: '',
    clone: function() { return this; },
  })
);
EOL
fi

# Check if the Jest config exists, create it if it doesn't
if [ ! -f jest.config.js ]; then
  print_message "Creating Jest config..."
  cat > jest.config.js << 'EOL'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};
EOL
fi

# Update package.json scripts
print_message "Updating package.json scripts..."
# Use jq to update the scripts section if available, otherwise print a message
if command -v jq &> /dev/null; then
  jq '.scripts.test = "jest" | .scripts["test:watch"] = "jest --watch" | .scripts["test:coverage"] = "jest --coverage"' package.json > package.json.tmp
  mv package.json.tmp package.json
  print_success "Updated package.json scripts!"
else
  print_message "Please manually update your package.json to include the following scripts:"
  echo '{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}'
fi

# Run tests
print_message "Running tests..."
npm test

# Check if tests were successful
if [ $? -eq 0 ]; then
  print_success "Tests completed successfully!"
else
  print_error "Tests failed. Please check the output above for details."
  exit 1
fi

print_success "Test setup complete!"
print_message "You can now run tests with the following commands:"
echo "  npm test          # Run all tests"
echo "  npm run test:watch # Run tests in watch mode"
echo "  npm run test:coverage # Run tests with coverage report"

exit 0
