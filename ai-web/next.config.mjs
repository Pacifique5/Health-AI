/** @type {import("next").NextConfig} */
const nextConfig = {
  async rewrites() {
    // Use environment variable for API URL in production, fallback to localhost in development
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
    
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

