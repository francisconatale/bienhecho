import withSerwist from "@serwist/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '*.trycloudflare.com',
    '*.loca.lt',
  ],
};

export default nextConfig;
