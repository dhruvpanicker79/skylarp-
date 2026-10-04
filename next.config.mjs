/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Next's image optimiser pulls in `sharp`, a native binary that Windows
  // Smart App Control blocks on the team's build machines. Serving the
  // originals costs a little bandwidth and keeps the site buildable there.
  images: { unoptimized: true },

  // GLB/GLTF aircraft models are fetched at runtime by three.js, not imported,
  // so they need no loader — they live in /public/models and are swapped by
  // dropping in a new file. See data/aircraft.ts for the wiring.
};

export default nextConfig;
