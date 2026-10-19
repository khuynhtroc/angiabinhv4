const fs = require('fs');
const path = require('path');

const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/posts.json'), 'utf8'));

const brokenTablePosts = [];

posts.forEach((p) => {
  const c = p.content || '';
  if (!c.includes('| --- |')) return;

  const lines = c.split('\n');
  let inTable = false;
  let headerCols = 0;
  let headerLine = '';
  let rows = [];
  let isBroken = false;

  for (const l of lines) {
    if (l.trim().startsWith('|') && l.trim().endsWith('|')) {
      const cols = l.trim().split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1).length;
      if (!inTable) {
        inTable = true;
        headerCols = cols;
        headerLine = l;
        rows = [l];
      } else {
        rows.push(l);
        if (!l.includes('---') && cols !== headerCols) {
          isBroken = true;
        }
      }
    } else {
      if (inTable && isBroken) {
        brokenTablePosts.push({
          slug: p.slug,
          title: p.title,
          headerCols,
          headerLine,
          sampleRows: rows.slice(0, 6)
        });
        break;
      }
      inTable = false;
    }
  }
});

console.log('Total broken table posts:', brokenTablePosts.length);
brokenTablePosts.forEach((item, idx) => {
  console.log(`\n[${idx + 1}] Slug: ${item.slug}`);
  console.log('Header cols:', item.headerCols);
  console.log('Sample rows:\n' + item.sampleRows.join('\n'));
});
