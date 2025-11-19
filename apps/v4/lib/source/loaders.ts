/**
 * Heavy MDX content loader module
 * 
 * This module provides access to full MDX content with dynamic imports.
 * Use this ONLY when you need to render actual page content.
 * 
 * For metadata-only queries (navigation, search, generateStaticParams),
 * use metadata.ts instead to avoid loading the heavy import map.
 * 
 * IMPORTANT: This module lazy-loads the import map itself to avoid
 * bundling all ~80 import functions until actually needed.
 */

import { buildPageFromMetadata } from "./builders";
import { pagesManifest } from "./manifest";
import type { Page } from "./types";

/**
 * Lazy-load the import map only when needed
 * This prevents the heavy ~50-100KB import map from being
 * included in bundles that don't actually load MDX content
 */
async function getImportMap() {
	const { importMap } = await import("./imports");
	return importMap;
}

/**
 * Get a page with full MDX content loaded (async)
 * This should be used in page components during SSG
 * 
 * The dynamic import executes during build time (SSG), not at runtime.
 * This enables bundle splitting while maintaining static generation.
 */
export async function getPageWithContent(
	slugs: string[] | undefined,
): Promise<Page | undefined> {
	const metadata = pagesManifest.find((p) => {
		if (!slugs || slugs.length === 0) return p.slug.length === 0;
		return p.slug.join("/") === slugs.join("/");
	});

	if (!metadata) return undefined;

	const key = metadata.slug.join("/") || "";
	
	// Lazy-load the import map
	const importMap = await getImportMap();
	const importFn = importMap[key];

	if (!importFn) {
		console.warn(`No import function found for slug: ${key}`);
		return undefined;
	}

	try {
		// Dynamic import executes during build (SSG), not at runtime
		const build_module = await importFn();

		return buildPageFromMetadata(metadata, {
			body: build_module.default,
			toc: build_module.toc || [],
		});
	} catch (error) {
		console.error(`Error loading page: ${metadata.url}`, error);
		return undefined;
	}
}

/**
 * Re-export types for convenience
 */
export type { Page, PageData } from "./types";
