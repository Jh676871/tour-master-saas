import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 這裡加入 turbopack 設定來修復編譯錯誤 */
  turbopack: {}, 
  
  /* 如果你原本有其他設定，請保留在下面 */
};

export default nextConfig;