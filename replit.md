# Game Hub - Mini Games Collection

## Overview

Game Hub is a web-based gaming platform featuring multiple mini-games including a CPS (Clicks Per Second) Clicker, Typing Race (single-player and multiplayer modes). The application is built as a full-stack TypeScript project with a React frontend and Express backend, featuring real-time multiplayer capabilities through WebSocket connections.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React 18 with TypeScript, using Vite as the build tool and bundler.

**UI Framework**: The application uses shadcn/ui components built on top of Radix UI primitives, providing an accessible and customizable component library. Styling is handled through Tailwind CSS with a custom design system defined in CSS variables.

**Routing**: Client-side routing is implemented using React Router DOM with the following route structure:
- `/` - Home page with game selection
- `/cps-clicker` - CPS clicking game
- `/typing-race` - Single-player typing race
- `/multiplayer-race` - Real-time multiplayer typing race

**State Management**: The application uses two distinct state management approaches:
- Local React state with hooks for component-level state
- Zustand stores for global state (game phase management and audio controls)

**3D Rendering Capabilities**: The frontend includes React Three Fiber and related libraries (@react-three/drei, @react-three/postprocessing) for potential 3D game features, with GLSL shader support through a Vite plugin.

**Real-time Communication**: Socket.IO client is used for WebSocket connections in the multiplayer game mode, enabling real-time player synchronization.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript, using ES modules.

**Development vs Production**: The server has two distinct entry points:
- `index-dev.ts`: Development mode with Vite middleware for hot module replacement
- `index-prod.ts`: Production mode serving pre-built static assets

**WebSocket Integration**: Socket.IO server handles real-time multiplayer game logic including:
- Player connections and disconnections
- Game state synchronization
- Progress tracking
- Winner determination

**Game Logic**: The multiplayer typing race maintains server-side game state with:
- Maximum 3 concurrent players
- Random text selection from predefined samples
- Real-time progress tracking
- First-to-finish winner detection

**Session Management**: The application includes connect-pg-simple for PostgreSQL session storage, though actual session implementation appears minimal in the current codebase.

**Development Server**: In development mode, Vite serves as middleware within Express, providing HMR and transforming TypeScript/JSX on-the-fly. The server dynamically injects cache-busting query parameters to ensure fresh module loads.

### Data Storage Solutions

**Database**: PostgreSQL is configured as the primary database through the Neon serverless driver (@neondatabase/serverless).

**ORM**: Drizzle ORM is used for database schema definition and type-safe queries. The schema is located in `shared/schema.ts` and includes a users table with username/password authentication fields.

**In-Memory Fallback**: A MemStorage class provides an in-memory implementation of the storage interface for development or testing without database connectivity.

**Schema Management**: Drizzle Kit handles migrations with the configuration pointing to PostgreSQL dialect. The schema uses Zod for validation through drizzle-zod integration.

**Shared Types**: Database types and schemas are shared between client and server through the `shared` directory, ensuring type consistency across the full stack.

### External Dependencies

**Database Service**: 
- Neon Serverless PostgreSQL (via DATABASE_URL environment variable)
- Connection required for production; fallback to MemStorage available

**Real-time Infrastructure**:
- Socket.IO for WebSocket-based multiplayer functionality
- Handles bidirectional communication between server and multiple clients

**UI Component Libraries**:
- Radix UI primitives for accessible component foundations
- shadcn/ui component patterns
- Lucide React for icons

**Build and Development Tools**:
- Vite for frontend bundling and development server
- esbuild for backend production builds
- tsx for TypeScript execution in development
- PostCSS with Tailwind CSS for styling

**3D Graphics Libraries**:
- Three.js (via React Three Fiber)
- @react-three/drei for helpers
- @react-three/postprocessing for effects
- GLSL shader support

**Data Fetching**:
- TanStack Query (React Query) for server state management
- Custom fetch wrapper with credential handling

**Validation and Type Safety**:
- Zod for runtime validation
- TypeScript for compile-time type checking
- Drizzle Zod for database schema validation

**Styling and Theming**:
- Tailwind CSS with custom configuration
- class-variance-authority for variant-based component styling
- CSS custom properties for theming support (light/dark modes referenced)