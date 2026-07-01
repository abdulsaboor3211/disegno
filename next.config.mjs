/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "berastores.com",
        pathname: "/cdn/shop/**",
      },
    ],
  },
};

export default nextConfig;
