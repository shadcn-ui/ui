const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync('grep -rl "oklch(1 0 0 / 10%)" .').toString().split('\n').filter(Boolean);

for (const file of files) {
  if (file.endsWith('.json') || file.includes('legacy-themes.css') || file.includes('sera/style.css')) continue;

  let content = fs.readFileSync(file, 'utf8');
  // find the muted color in .dark
  const darkMatch = content.match(/\.dark\s*{[^}]*--muted:\s*(oklch\([^)]+\))/);
  if (darkMatch) {
    const mutedColor = darkMatch[1];
    let newContent = content.replace(/--border:\s*oklch\(1 0 0 \/ 10\%\)/g, `--border: ${mutedColor}`);
    newContent = newContent.replace(/--input:\s*oklch\(1 0 0 \/ 15\%\)/g, `--input: ${mutedColor}`);
    newContent = newContent.replace(/--sidebar-border:\s*oklch\(1 0 0 \/ 10\%\)/g, `--sidebar-border: ${mutedColor}`);
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file} with ${mutedColor}`);
  }
}
