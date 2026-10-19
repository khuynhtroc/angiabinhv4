const fs = require('fs');
const path = require('path');

const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/posts.json'), 'utf8'));

let rawHtmlCtaCount = 0;
let rawHtmlDivCount = 0;
let brokenTableCount = 0;
let smushedParagraphCount = 0;
let crawlerArtifactsCount = 0;

posts.forEach((p, idx) => {
  const c = p.content || '';
  if (c.includes('<div class="my-8 p-6') || c.includes('<div class=')) {
    rawHtmlDivCount++;
  }
  if (c.includes('-24SO') || c.includes('SO-') || c.includes('&nbsp;')) {
    crawlerArtifactsCount++;
  }
  // Check smushed sentences where dot is followed immediately by uppercase letter without space or newline
  if (/\.([A-ZÀ-ỸÁ-Ỵ][a-zà-ỹá-ỵ]{2,})/.test(c)) {
    smushedParagraphCount++;
  }
  // Check broken tables (mismatched columns in rows)
  if (c.includes('| --- |')) {
    const lines = c.split('\n');
    let inTable = false;
    let headerCols = 0;
    for (const l of lines) {
      if (l.trim().startsWith('|') && l.trim().endsWith('|')) {
        const cols = l.trim().split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1).length;
        if (!inTable) {
          inTable = true;
          headerCols = cols;
        } else if (l.includes('---')) {
          // separator
        } else if (cols !== headerCols) {
          brokenTableCount++;
          break;
        }
      } else {
        inTable = false;
      }
    }
  }
});

console.log('Total posts:', posts.length);
console.log('Posts with raw HTML <div> tags:', rawHtmlDivCount);
console.log('Posts with crawler artifacts (&nbsp;, -24SO):', crawlerArtifactsCount);
console.log('Posts with smushed paragraphs (dot without space before capital letter):', smushedParagraphCount);
console.log('Posts with broken tables (mismatched column count):', brokenTableCount);
