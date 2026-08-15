const fs = require('fs');
const files = [
  'apps/v4/public/r/colors/zinc.json',
  'apps/v4/public/r/colors/neutral.json',
  'apps/v4/public/r/colors/stone.json',
  'apps/v4/public/r/colors/gray.json',
  'apps/v4/public/r/colors/slate.json',
  'apps/v4/public/r/colors/olive.json',
  'apps/v4/public/r/colors/taupe.json',
  'apps/v4/public/r/colors/mauve.json',
  'apps/v4/public/r/colors/mist.json'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  let data = JSON.parse(content);
  
  // Extract muted color from dark object
  const darkCssVars = data.cssVars.dark;
  if (!darkCssVars) continue;
  
  const mutedColor = darkCssVars.muted;
  if (mutedColor) {
    darkCssVars.border = mutedColor;
    darkCssVars.input = mutedColor;
    if (darkCssVars['sidebar-border']) {
      darkCssVars['sidebar-border'] = mutedColor;
    }
    
    // Now replace inside cssVarsTemplate
    if (data.cssVarsTemplate) {
      // Find the .dark block in the string
      // Just replacing border: oklch(1 0 0 / 10%) inside the dark block is tricky because we might match light block.
      // But light block doesn't use oklch(1 0 0 / 10%)!
      data.cssVarsTemplate = data.cssVarsTemplate.replace(/--border: oklch\(1 0 0 \/ 10%\);/g, `--border: ${mutedColor};`);
      data.cssVarsTemplate = data.cssVarsTemplate.replace(/--input: oklch\(1 0 0 \/ 15%\);/g, `--input: ${mutedColor};`);
    }
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Updated JSON ${file} with ${mutedColor}`);
  }
}
