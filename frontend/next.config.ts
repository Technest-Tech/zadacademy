import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    // Demo/placeholder course thumbnails pulled from the web.
    // Swap these out for real branded thumbnails when available.
    remotePatterns: [
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      // Uploaded teacher photos served from the backend's public storage.
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
  },
}

export default config
