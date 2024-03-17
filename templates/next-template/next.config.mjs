/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      //  Cloudinary domain 
      "res.cloudinary.com"
    ]
  }
}

export default nextConfig
