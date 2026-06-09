import fs from 'fs';

const content = fs.readFileSync('src/components/dashboard/executive/ExecutiveOverview.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('revActual') || line.includes('revenueTrendData')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
