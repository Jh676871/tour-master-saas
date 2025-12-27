import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 移除 turbopack 設定以避免 Vercel 部署衝突，使用預設 Webpack */
  // turbopack: {}, 
  
  /* 其他設定 */
  eslint: {
    // 部署時忽略 ESLint 錯誤 (可選，視需求而定)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 部署時忽略 TS 錯誤 (可選，視需求而定)
    ignoreBuildErrors: true,
  }
};

export default nextConfig;