import fm from "front-matter";
import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join, relative } from "path";

export type PageMetadata = {
	slug: string[];
	url: string;
	title: string;
	description?: string;
	links?: {
		doc?: string;
		api?: string;
	};
	component?: boolean;
};

type PageTreeNode = {
	type: "folder" | "page" | "separator";
	name: string;
	url?: string;
	external?: boolean;
	$id?: string;
	children?: PageTreeNode[];
};

type MetaJson = {
	title?: string;
	root?: boolean;
	pages: string[];
};

const CONTENT_DIR = join(process.cwd(), "content/docs");
const MANIFEST_OUTPUT = join(process.cwd(), "lib/source/manifest.ts");
const IMPORTS_OUTPUT = join(process.cwd(), "lib/source/imports.ts");

/**
 * This script generates two files for optimal bundle splitting:
 *
 * 1. manifest.ts - Lightweight metadata (used by metadata.ts)
 *    - Page metadata array
 *    - Page tree for navigation
 *    - ~50-100KB
 *
 * 2. imports.ts - Heavy import map (used by loaders.ts)
 *    - Dynamic import functions for all MDX files
 *    - ~50-100KB+
 *
 * Consumers should import from:
 * - lib/source/metadata - for generateStaticParams, navigation, search
 * - lib/source/loaders - for loading actual MDX content
 */

function getAllMdxFiles(dir: string, fileList: string[] = []): string[] {
	const files = readdirSync(dir);

	for (const file of files) {
		const filePath = join(dir, file);
		const stat = statSync(filePath);

		if (stat.isDirectory()) {
			getAllMdxFiles(filePath, fileList);
		} else if (file.endsWith(".mdx")) {
			fileList.push(filePath);
		}
	}

	return fileList;
}

function slugToUrl(slug: string[]): string {
	if (slug.length === 0) return "/docs";
	return `/docs/${slug.join("/")}`;
}

function filePathToSlug(filePath: string): string[] {
	const relativePath = relative(CONTENT_DIR, filePath);
	const parts = relativePath.replace(/\.mdx$/, "").split("/");

	// Handle (root) directory
	const filtered = parts.filter((p) => !p.startsWith("(") && !p.endsWith(")"));

	// If it's index.mdx in root, return empty array
	if (filtered.length === 1 && filtered[0] === "index") {
		return [];
	}

	// If it's index.mdx in a subdirectory, use the directory name
	if (filtered[filtered.length - 1] === "index") {
		filtered.pop();
	}

	return filtered;
}

function extractMetadata(filePath: string): PageMetadata {
	const content = readFileSync(filePath, "utf-8");
	const { attributes } = fm<any>(content);

	const slug = filePathToSlug(filePath);
	const url = slugToUrl(slug);

	return {
		slug,
		url,
		title: attributes.title || "Untitled",
		description: attributes.description,
		links: attributes.links,
		component: attributes.component,
	};
}

function readMetaJson(dir: string): MetaJson | null {
	const metaPath = join(dir, "meta.json");
	try {
		const content = readFileSync(metaPath, "utf-8");
		return JSON.parse(content);
	} catch {
		return null;
	}
}

function buildPageTree(
	dir: string,
	pagesManifest: PageMetadata[],
): PageTreeNode[] {
	const meta = readMetaJson(dir);
	if (!meta) return [];

	const children: PageTreeNode[] = [];

	for (const page of meta.pages) {
		// Handle markdown links like "[Installation](/docs/installation)"
		if (page.startsWith("[") && page.includes("](")) {
			const match = page.match(/\[(.*?)\]\((.*?)\)/);
			if (match) {
				const id =
					match[2].split("/").pop() ||
					match[1].toLowerCase().replace(/\s+/g, "-");
				children.push({
					type: "page",
					name: match[1],
					url: match[2],
					$id: id,
					external: !match[2].startsWith("/"),
				});
			}
			continue;
		}

		// Handle separator
		if (page === "---") {
			children.push({
				type: "separator",
				name: "",
			});
			continue;
		}

		const itemPath = join(dir, page);
		const mdxPath = join(itemPath, "index.mdx");
		const singleMdxPath = `${itemPath}.mdx`;

		// Check if it's a folder
		try {
			const stat = statSync(itemPath);
			if (stat.isDirectory()) {
				const folderMeta = readMetaJson(itemPath);
				let folderChildren = buildPageTree(itemPath, pagesManifest);

				// If no meta.json, auto-generate children from all MDX files in folder
				if (!folderMeta) {
					const mdxFiles = readdirSync(itemPath).filter((f) =>
						f.endsWith(".mdx"),
					);
					const autoChildren: PageTreeNode[] = [];
					for (const file of mdxFiles) {
						const filePath = join(itemPath, file);
						const fileSlug = filePathToSlug(filePath);
						const metadata = pagesManifest.find(
							(p) => JSON.stringify(p.slug) === JSON.stringify(fileSlug),
						);
						if (metadata && file !== "index.mdx") {
							autoChildren.push({
								type: "page",
								name: metadata.title,
								url: metadata.url,
								$id: file.replace(".mdx", ""),
								external: false,
							});
						}
					}
					folderChildren = autoChildren.sort((a, b) =>
						a.name.localeCompare(b.name),
					);
				}

				// Find index page for this folder
				let indexUrl: string | undefined;
				try {
					if (statSync(mdxPath).isFile()) {
						const metadata = pagesManifest.find(
							(p) => p.url === slugToUrl(filePathToSlug(mdxPath)),
						);
						indexUrl = metadata?.url;
					}
				} catch {}

				// Determine folder name
				let folderName = folderMeta?.title || page;
				// Check if there's an index page we can use for the name
				if (!folderMeta) {
					const indexMetadata = pagesManifest.find(
						(p) => p.url === slugToUrl(filePathToSlug(mdxPath)),
					);
					if (indexMetadata) {
						folderName = indexMetadata.title;
					}
				}

				children.push({
					type: "folder",
					name: folderName,
					url: indexUrl,
					$id: page,
					children: folderChildren || [],
				});
				continue;
			}
		} catch {}

		// Check if it's a single MDX file
		try {
			if (statSync(singleMdxPath).isFile()) {
				const metadata = pagesManifest.find(
					(p) => p.url === slugToUrl(filePathToSlug(singleMdxPath)),
				);
				if (metadata) {
					children.push({
						type: "page",
						name: metadata.title,
						url: metadata.url,
						$id: page,
						external: false,
					});
				}
			}
		} catch {}
	}

	return children;
}

/**
 * Convert file path to import statement
 */
function filePathToImportPath(filePath: string): string {
	const relativePath = relative(CONTENT_DIR, filePath);
	return `@/content/docs/${relativePath}?collection=docs`;
}

function generateManifest() {
	console.log("Scanning MDX files...");

	const mdxFiles = getAllMdxFiles(CONTENT_DIR);
	const pagesManifest: PageMetadata[] = [];

	for (const file of mdxFiles) {
		const metadata = extractMetadata(file);
		pagesManifest.push(metadata);
	}

	console.log(`Found ${pagesManifest.length} pages`);

	console.log("Building page tree...");

	const pageTree: PageTreeNode = {
		type: "folder",
		name: "Documentation",
		children: buildPageTree(CONTENT_DIR, pagesManifest) || [],
	};

	console.log("Writing manifest...");

	// Generate manifest file
	const manifestOutput = `// Auto-generated by scripts/build-source-manifest.ts
// Do not edit manually

import type { PageMetadata, PageTreeNode } from "./types"

export const pagesManifest: PageMetadata[] = ${JSON.stringify(pagesManifest, null, 2)}

export const pageTree: PageTreeNode = ${JSON.stringify(pageTree, null, 2)}
`;

	writeFileSync(MANIFEST_OUTPUT, manifestOutput, "utf-8");

	console.log(
		`Manifest: ${relative(process.cwd(), MANIFEST_OUTPUT)} (${(Buffer.byteLength(manifestOutput) / 1024).toFixed(1)}KB)`,
	);

	console.log("Generating import map...");

	// Generate import map
	const importEntries = mdxFiles
		.map((file) => {
			const metadata = extractMetadata(file);
			const slugKey = metadata.slug.join("/") || "";
			const importPath = filePathToImportPath(file);
			return `  "${slugKey}": () => import("${importPath}"),`;
		})
		.join("\n");

	const importsOutput = `// Auto-generated by scripts/build-source-manifest.ts
// Do not edit manually
// Each import loads compiled MDX from Fumadocs (with rehype plugins, Shiki, etc.)

import type { ImportMap } from "./types"

/**
 * Dynamic import map for all documentation pages
 * The ?collection=docs query parameter enables Fumadocs MDX compilation
 * This enables bundle splitting while maintaining build-time static generation
 *
 * NOTE: This file is heavy (~50-100KB+). Only import via lib/source/loaders.ts
 * when you need to load actual MDX content. For metadata-only queries, use
 * lib/source/metadata.ts instead.
 */
export const importMap: ImportMap = {
${importEntries}
}
`;

	writeFileSync(IMPORTS_OUTPUT, importsOutput, "utf-8");

	console.log(
		`Imports: ${relative(process.cwd(), IMPORTS_OUTPUT)} (${(Buffer.byteLength(importsOutput) / 1024).toFixed(1)}KB)`,
	);
	console.log(`   - ${pagesManifest.length} pages total`);
}

// Run the script
generateManifest();
