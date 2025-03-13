# Technical Context: VideoGen

## Technologies Used

### Frontend
- **Framework**: React.js (v18+)
- **UI Library**: Chakra UI
- **State Management**: React Context API
- **Routing**: React Router
- **Video Player**: Video.js
- **Drag and Drop**: React DnD
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Date/Time**: Day.js

### Backend
- **Runtime**: Node.js (v18+)
- **API Framework**: Express.js
- **Video Processing**: FFmpeg
- **API Documentation**: Swagger/OpenAPI
- **Authentication**: JWT (if needed)
- **Validation**: Joi or Zod

### Development Tools
- **Package Manager**: npm or yarn
- **Bundler**: Vite
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript
- **Version Control**: Git/GitHub

## Development Environment
- **Primary Environment**: GitHub Codespaces
  - Provides consistent development environment
  - Includes necessary tools pre-installed
  - Accessible from any device with a browser

- **Local Setup** (alternative):
  - Node.js v18+
  - npm or yarn
  - Git
  - FFmpeg installed locally
  - VS Code with recommended extensions

- **Environment Variables**:
  - HEDRA_API_KEY: For Hedra API access
  - RUNWAY_API_KEY: For RunwayML API access
  - ELEVENLABS_API_KEY: For voice generation
  - ELEVENLABS_VOICE_ID: For voice customization

## Build and Deployment

### Development Build
- **Frontend**: 
  - `vite dev` for local development server
  - Hot module replacement for quick iterations

- **Backend**:
  - `nodemon` for auto-restarting during development
  - Environment variables for configuration

### Production Build
- **Frontend**:
  - `vite build` for optimized production bundle
  - Static assets optimization

- **Backend**:
  - Bundled with tools like esbuild or ncc
  - Environment variables for configuration

### Deployment Options
- **Initial Deployment**:
  - Frontend: GitHub Pages or Netlify (static hosting)
  - Backend: Serverless functions (Netlify Functions or Vercel)

- **Future Scaling**:
  - Frontend: Same static hosting
  - Backend: Google Cloud Run or similar containerized service
  - Storage: Google Cloud Storage or similar

## Dependencies

### Core Dependencies
- react, react-dom
- chakra-ui/react, @emotion/react, @emotion/styled, framer-motion
- react-router-dom
- axios
- video.js
- react-dnd, react-dnd-html5-backend
- react-hook-form
- dayjs

### Backend Dependencies
- express
- cors
- helmet
- fluent-ffmpeg
- multer
- joi or zod
- jsonwebtoken (if needed)
- dotenv

### Development Dependencies
- vite
- typescript
- @types/* (type definitions)
- eslint
- prettier
- nodemon
- vitest (for testing)

## Technical Constraints

1. **API Usage Limits**:
   - Hedra API has usage limits and costs associated
   - RunwayML API has similar constraints
   - Need to optimize API calls to minimize costs

2. **Video Processing Requirements**:
   - FFmpeg needs to be available in the environment
   - Video processing is CPU and memory intensive
   - May require background processing for longer operations

3. **Storage Limitations**:
   - Video files can be large
   - Need efficient storage and retrieval strategy
   - Consider compression and optimization

4. **Browser Compatibility**:
   - Modern browsers only (Chrome, Firefox, Safari, Edge)
   - Video playback capabilities vary by browser
   - WebAssembly support needed for some operations

5. **Development Environment**:
   - GitHub Codespaces has resource limitations
   - Need to optimize for cloud development

## Testing Strategy

### Unit Testing
- **Frontend**: Vitest for component and utility testing
- **Backend**: Jest for API and service testing
- **Coverage Target**: 70% for critical paths

### Integration Testing
- API integration tests for external services
- End-to-end tests for critical user flows
- Mock external APIs for reliable testing

### Manual Testing
- UI/UX review for each feature
- Cross-browser testing for critical features
- Performance testing for video processing operations

## Integration Points

### External APIs
1. **Hedra API**:
   - Primary video generation service
   - Endpoints for character creation and animation
   - Authentication via API key

2. **RunwayML API**:
   - Secondary video generation service
   - Various creative tools and effects
   - Authentication via API key

3. **ElevenLabs API** (potential):
   - Voice generation and customization
   - Authentication via API key

### Internal Integration
1. **Frontend to Backend**:
   - RESTful API for most operations
   - WebSockets for real-time progress updates (if needed)

2. **Backend to Storage**:
   - File system operations for local storage
   - Cloud storage SDK for remote storage (future)

3. **Video Processing Pipeline**:
   - FFmpeg command execution
   - Progress monitoring and reporting

## Notes
- The technology choices prioritize modern, well-supported libraries and frameworks
- TypeScript will be used throughout to ensure type safety and better developer experience
- The architecture allows for future expansion to additional services
- Development will follow a component-based approach for better maintainability
- The system is designed to be deployed with minimal cost during initial development
