const fs = require('fs');
const path = require('path');

const themesFile = 'apps/v4/registry/themes.ts';
let content = fs.readFileSync(themesFile, 'utf8');

// The structural tokens in dark mode usually follow this pattern
// We can parse the file or do a regex replacement per theme
// Wait, doing it with AST is safer or just a smart string replace?
// Let's do a smart string replace by splitting by theme
const themes = content.split('  {\n    name: "');
for (let i = 1; i < themes.length; i++) {
  const parts = themes[i].split('dark: {\n');
  if (parts.length > 1) {
    let darkSection = parts[1];
    // extract muted color from dark section
    const mutedMatch = darkSection.match(/muted:\s*"(oklch\([^)]+\))"/);
    if (mutedMatch) {
      const mutedColor = mutedMatch[1];
      // replace border, input, sidebar-border with mutedColor
      darkSection = darkSection.replace(/border:\s*"oklch\(1 0 0 \/ 10\%\)"/g, `border: "${mutedColor}"`);
      darkSection = darkSection.replace(/input:\s*"oklch\(1 0 0 \/ 15\%\)"/g, `input: "${mutedColor}"`);
      darkSection = darkSection.replace(/"sidebar-border":\s*"oklch\(1 0 0 \/ 10\%\)"/g, `"sidebar-border": "${mutedColor}"`);
      
      parts[1] = darkSection;
      themes[i] = parts.join('dark: {\n');
    }
  }
}
fs.writeFileSync(themesFile, themes.join('  {\n    name: "'));
