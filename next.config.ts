import type { NextConfig } from "next";
const nextConfig: NextConfig = {
    reactStrictMode: false,
    experimental: {
        reactCompiler: true,
    }
};

export default nextConfig;
