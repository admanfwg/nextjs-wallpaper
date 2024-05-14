/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "mywallpaperbucket.s3.ap-northeast-1.amazonaws.com",
        // "path": "/.*" // 不再需要路径匹配，因为这是一个完整的主机名
      }
    ],
  },
};

module.exports = nextConfig;
