---
"@shadcn/registry": patch
"shadcn": patch
---

Leave the Next.js layout untouched and warn, instead of writing an invalid layout or failing the install, when adding font items would introduce a syntax error or the layout cannot be parsed. The layout font editor no longer uses ts-morph.
