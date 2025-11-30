/**
 * Lightweight metadata-only source module
 * 
 * This module provides access to page metadata without loading the heavy MDX import map.
 * Use this for:
 * - generateStaticParams()
 * - Navigation components
 * - Search indexing
 * - Any metadata-only queries
 * 
 * For loading actual MDX content, use loaders.ts instead.
 */

import { buildPageFromMetadata } from "./builders";
import { pagesManifest, pageTree } from "./manifest";
import type { Page } from "./types";

/**
 * Get a single page by slugs (metadata only, sync)
 * Used for navigation and components that don't need MDX content
 */
function getPage(slugs: string[] | undefined): Page | undefined {
	const metadata = pagesManifest.find((p) => {
		if (!slugs || slugs.length === 0) return p.slug.length === 0;
		return p.slug.join("/") === slugs.join("/");
	});

	if (!metadata) return undefined;

	return buildPageFromMetadata(metadata);
}

/**
 * Get all pages (metadata only, no MDX bundles loaded)
 * Efficient for navigation and listing pages
 */
function getPages(): Page[] {
	return pagesManifest.map((meta) => buildPageFromMetadata(meta));
}

/**
 * Generate static params for Next.js
 * Only reads metadata, no MDX loading
 */
function generateParams<TSlug extends string = "slug">(slug?: TSlug) {
	const slugKey = (slug || "slug") as TSlug;
	return pagesManifest.map((page) => ({
		[slugKey]: page.slug.length === 0 ? [] : page.slug,
	})) as Array<Record<TSlug, string[]>>;
}

/**
 * Get page tree for navigation
 * Returns the pre-built tree from manifest
 */
function getPageTree(_locale?: string) {
	return pageTree;
}

/**
 * Get page by URL href
 */
function getPageByHref(href: string) {
	const cleanHref = href.split("#")[0]; // Remove hash
	const metadata = pagesManifest.find((p) => p.url === cleanHref);

	if (!metadata) return undefined;

	return {
		page: buildPageFromMetadata(metadata),
	};
}

/**
 * Fumadocs compatibility stubs
 * These are not used in our custom implementation
 */
function getLanguages() {
	return [];
}

function getNodePage(_node: unknown, _language?: string) {
	return undefined;
}

function getNodeMeta(_node: unknown, _language?: string) {
	return undefined;
}

/**
 * Main source export (metadata only)
 * Compatible with Fumadocs loader API for metadata queries
 */
export const source = {
	pageTree,
	getPage,
	getPages,
	generateParams,
	getPageTree,
	getPageByHref,
	getLanguages,
	getNodePage,
	getNodeMeta,
};

/**
 * Direct exports for convenience
 */
export { pagesManifest, pageTree };

/**
 * Re-export types
 */
export type { Page, PageMetadata, PageTreeNode } from "./types";
