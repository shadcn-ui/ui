const fs = require('fs');
const path = require('path');

const baseDirs = [
  './frontend/app',
  './frontend/pages',
  './frontend/components',
  './frontend/services'
];

const apiRegex = /fetch\(\s*['"`]\/([^'"`]+)['"`]\s*\)/g;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const matches = [...content.matchAll(apiRegex)];

  if (matches.length === 0) return;

  const newContent = content.replace(apiRegex, (match, endpoint) => {
    return `fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/${endpoint}\`)`;
  });

  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`✅ Исправлено: ${filePath}`);
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

for (const dir of baseDirs) {
  walk(dir);
}
