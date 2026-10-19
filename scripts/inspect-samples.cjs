const fs = require('fs');
const path = require('path');

const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/posts.json'), 'utf8'));

console.log('=== SAMPLE BROKEN TABLES ===');
let tableSamples = 0;
for (const p of posts) {
  const c = p.content || '';
  if (c.includes('| --- |')) {
    const lines = c.split('\n');
    let inTable = false;
    let tableLines = [];
    let isBroken = false;
    let headerCols = 0;
    for (const l of lines) {
      if (l.trim().startsWith('|') && l.trim().endsWith('|')) {
        const cols = l.trim().split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1).length;
        if (!inTable) {
          inTable = true;
          headerCols = cols;
          tableLines = [l];
        } else {
          tableLines.push(l);
          if (!l.includes('---') && cols !== headerCols) {
            isBroken = true;
          }
        }
      } else {
        if (inTable && isBroken) {
          console.log(`\nPost: ${p.slug} (${p.title})`);
          console.log(tableLines.slice(0, 10).join('\n'));
          tableSamples++;
          break;
        }
        inTable = false;
      }
    }
  }
  if (tableSamples >= 3) break;
}

console.log('\n=== SAMPLE SMUSHED PARAGRAPHS ===');
let textSamples = 0;
for (const p of posts) {
  const c = p.content || '';
  const matches = c.match(/(?:[a-zà-ỹá-ỵ0-9]{3,}\.[A-ZÀ-ỸÁ-Ỵ][a-zà-ỹá-ỵ]{2,}|:[A-ZÀ-ỸÁ-Ỵ]|(?:\. -|\.SO|\. -24SO))/g);
  if (matches && matches.length > 2) {
    console.log(`\nPost: ${p.slug}`);
    console.log('Matches:', matches.slice(0, 5));
    // Print snippet around first match
    const idx = c.indexOf(matches[0]);
    console.log('Snippet:', c.substring(Math.max(0, idx - 80), Math.min(c.length, idx + 120)));
    textSamples++;
  }
  if (textSamples >= 3) break;
}
