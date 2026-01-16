# Cold Start Check

A Next.js application designed to measure and monitor cold start performance across different serverless deployment platforms (Cloudflare Pages, Netlify, Vercel). This project serves as a benchmarking tool to understand how cold starts impact application performance in various edge and serverless environments.

# Related blog post
This Nextjs project is created to benchmark for cold starts. The outcomes are documented in [this blog post](https://punits.dev/blog/vercel-netlify-cloudflare-serverless-cold-starts/)

## Features

- **Cold Start Detection**: Automatically detects and tracks cold start events
- **Performance Metrics**: Monitors multiple timing metrics including:
  - Cold start status (🥶 COLD START vs 🔥 WARM)
  - Request count per instance
  - Instance age (time since initialization)
  - Server-side page processing time
  - Start render time (DOM interactive)
  - Initialization source tracking
- **Test Workloads**: Includes benchmark endpoints for different workload types:
  - **Compute-like**: Heavy computational operations using `mathjs`
  - **DB-like**: Data filtering and sorting operations
- **Heavy Library Testing**: Tests cold start impact with large dependencies:
  - `three.js` (3D graphics library)
  - `xlsx` (Excel file processing)
- **Multi-Platform Support**: Configured for deployment on:
  - Cloudflare Pages (via OpenNext)
  - Netlify
  - Vercel (standard Next.js)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── compute-like/    # Heavy compute workload endpoint
│   │   └── db-like/         # Database-like operations endpoint
│   ├── breed/               # Dog breed pages (with heavy libs)
│   ├── group/               # Dog breed group pages
│   └── page.tsx             # Home page with dog breeds & facts
├── components/
│   └── TimingFooter.tsx     # Real-time performance metrics display
├── utils/
│   ├── timing.ts            # Core timing and cold start detection
│   ├── platform.ts          # Platform detection utilities
│   └── slug.ts              # URL slug utilities
├── data/
│   └── benchmark-users.json # Test dataset for workloads
└── instrumentation.ts       # Instance initialization tracking
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application with real-time cold start metrics displayed in the footer.

### Build

```bash
# Standard Next.js build
pnpm build
pnpm start
```

## Deployment

### Cloudflare Pages

```bash
# Build for Cloudflare
pnpm cloudflare:build

# Local development with Wrangler
pnpm cloudflare:dev

# Deploy to Cloudflare Pages
pnpm cloudflare:preview

# View deployments
pnpm cloudflare:deployments

# Tail logs
pnpm cloudflare:tail
```

### Netlify

The project is configured with `netlify.toml` for automatic deployment. Simply connect your repository to Netlify.

### Vercel

Deploy using the standard Vercel CLI or connect your repository through the Vercel dashboard.

## How It Works

### Cold Start Detection

The application tracks cold starts through:

1. **Instrumentation Hook** (`instrumentation.ts`): Marks instance initialization when Next.js runtime starts
2. **Request Counting**: Tracks the number of requests per instance using global state
3. **Timing Utilities** (`utils/timing.ts`): Provides functions to measure:
   - Instance initialization time
   - Request count
   - Instance age
   - Page processing time

### Metrics Display

The `TimingFooter` component displays real-time metrics:
- **Cold Start Indicator**: Shows whether the current request is a cold start
- **Request Count**: Sequential number of requests handled by this instance
- **Instance Age**: Time elapsed since instance initialization
- **Page Processing Time**: Server-side rendering duration
- **Start Render Time**: Time from fetch start to DOM interactive
- **Initialized From**: Source of instance initialization (instrumentation vs timing)

### Test Endpoints

- `/api/compute-like`: Processes a dataset using `mathjs` for heavy computations
- `/api/db-like`: Performs filtering and sorting operations on a dataset
  - Query params: `minScore`, `limit`

## Technologies

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Styling
- **OpenNext**: Cloudflare Pages adapter for Next.js
- **mathjs**: Heavy computational library for testing
- **three.js**: 3D graphics library for cold start testing
- **xlsx**: Excel processing library

## License

MIT
