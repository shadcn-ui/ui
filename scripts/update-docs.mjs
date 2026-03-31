#!/usr/bin/env node

/**
 * Script to update Svelte and Vue component docs by porting content
 * from original docs in /tmp/ to the MDX format used in this project.
 */

import fs from "fs";
import path from "path";

// ── Paths ──────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(import.meta.dirname, "..");
const APPS_V4 = path.join(ROOT, "apps/v4");

const SVELTE_DOCS = path.join(APPS_V4, "content/docs/components/svelte");
const VUE_DOCS = path.join(APPS_V4, "content/docs/components/vue");

const SVELTE_ORIGINALS = "/tmp/shadcn-svelte/docs/content/components";
const VUE_ORIGINALS = "/tmp/shadcn-vue/apps/v4/content/docs/components";

const SVELTE_PREVIEWS = path.join(APPS_V4, "preview-server/src/svelte");
const VUE_PREVIEWS = path.join(APPS_V4, "preview-server/src/vue");

// ── Helpers ────────────────────────────────────────────────────────────────────

function loadPreviewNames(dir, ext) {
  const names = new Set();
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith(ext)) names.add(f.replace(ext, ""));
  }
  return names;
}

function pascalToKebab(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

// ── Svelte Transformer ────────────────────────────────────────────────────────

function extractSvelteContent(originalText) {
  // Remove frontmatter
  let text = originalText.replace(/^---[\s\S]*?---\s*/, "");

  // Remove the top-level <script> block (not inside code fences)
  // The top-level script block is always before any ## heading
  text = text.replace(/^([\s\S]*?)(<script[\s\S]*?<\/script>\s*)([\s\S]*)$/, (match, before, script, after) => {
    // Only remove if it's before the first ## heading (i.e., it's the component script, not in a code block)
    const firstHeading = text.indexOf("\n## ");
    const scriptStart = text.indexOf("<script");
    if (scriptStart < firstHeading || firstHeading === -1) {
      return before + after;
    }
    return match;
  });

  // Remove Callout blocks (the update notices)
  text = text.replace(/<Callout[\s\S]*?<\/Callout>\s*/g, "");

  // Find the first ## heading that is NOT ## Installation
  // We want to extract everything from the first non-Installation section onward
  // But we need to skip the initial ComponentPreview and Installation section

  // First, remove the initial ComponentPreview (before ## Installation)
  text = text.replace(
    /^[\s\S]*?(?=## (?:About|Installation|Usage))/,
    ""
  );

  // Remove ## Installation section entirely (up to the next ## heading)
  text = text.replace(
    /## Installation[\s\S]*?(?=\n## |\n$)/,
    ""
  );

  // If there's an ## About section before Installation, we need to keep it
  // but it was already handled above

  // Clean up: remove Svelte-specific component syntax remnants
  // Remove {#if viewerData}...{/if} blocks
  text = text.replace(/\{#if viewerData\}[\s\S]*?\{\/if\}\s*/g, "");
  // Remove {#snippet ...}...{/snippet} blocks
  text = text.replace(/\{#snippet[\s\S]*?\{\/snippet\}\s*/g, "");

  // Transform <ComponentPreview ...> blocks - handle all attribute orders and children
  // First: multi-line with <div></div> children
  text = text.replace(
    /<ComponentPreview\s+([^>]*?)name="([^"]+)"([^>]*)>\s*\n?\s*<div><\/div>\s*\n?\s*<\/ComponentPreview>/g,
    '<ComponentPreview framework="svelte" name="$2" />'
  );
  // Then: any remaining non-self-closing ComponentPreview
  text = text.replace(
    /<ComponentPreview\s+([^>]*?)name="([^"]+)"([^>]*)>\s*<\/ComponentPreview>/g,
    '<ComponentPreview framework="svelte" name="$2" />'
  );
  // Handle ComponentPreview with name not as first attr (e.g., type="block" name="xxx")
  text = text.replace(
    /<ComponentPreview\s+[^>]*?name="([^"]+)"[^/]*?(?:\/>|>\s*(?:<div><\/div>\s*)?<\/ComponentPreview>)/g,
    '<ComponentPreview framework="svelte" name="$1" />'
  );

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->\s*/g, "");

  // Remove <PMAddComp>, <PMInstall> leftovers
  text = text.replace(/<PMAddComp[^>]*\/>\s*/g, "");
  text = text.replace(/<PMInstall[^>]*\/>\s*/g, "");

  // Clean up excessive blank lines
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

// ── Vue Transformer ───────────────────────────────────────────────────────────

function extractVueContent(originalText, validPreviews) {
  // Remove frontmatter
  let text = originalText.replace(/^---[\s\S]*?---\s*/, "");

  // Remove the first ::component-preview block (the main demo before Installation)
  text = text.replace(
    /^[\s\S]*?(?=## (?:About|Installation|Usage))/,
    ""
  );

  // Remove ## Installation section (up to the next ## heading)
  text = text.replace(
    /## Installation[\s\S]*?(?=\n## |\n$)/,
    ""
  );

  // Remove ::vue-school-link blocks
  text = text.replace(/::vue-school-link\{[^}]*\}\s*[^\n]*\n::\s*/g, "");

  // Transform ::component-preview blocks (including indented ones)
  text = text.replace(
    /[ \t]*::component-preview\s*\n\s*---\s*\n([\s\S]*?)\s*---\s*\n\s*::/g,
    (match, yaml) => {
      const nameMatch = yaml.match(/name:\s*(\S+)/);
      if (!nameMatch) return "";
      const pascalName = nameMatch[1];
      // If already kebab-case, don't convert
      const kebabName = pascalName.includes("-")
        ? pascalName
        : pascalToKebab(pascalName);
      return `<ComponentPreview framework="vue" name="${kebabName}" />`;
    }
  );

  // Transform ::component-source blocks
  text = text.replace(
    /[ \t]*::component-source\{[^}]*\}\s*\n\s*::/g,
    ""
  );

  // Transform ::callout blocks (with or without attributes, including indented)
  text = text.replace(
    /[ \t]*::callout(?:\{[^}]*\})?\s*\n([\s\S]*?)\n[ \t]*::/g,
    (match, content) => {
      return `> ${content.trim().replace(/\n/g, "\n> ")}`;
    }
  );

  // Transform ::steps / ::step blocks - remove the directives, keep content
  text = text.replace(/[ \t]*::steps\s*\n?/g, "");
  // ::step with content on the same line
  text = text.replace(/[ \t]*::step\s*\n/g, "");
  // Standalone :: (closing directives) - only match lines that are just ::
  text = text.replace(/^[ \t]*::[ \t]*$/gm, "");

  // Transform ::tabs blocks
  text = text.replace(/[ \t]*::tabs\{[^}]*\}\s*\n?/g, "");
  text = text.replace(/[ \t]*::tabs-list\s*\n?/g, "");
  text = text.replace(/[ \t]*::tabs-trigger\{[^}]*\}\s*[^\n]*\n\s*/g, "");
  text = text.replace(/[ \t]*::tabs-content\{[^}]*\}\s*\n?/g, "");

  // Transform ::code-collapsible-wrapper
  text = text.replace(/[ \t]*::code-collapsible-wrapper\s*\n?/g, "");

  // Remove <figure> tags
  text = text.replace(/<figure[^>]*>\s*/g, "");
  text = text.replace(/<\/figure>\s*/g, "");

  // Clean up excessive blank lines
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

// ── Stub Generator ────────────────────────────────────────────────────────────

function generateStub(componentName, framework, title, description) {
  const installCmd =
    framework === "svelte"
      ? `npx shadcn@latest add @force-ui-svelte/${componentName}`
      : `npx shadcn@latest add @force-ui-vue/${componentName}`;

  return `---
title: ${title}
description: ${description}
base: ${framework}
component: true
---

<ComponentPreview framework="${framework}" name="${componentName}-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

\`\`\`bash
${installCmd}
\`\`\`

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource framework="${framework}" name="${componentName}" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>
`;
}

// ── Parse Frontmatter ─────────────────────────────────────────────────────────

function parseFrontmatter(text) {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.+)/);
    if (kv) result[kv[1]] = kv[2].trim();
  }
  return result;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const sveltePreviews = loadPreviewNames(SVELTE_PREVIEWS, ".svelte");
  const vuePreviews = loadPreviewNames(VUE_PREVIEWS, ".vue");

  const stats = {
    svelteUpdated: 0,
    svelteCreated: 0,
    svelteSkipped: 0,
    vueUpdated: 0,
    vueCreated: 0,
    vueSkipped: 0,
    missingPreviews: [],
    warnings: [],
  };

  // ── Process Svelte ────────────────────────────────────────────────────────

  console.log("\n=== Processing Svelte docs ===\n");

  const svelteOriginals = fs
    .readdirSync(SVELTE_ORIGINALS)
    .filter((f) => f.endsWith(".md") && f !== "index.md");

  for (const originalFile of svelteOriginals) {
    const componentName = originalFile.replace(".md", "");
    const mdxPath = path.join(SVELTE_DOCS, `${componentName}.mdx`);
    const originalPath = path.join(SVELTE_ORIGINALS, originalFile);
    const originalText = fs.readFileSync(originalPath, "utf-8");

    // Extract content from original
    const extractedContent = extractSvelteContent(originalText);

    if (!extractedContent || extractedContent.length < 10) {
      console.log(`  SKIP (no content): ${componentName}`);
      stats.svelteSkipped++;
      continue;
    }

    let stubContent;
    if (fs.existsSync(mdxPath)) {
      // Read existing stub
      stubContent = fs.readFileSync(mdxPath, "utf-8").trimEnd();
    } else {
      // Create new stub
      const fm = parseFrontmatter(originalText);
      stubContent = generateStub(
        componentName,
        "svelte",
        fm.title || componentName,
        fm.description || ""
      ).trimEnd();
      console.log(`  CREATE: ${componentName}.mdx`);
      stats.svelteCreated++;
    }

    // Check if stub is already expanded (more than 45 lines = not a stub)
    const lineCount = stubContent.split("\n").length;
    if (lineCount > 45) {
      console.log(`  SKIP (already expanded, ${lineCount} lines): ${componentName}`);
      stats.svelteSkipped++;
      continue;
    }

    // Merge: append extracted content after stub
    const merged = stubContent + "\n\n" + extractedContent + "\n";

    // Validate preview names
    const previewMatches = merged.matchAll(/name="([^"]+)"/g);
    for (const m of previewMatches) {
      const name = m[1];
      // Skip component source names (they don't need preview files)
      if (merged.includes(`<ComponentSource framework="svelte" name="${name}"`))
        continue;
      if (!sveltePreviews.has(name)) {
        stats.missingPreviews.push(`svelte: ${componentName} -> ${name}`);
      }
    }

    fs.writeFileSync(mdxPath, merged);
    console.log(`  UPDATE: ${componentName}.mdx (${merged.split("\n").length} lines)`);
    stats.svelteUpdated++;
  }

  // ── Process Vue ───────────────────────────────────────────────────────────

  console.log("\n=== Processing Vue docs ===\n");

  const vueOriginals = fs
    .readdirSync(VUE_ORIGINALS)
    .filter((f) => f.endsWith(".md") && !f.startsWith("."));

  for (const originalFile of vueOriginals) {
    const componentName = originalFile.replace(".md", "");
    const mdxPath = path.join(VUE_DOCS, `${componentName}.mdx`);
    const originalPath = path.join(VUE_ORIGINALS, originalFile);
    const originalText = fs.readFileSync(originalPath, "utf-8");

    // Extract content from original
    const extractedContent = extractVueContent(originalText, vuePreviews);

    if (!extractedContent || extractedContent.length < 10) {
      console.log(`  SKIP (no content): ${componentName}`);
      stats.vueSkipped++;
      continue;
    }

    let stubContent;
    if (fs.existsSync(mdxPath)) {
      stubContent = fs.readFileSync(mdxPath, "utf-8").trimEnd();
    } else {
      const fm = parseFrontmatter(originalText);
      stubContent = generateStub(
        componentName,
        "vue",
        fm.title || componentName,
        fm.description || ""
      ).trimEnd();
      console.log(`  CREATE: ${componentName}.mdx`);
      stats.vueCreated++;
    }

    // Check if stub is already expanded
    const lineCount = stubContent.split("\n").length;
    if (lineCount > 45) {
      console.log(`  SKIP (already expanded, ${lineCount} lines): ${componentName}`);
      stats.vueSkipped++;
      continue;
    }

    const merged = stubContent + "\n\n" + extractedContent + "\n";

    // Validate preview names
    const previewMatches = merged.matchAll(/name="([^"]+)"/g);
    for (const m of previewMatches) {
      const name = m[1];
      if (merged.includes(`<ComponentSource framework="vue" name="${name}"`))
        continue;
      if (!vuePreviews.has(name)) {
        stats.missingPreviews.push(`vue: ${componentName} -> ${name}`);
      }
    }

    fs.writeFileSync(mdxPath, merged);
    console.log(`  UPDATE: ${componentName}.mdx (${merged.split("\n").length} lines)`);
    stats.vueUpdated++;
  }

  // ── Update meta.json ────────────────────────────────────────────────────

  console.log("\n=== Updating meta.json files ===\n");

  for (const [docsDir, label] of [
    [SVELTE_DOCS, "Svelte"],
    [VUE_DOCS, "Vue"],
  ]) {
    const metaPath = path.join(docsDir, "meta.json");
    const allMdx = fs
      .readdirSync(docsDir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(".mdx", ""))
      .sort();

    const meta = { title: label, pages: allMdx };
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
    console.log(`  ${label} meta.json: ${allMdx.length} pages`);
  }

  // ── Report ──────────────────────────────────────────────────────────────

  console.log("\n=== Summary ===\n");
  console.log(`Svelte: ${stats.svelteUpdated} updated, ${stats.svelteCreated} created, ${stats.svelteSkipped} skipped`);
  console.log(`Vue: ${stats.vueUpdated} updated, ${stats.vueCreated} created, ${stats.vueSkipped} skipped`);

  if (stats.missingPreviews.length > 0) {
    console.log(`\n=== Missing Previews (${stats.missingPreviews.length}) ===\n`);
    for (const p of stats.missingPreviews) {
      console.log(`  ${p}`);
    }
  }
}

main();
