/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  // output: "standalone", // Uncomment this line if you use Docker
}

export default nextConfig
