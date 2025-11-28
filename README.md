# Game Hub - Mini Games Collection

A web-based gaming platform featuring multiple mini-games including CPS Clicker, Typing Race (single-player and multiplayer modes), with real-time multiplayer capabilities.

## Features

- **CPS Clicker**: Click per second challenge game
- **Turbo Race Champions**: Single-player typing race with AI difficulty levels and track customization
- **Multiplayer Typing Race**: Real-time multiplayer race with up to 3 players, QR code room joining, and leaderboards
- 3D graphics with Three.js and React Three Fiber
- Real-time multiplayer with WebSocket (Socket.IO)
- PostgreSQL database for persistent storage

## Tech Stack

**Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
**Backend**: Express.js + Node.js + TypeScript
**Database**: PostgreSQL (Neon Serverless)
**Real-time**: Socket.IO for WebSocket communication
**3D Graphics**: Three.js + React Three Fiber

## Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Neon serverless account)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```
DATABASE_URL=your_postgres_connection_string
SESSION_SECRET=your_secret_key
NODE_ENV=development
```

4. Set up the database:
```bash
npm run db:push
```

## Development

### Quick Start (Simplest Way)
Just run:
```bash
npm install
npx tsx index.ts
```

Then open your browser to: `http://localhost:5000`

### Alternative: Using npm scripts
```bash
npm run dev
```

The app will run at `http://localhost:5000`

## Production Build

Build for production:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Game pages
│   │   ├── components/    # React components
│   │   └── utils/
│   └── public/
│       └── textures/      # Game textures and videos
├── server/                # Express backend
│   ├── index-dev.ts       # Development entry point
│   ├── index-prod.ts      # Production entry point
│   └── routes.ts          # Game logic and routes
├── shared/                # Shared types and schemas
└── package.json          # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## Games

### CPS Clicker
Click as fast as possible to maximize clicks per second. Choose from 5, 10, 15, 30, or 60 second challenges.

### Turbo Race Champions
Single-player typing race with:
- Multiple tracks: Desert, Night City, Mountain
- Track shapes: Curved, Circle
- AI difficulty: Normal, Hard
- Real-time progress visualization with Race2D component

### Multiplayer Typing Race
Race against other players in real-time:
- Join with QR code scanning or room ID
- Max 3 players per game
- Ready-up system before race starts
- Live leaderboard and results screen
- Same track variety as single-player

## License

MIT
