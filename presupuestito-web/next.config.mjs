import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '*.trycloudflare.com',
    '*.loca.lt',
  ],
};

export default withSerwist(nextConfig);
