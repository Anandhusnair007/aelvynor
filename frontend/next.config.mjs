/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
        ],
        unoptimized: process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true', // Required for GitHub Pages static export
    },
    // Enable static export for GitHub Pages (uncomment if deploying to GitHub Pages)
    // output: 'export',
    experimental: {
        optimizePackageImports: ['framer-motion', 'lucide-react'],
    },
    // Base path for GitHub Pages (uncomment if deploying to GitHub Pages)
    // basePath: '/aelvynor',
    // assetPrefix: '/aelvynor',
};

export default nextConfig;
