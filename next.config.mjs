import path from 'path';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'services', 'prisma', 'tests']
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd())
    };
    return config;
  }
};

export default nextConfig;
