---
"shadcn": major
---

added `--preset` flag to `init` command

## Breaking changes

- The `--src-dir` and `--no-src-dir` flags have been removed. Use create-next-app then run shadcn init.
- The `--no-base-style` flag has been removed. Use `extends: none` in your registry items.
- The `--css-variables` and `--no-css-variables` flags have been removed from the `add` command.
