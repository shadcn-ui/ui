#!/usr/bin/env node

/**
 * Copy missing preview files from original repos and adapt imports.
 */

import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PREVIEW_SVELTE = path.join(ROOT, "apps/v4/preview-server/src/svelte");
const PREVIEW_VUE = path.join(ROOT, "apps/v4/preview-server/src/vue");

const SVELTE_BLOCKS = "/tmp/shadcn-svelte/docs/src/lib/registry/blocks";
const VUE_DEMOS = "/tmp/shadcn-vue/apps/v4/components/demo";

function adaptSvelteImports(content) {
  return content
    .replace(/\$lib\/registry\/ui\//g, "@/svelte-ui/");
}

function adaptVueImports(content) {
  return content.replace(/@\/registry\/new-york-v4\/ui\//g, "@/ui/");
}

// ── Svelte missing previews ────────────────────────────────────────────────

const svelteMissing = [
  "calendar-02",
  "calendar-13",
  "calendar-22",
  "calendar-24",
  "calendar-29",
  "demo-sidebar",
  "demo-sidebar-header",
  "demo-sidebar-footer",
  "demo-sidebar-group",
  "demo-sidebar-group-collapsible",
  "demo-sidebar-group-action",
  "demo-sidebar-menu",
  "demo-sidebar-menu-action",
  "demo-sidebar-menu-sub",
  "demo-sidebar-menu-collapsible",
  "demo-sidebar-menu-badge",
  "demo-sidebar-controlled",
];

console.log("=== Copying Svelte preview files ===\n");
for (const name of svelteMissing) {
  const src = path.join(SVELTE_BLOCKS, `${name}.svelte`);
  const dst = path.join(PREVIEW_SVELTE, `${name}.svelte`);

  if (!fs.existsSync(src)) {
    console.log(`  SKIP (not found): ${name}`);
    continue;
  }
  if (fs.existsSync(dst)) {
    console.log(`  SKIP (exists): ${name}`);
    continue;
  }

  const content = fs.readFileSync(src, "utf-8");
  const adapted = adaptSvelteImports(content);
  fs.writeFileSync(dst, adapted);
  console.log(`  COPY: ${name}.svelte`);
}

// ── Vue missing previews ───────────────────────────────────────────────────

const vueMissing = [
  { name: "sidebar-demo", src: "SidebarDemo.vue" },
  { name: "range-calendar-demo", src: "CalendarRangeDemo.vue" },
];

console.log("\n=== Copying Vue preview files ===\n");
for (const { name, src: srcFile } of vueMissing) {
  const src = path.join(VUE_DEMOS, srcFile);
  const dst = path.join(PREVIEW_VUE, `${name}.vue`);

  if (!fs.existsSync(src)) {
    console.log(`  SKIP (not found): ${name} (${srcFile})`);
    continue;
  }
  if (fs.existsSync(dst)) {
    console.log(`  SKIP (exists): ${name}`);
    continue;
  }

  const content = fs.readFileSync(src, "utf-8");
  const adapted = adaptVueImports(content);
  fs.writeFileSync(dst, adapted);
  console.log(`  COPY: ${name}.vue`);
}

// ── Create simple toast-demo.vue since it doesn't exist in source ──────────

const toastDst = path.join(PREVIEW_VUE, "toast-demo.vue");
if (!fs.existsSync(toastDst)) {
  // Check if sonner-demo exists as reference
  const sonnerRef = path.join(PREVIEW_VUE, "sonner-demo.vue");
  if (fs.existsSync(sonnerRef)) {
    // toast-demo is typically same as sonner-demo in shadcn-vue
    fs.copyFileSync(sonnerRef, toastDst);
    console.log("  CREATE: toast-demo.vue (copied from sonner-demo.vue)");
  } else {
    console.log("  SKIP: toast-demo.vue (no reference found)");
  }
}

console.log("\nDone.");
