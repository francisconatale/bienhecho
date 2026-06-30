import withSerwist from "@serwist/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '*.trycloudflare.com',
    '*.loca.lt',
  ],
  // Required to suppress the "webpack config but no turbopack config" error
  // in Next.js 16 which uses Turbopack by default.
  turbopack: {},
};

export default withSerwist({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  // Disable during development so Turbopack works without conflicts.
  disable: process.env.NODE_ENV !== "production",
})(nextConfig);
