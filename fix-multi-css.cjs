const fs = require('fs');
const files = ['apps/v4/app/(app)/(styles)/sera/style.css', 'apps/v4/app/legacy-themes.css'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  const blockRegex = /((?:\.dark(?: &)?|@variant dark)\s*{)([^}]+)(})/g;
  
  content = content.replace(blockRegex, (match, start, blockContent, end) => {
    const mutedMatch = blockContent.match(/--muted:\s*(oklch\([^)]+\))/);
    if (mutedMatch) {
      const mutedColor = mutedMatch[1];
      blockContent = blockContent.replace(/--border:\s*oklch\(1 0 0 \/ 10\%\)/g, `--border: ${mutedColor}`);
      blockContent = blockContent.replace(/--input:\s*oklch\(1 0 0 \/ 15\%\)/g, `--input: ${mutedColor}`);
      blockContent = blockContent.replace(/--sidebar-border:\s*oklch\(1 0 0 \/ 10\%\)/g, `--sidebar-border: ${mutedColor}`);
    }
    return start + blockContent + end;
  });
  
  fs.writeFileSync(file, content);
  console.log(`Fixed multi-theme file ${file}`);
}
