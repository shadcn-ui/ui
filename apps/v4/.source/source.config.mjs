// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
var source_config_default = defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      theme: "github-dark"
    }
  }
});
var docs = defineDocs({
  dir: "docs"
});
export {
  source_config_default as default,
  docs
};
