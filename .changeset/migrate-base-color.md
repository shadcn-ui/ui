---
"shadcn": minor
---

add `migrate base-color` to switch a project's base color. Rewrites the theme CSS variables in the file configured by `tailwind.css` and updates `baseColor` in components.json. Only tokens that still hold the source base color's value are replaced; customized tokens are left untouched and reported.
