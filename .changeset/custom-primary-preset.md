---
"@shadcn/registry": minor
"shadcn": minor
---

Add a custom primary color to preset codes. A preset with a custom primary uses a new `c` version that stores the hex next to the other fields, so `shadcn init --preset` and `shadcn apply --preset` install the same `--primary` and `--primary-foreground` that `/create` shows. Presets without a custom primary still produce the same `b` codes. `shadcn preset decode` and `shadcn info` show the custom primary. Older versions of the CLI reject `c` codes, so update to the latest version to use them. `shadcn/preset` exports `hexToOklch`, `oklchToHex` and `getPrimaryForeground`.
