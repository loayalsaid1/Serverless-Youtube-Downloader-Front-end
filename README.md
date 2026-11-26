# YouTube Downloader

A modern, real-time YouTube downloader built with Next.js and AWS WebSockets. Download videos in multiple formats (MP4, MP3, TXT, SRT) with live status updates.

## Features

- **Real-time Updates**: WebSocket integration for live download status
- **Multiple Formats**: Support for MP4 (video), MP3 (audio), TXT (transcript), and SRT (subtitles)
- **Smart URL Validation**: Automatically detects and validates YouTube URLs
- **Job Queue Management**: Track active and completed downloads
- **Auto-reconnection**: Automatically reconnects and resubmits jobs on connection drops
- **Dark/Light Theme**: Full theme support with system preference detection
- **Persistent History**: Local storage for download history
- **Mobile Responsive**: Optimized for all screen sizes

## Getting Started

### Prerequisites

- Node.js 18+ installed
- AWS API Gateway WebSocket endpoint

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Create a `.env.local` file and add your WebSocket URL:

\`\`\`env
NEXT_PUBLIC_WS_URL=wss://your-api-gateway-url.execute-api.region.amazonaws.com/production
\`\`\`

4. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## WebSocket Integration

The app expects WebSocket messages in the following format:

### Outgoing (Client → Server)

\`\`\`json
{
  "action": "requestVideo",
  "videoId": "VIDEO_ID",
  "format": "mp4"
}
\`\`\`

### Incoming (Server → Client)

**Job Queued:**
\`\`\`json
{
  "type": "jobQueued",
  "payload": {
    "jobId": "unique-job-id"
  }
}
\`\`\`

**Status Changed:**
\`\`\`json
{
  "type": "jobStatusChanged",
  "payload": {
    "jobId": "unique-job-id",
    "status": "PROCESSING",
    "videoTitle": "Video Title",
    "error": "Error message (if failed)"
  }
}
\`\`\`

**File Ready:**
\`\`\`json
{
  "type": "fileReady",
  "payload": {
    "jobId": "unique-job-id",
    "fileUrl": "https://download-url.com/file.mp4",
    "videoTitle": "Video Title"
  }
}
\`\`\`

## Architecture

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality UI components
- **Zustand**: State management (via local storage)
- **WebSocket**: Real-time communication
- **Sonner**: Toast notifications

## Project Structure

```
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── download-form.tsx  # Main download interface
│   ├── job-queue.tsx      # Job queue management
│   └── ...
├── hooks/                  # Custom React hooks
│   ├── use-websocket.ts   # WebSocket hook
│   ├── use-downloader.ts  # Download logic
│   └── use-job-queue.ts   # Job queue management
├── lib/                    # Utilities and services
│   ├── websocket-service.ts  # WebSocket service
│   ├── storage.ts         # Local storage service
│   ├── validators.ts      # URL validation
│   └── types.ts           # TypeScript types
└── ...
```

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Make sure to add your `NEXT_PUBLIC_WS_URL` environment variable in the Vercel dashboard.

## License

MIT
