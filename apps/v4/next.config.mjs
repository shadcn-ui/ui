import bundleAnalyzer from "@next/bundle-analyzer"
import { createMDX } from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
	devIndicators: false,
	typescript: {
		ignoreBuildErrors: true,
	},
	outputFileTracingRoot: "/Users/preet/code/ui",
	outputFileTracingIncludes: {
		"/*": ["./registry/**/*"],
	},
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "avatar.vercel.sh",
			},
		],
	},
	experimental: {
		turbopackFileSystemCacheForDev: true,
		optimizePackageImports: [
			'lucide-react',
			'@tabler/icons-react',
			'recharts',
			'date-fns',
			'@radix-ui/react-icons',
		],
	},
	webpack: (config, { isServer, webpack }) => {
		// Optimize date-fns - exclude all locales except en-US
		config.plugins.push(
			new webpack.ContextReplacementPlugin(
				/date-fns[\/\\]locale$/,
				/en-US/
			)
		)

		// Optimize webpack configuration for reduced memory usage
		config.optimization = {
			...config.optimization,
			// Reduce memory consumption during builds
			moduleIds: 'deterministic',
			// Split chunks more aggressively to reduce bundle size
			splitChunks: {
				chunks: 'all',
				maxInitialRequests: 25,
				minSize: 20000,
				cacheGroups: {
					default: false,
					vendors: false,
					// React & React DOM
					react: {
						name: 'react',
						chunks: 'all',
						test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
						priority: 40
					},
					// Radix UI primitives (large set of UI components)
					radix: {
						name: 'radix',
						chunks: 'all',
						test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
						priority: 35
					},
					// Icons libraries
					icons: {
						name: 'icons',
						chunks: 'all',
						test: /[\\/]node_modules[\\/](@tabler\/icons-react|lucide-react)[\\/]/,
						priority: 30
					},
					// date-fns (very large with all locales)
					dateFns: {
						name: 'date-fns',
						chunks: 'all',
						test: /[\\/]node_modules[\\/]date-fns[\\/]/,
						priority: 30
					},
					// Charts and data visualization
					charts: {
						name: 'charts',
						chunks: 'all',
						test: /[\\/]node_modules[\\/](recharts|@tanstack\/react-table)[\\/]/,
						priority: 25
					},
					// Motion/animation libraries
					motion: {
						name: 'motion',
						chunks: 'all',
						test: /[\\/]node_modules[\\/](motion|embla-carousel)[\\/]/,
						priority: 25
					},
					// Fumadocs (documentation framework)
					fumadocs: {
						name: 'fumadocs',
						chunks: 'all',
						test: /[\\/]node_modules[\\/]fumadocs/,
						priority: 25
					},
					// Other vendor libraries
					vendor: {
						name: 'vendor',
						chunks: 'all',
						test: /[\\/]node_modules[\\/]/,
						priority: 20
					},
					// MDX content chunks - split by directory
					mdxRoot: {
						name: 'mdx-root',
						test: /content\/docs\/\(root\)/,
						chunks: 'all',
						priority: 10
					},
					mdxComponents: {
						name: 'mdx-components',
						test: /content\/docs\/components/,
						chunks: 'all',
						priority: 10
					},
					mdxOther: {
						name: 'mdx-other',
						test: /content\/docs/,
						chunks: 'all',
						priority: 5
					},
					// Common chunks
					common: {
						minChunks: 2,
						priority: 5,
						reuseExistingChunk: true
					}
				}
			}
		}
		
		return config
	},
	redirects() {
		return [
			{
				source: "/components",
				destination: "/docs/components",
				permanent: true,
			},
			{
				source: "/docs/primitives/:path*",
				destination: "/docs/components/:path*",
				permanent: true,
			},
			{
				source: "/figma",
				destination: "/docs/figma",
				permanent: true,
			},
			{
				source: "/sidebar",
				destination: "/docs/components/sidebar",
				permanent: true,
			},
			{
				source: "/react-19",
				destination: "/docs/react-19",
				permanent: true,
			},
			{
				source: "/charts",
				destination: "/charts/area",
				permanent: true,
			},
			{
				source: "/view/styles/:style/:name",
				destination: "/view/:name",
				permanent: true,
			},
			{
				source: "/docs/:path*.mdx",
				destination: "/docs/:path*.md",
				permanent: true,
			},
			{
				source: "/mcp",
				destination: "/docs/mcp",
				permanent: false,
			},
			{
				source: "/directory",
				destination: "/docs/directory",
				permanent: false,
			},
		];
	},
	rewrites() {
		return [
			{
				source: "/docs/:path*.md",
				destination: "/llm/:path*",
			},
		];
	},
}

// Use Fumadocs MDX compilation
// The .source directory will be generated but we don't use it
const withMDX = createMDX()

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
})

export default withMDX(withBundleAnalyzer(nextConfig))
