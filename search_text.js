import fs from 'fs';
import path from 'path';

const searchDir = './src';
const query = 'How This Evolves';

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.html')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walkDir(searchDir);
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes(query)) {
    console.log(`Found match in: ${file}`);
    // Print matching lines
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes(query)) {
        console.log(`  Line ${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
