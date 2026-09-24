const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}
const files = walk('src');
let issues = [];
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  const importRegex = /from\s+['\"](\.\.?\/[^'\"]+)['\"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    const dir = path.dirname(f);
    let resolved = path.join(dir, importPath);
    try {
      const parentDir = path.dirname(resolved);
      const dirContents = fs.readdirSync(parentDir);
      const baseName = path.basename(resolved);
      
      const exactMatch = dirContents.find(n => 
        n.toLowerCase() === baseName.toLowerCase() || 
        n.toLowerCase() === baseName.toLowerCase() + '.js' || 
        n.toLowerCase() === baseName.toLowerCase() + '.jsx' || 
        n.toLowerCase() === baseName.toLowerCase() + '.css'
      );
      
      if (exactMatch) {
        // Compare case insensitive exact match to actual file case
        const exactMatchNoExt = path.parse(exactMatch).name;
        if (baseName !== exactMatch && baseName !== exactMatchNoExt) {
           issues.push(f + ': ' + importPath + ' -> Actual file is ' + exactMatch);
        }
      }
    } catch(e) {}
  }
});
console.log(issues.length ? issues.join('\n') : 'No case issues found');
