# VideoGen

VideoGen is a personal video generation platform that integrates multiple AI video generation services (primarily Hedra, with RunwayML as a secondary option) into a unified interface. The platform allows users to generate, edit, splice, and brand videos with a focus on creating short movie-style and talking head videos.

## Features

- Integration with Hedra API for primary video generation
- Support for custom avatars (Mike and Mira)
- Video splicing functionality to combine multiple videos
- Easy-to-apply transitions between video segments
- Consistent branding at the beginning and end of all videos
- Video storage and organization system
- Basic video editing capabilities

## Project Structure

```
videogen/
├── assets/                  # Static assets (images, videos, branding)
├── memory-bank/             # Project documentation
├── public/                  # Public static files
├── src/
│   ├── frontend/            # React frontend
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── contexts/    # React context providers
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── pages/       # Page components
│   │   │   ├── services/    # API client services
│   │   │   ├── styles/      # CSS and theme files
│   │   │   ├── utils/       # Utility functions
│   │   │   ├── App.tsx      # Main App component
│   │   │   └── main.tsx     # Entry point
│   │   ├── index.html       # HTML template
│   │   ├── package.json     # Frontend dependencies
│   │   ├── tsconfig.json    # TypeScript configuration
│   │   └── vite.config.ts   # Vite configuration
│   │
│   └── backend/             # Node.js/Express backend
│       ├── src/
│       │   ├── config/      # Configuration files
│       │   ├── controllers/ # Route controllers
│       │   ├── middleware/  # Express middleware
│       │   ├── models/      # Data models
│       │   ├── routes/      # API routes
│       │   ├── services/    # Business logic
│       │   ├── utils/       # Utility functions
│       │   └── index.ts     # Entry point
│       ├── package.json     # Backend dependencies
│       └── tsconfig.json    # TypeScript configuration
│
├── .env.example             # Example environment variables
├── package.json             # Root package.json for scripts
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- FFmpeg (for video processing)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/videogen.git
   cd videogen
   ```

2. Install dependencies:
   ```
   npm run setup
   ```

3. Create a `.env` file based on `.env.example` and add your API keys:
   ```
   cp .env.example .env
   ```

4. Create required directories:
   ```
   mkdir -p uploads/videos uploads/images
   ```

### Development

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## API Keys

The following API keys are required:

- Hedra API Key
- RunwayML API Key (optional)
- ElevenLabs API Key (optional)

## License

This project is for personal use only.
