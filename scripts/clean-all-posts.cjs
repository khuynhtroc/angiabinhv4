const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/posts.json');
const posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`Starting scan and repair of ${posts.length} posts...`);

let fixedCtaHtml = 0;
let fixedArtifacts = 0;
let fixedTables = 0;
let fixedSmushed = 0;

function cleanPostContent(rawContent, postTitle, postSlug) {
  if (!rawContent) return '';
  let text = rawContent;
  let modified = false;

  // 1. Remove raw HTML CTA blocks
  if (text.includes('<div class="my-8 p-6 bg-slate-900') || text.includes("<div class='my-8 p-6 bg-slate-900") || text.includes('<div class="flex items-center gap-2 text-amber-400')) {
    text = text.replace(/<div class=["']my-8 p-6 bg-slate-900[\s\S]*?<\/div>\s*<\/div>/gi, '');
    text = text.replace(/<div class=["']flex items-center gap-2 text-amber-400[\s\S]*?<\/div>\s*<\/div>/gi, '');
    fixedCtaHtml++;
    modified = true;
  }

  // Also clean any standalone raw div tags that leak
  if (text.includes('<div class=')) {
    text = text.replace(/<div class=["'][^"']*["']>[\s\S]*?<\/div>/gi, (m) => {
      if (m.includes('Hotline') || m.includes('Trạm Trộn') || m.includes('Cần Tư Vấn') || m.includes('An Gia Bình')) {
        modified = true;
        return '';
      }
      return m;
    });
  }

  // 2. Remove crawl artifacts like -24SO, &nbsp;, broken entities
  if (text.includes('-24SO') || text.includes('&nbsp;') || text.includes('&amp;')) {
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/\s*-\s*24SO/g, ' ($SO_4^{2-}$)');
    text = text.replace(/-24SO/g, ' ($SO_4^{2-}$)');
    fixedArtifacts++;
    modified = true;
  }

  // 3. Specific Cấp Phối Post Cleanups (applies to all variant slugs of chon-cap-phoi)
  if (postSlug && postSlug.includes('chon-cap-phoi')) {
    text = text.replace(/cấp phối bê tông – sản xuấtHiện nay/gi, 'cấp phối bê tông cốt thép.\n\n### Kinh nghiệm kiểm soát tỷ lệ cấp phối khi thi công\n\nHiện nay');
    text = text.replace(/Về nguyên liệu\s*:\s*Xi măng\s*\.Xi măng là/gi, 'Về nguyên liệu:\n\n### 1. Tiêu chuẩn chọn Xi Măng\n\nXi măng là');
    text = text.replace(/### 1\. Tiêu chuẩn chọn Xi Măng:\s*/gi, '### 1. Tiêu chuẩn chọn Xi Măng\n\n');
    text = text.replace(/chịu lực của bê tông\.Để chế tạo/gi, 'chịu lực của bê tông.\n\nĐể chế tạo');
    text = text.replace(/đảm bảo kinh tế\.Nếu dùng/gi, 'đảm bảo kinh tế.\n\nNếu dùng');
    text = text.replace(/xấu cho bê tông\.Vì vậy cần/gi, 'xấu cho bê tông.\n\nVì vậy cần');
    text = text.replace(/thích hợp\| Mác bê tông/gi, 'thích hợp:\n\n| Mác bê tông');
    text = text.replace(/\|\s*600\s*\|\s*Cát:/gi, '| 600 |\n\n### 2. Tiêu chuẩn Cát xây dựng\n\nCát:');
    text = text.replace(/\|\s*600\s*\|Cát:/gi, '| 600 |\n\n### 2. Tiêu chuẩn Cát xây dựng\n\nCát:');
    text = text.replace(/### 2\. Tiêu chuẩn Cát xây dựng:\s*/gi, '### 2. Tiêu chuẩn Cát xây dựng\n\n');
    text = text.replace(/nhỏ\.Đá\s*,\s*sỏi\s*:\s*Đá,\s*sỏi\s*là/gi, 'nhỏ.\n\n### 3. Cốt liệu Đá, Sỏi chịu lực\n\nĐá, sỏi là');
    text = text.replace(/### 3\. Cốt liệu Đá, Sỏi chịu lực:\s*/gi, '### 3. Cốt liệu Đá, Sỏi chịu lực\n\n');
    text = text.replace(/dùng đá dăm\.Nướclà/gi, 'dùng đá dăm.\n\n### 4. Tiêu chuẩn Nước trộn bê tông\n\nNước là');
    text = text.replace(/dùng đá dăm\.Nước là/gi, 'dùng đá dăm.\n\n### 4. Tiêu chuẩn Nước trộn bê tông\n\nNước là');
    text = text.replace(/### 4\. Tiêu chuẩn Nước trộn bê tông:\s*/gi, '### 4. Tiêu chuẩn Nước trộn bê tông\n\n');
    text = text.replace(/nước giếng\.Các loại nước/gi, 'nước giếng.\n\nCác loại nước');
    text = text.replace(/vòng là được\.Công việc/gi, 'vòng là được.\n\nCông việc');
    text = text.replace(/thường gặp\s*\)\s*Xác định cấp phối/gi, 'thường gặp):\n\n### Xác định cấp phối bê tông thực tế\n\nXác định cấp phối');
    text = text.replace(/### Xác định cấp phối bê tông thực tế:\s*/gi, '### Xác định cấp phối bê tông thực tế\n\n');
    text = text.replace(/\+\s*Đá dmax\s*=\s*20\s*mm/gi, '\n\n**Quy cách cốt liệu đá:**\n- Đá dmax = 20 mm');
    text = text.replace(/Am hiểu những kiến th[uú]c/gi, '\n\n---\n\nAm hiểu những kiến thức');
    modified = true;
  }

  // 4. Fix broken Cấp phối tables (Mác 200, 250 with mismatched 5-col header vs 8-col row)
  const brokenCapPhoiPattern = /\|\s*Thành phần vật liệu\s*\|\s*Đơn vị\s*\|\s*Mác bê tông\s*\|\s*Khối lượng\/1 bao xi măng 50kg\s*\|\s*Khối lượng tính theo thùng đổ 18 lít\s*\|[\s\S]*?\|\s*Phụ gia\s*\|[^\n]*/g;
  if (brokenCapPhoiPattern.test(text)) {
    text = text.replace(brokenCapPhoiPattern, (match) => {
      fixedTables++;
      modified = true;
      const isTable2 = match.includes('290') && match.includes('341');
      if (isTable2) {
        return `| Thành phần vật liệu | Đơn vị | Mác 200 (kg/m³) | Mác 250 (kg/m³) | Định mức/1 bao 50kg (Mác 200) | Định mức/1 bao 50kg (Mác 250) | Thùng 18L (Mác 200) | Thùng 18L (Mác 250) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Xi măng PC40** | kg | 290 | 341 | 50.00 kg | 50.00 kg | 1 bao | 1 bao |
| **Cát vàng** | m³ | 0.470 | 0.441 | 0.08 m³ | 0.07 m³ | 5 thùng | 4 thùng |
| **Đá dăm 1x2** | m³ | 0.850 | 0.838 | 0.15 m³ | 0.13 m³ | 8 thùng | 7 thùng |
| **Nước sạch** | lít | 185 | 185 | 31.90 lít | 27.10 lít | Vừa đủ | Vừa đủ |
| **Phụ gia siêu dẻo** | % | Theo thiết kế | Theo thiết kế | Theo mẻ trộn | Theo mẻ trộn | Theo mẻ trộn | Theo mẻ trộn |`;
      } else {
        return `| Thành phần vật liệu | Đơn vị | Mác 200 (kg/m³) | Mác 250 (kg/m³) | Định mức/1 bao 50kg (Mác 200) | Định mức/1 bao 50kg (Mác 250) | Thùng 18L (Mác 200) | Thùng 18L (Mác 250) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Xi măng PC40** | kg | 281 | 327 | 50.00 kg | 50.00 kg | 1 bao | 1 bao |
| **Cát vàng** | m³ | 0.493 | 0.475 | 0.09 m³ | 0.07 m³ | 5 thùng | 4 thùng |
| **Đá dăm 1x2** | m³ | 0.891 | 0.881 | 0.16 m³ | 0.13 m³ | 9 thùng | 7 thùng |
| **Nước sạch** | lít | 185 | 185 | 32.92 lít | 28.29 lít | Vừa đủ | Vừa đủ |
| **Phụ gia siêu dẻo** | % | Theo thiết kế | Theo thiết kế | Theo mẻ trộn | Theo mẻ trộn | Theo mẻ trộn | Theo mẻ trộn |`;
      }
    });
  }

  // 5. Fix 2-row header tables (Cát thường / Cát vàng)
  if (text.includes('Cát Thường') && text.includes('Cát Vàng') && text.includes('Mác bê tông')) {
    const tablePattern = /\|\s*\**Mác bê tông\**\s*\|\s*\**Tiêu chuẩn\**\s*\|\s*\**Độ sụt\s*\(cm\)\**\s*\|\s*\**Sai số\s*\(cm\)\**\s*\|\s*\**ĐVT\**\s*\|\s*\**Đơn Giá[^|]*\**\s*\|\s*\|\r?\n\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\r?\n\|\s*\**Cát Thường\**\s*\|\s*\**Cát Vàng\**\s*\|/gi;
    if (tablePattern.test(text)) {
      text = text.replace(
        tablePattern,
        `| Mác bê tông | Tiêu chuẩn | Độ sụt (cm) | Sai số (cm) | ĐVT | Giá Cát Thường (đ/m³) | Giá Cát Vàng (đ/m³) |\n| --- | --- | --- | --- | --- | --- | --- |`
      );
      fixedTables++;
      modified = true;
    }

    const tablePattern2 = /\|\s*Mác bê tông\s*\|\s*Tiêu chuẩn\s*\|\s*Độ sụt\s*\(cm\)\s*\|\s*Sai số\s*\(cm\)\s*\|\s*ĐVT\s*\|\s*Đơn Giá[^\n|]*\|\r?\n\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\r?\n\|\s*Cát Thường\s*\|\s*Cát Vàng\s*\|/gi;
    if (tablePattern2.test(text)) {
      text = text.replace(
        tablePattern2,
        `| Mác bê tông | Tiêu chuẩn | Độ sụt (cm) | Sai số (cm) | ĐVT | Giá Cát Thường (đ/m³) | Giá Cát Vàng (đ/m³) |\n| --- | --- | --- | --- | --- | --- | --- |`
      );
      fixedTables++;
      modified = true;
    }
  }

  // Clean empty row "| Phụ gia | | | | | | | |"
  text = text.replace(/\|\s*Phụ gia\s*\|\s*\|\s*\|\s*\|\s*\|\s*\|\s*\|\s*\|\r?\n/g, '');

  // 6. Generic smushed sentences and headings across all posts
  const knownHeadings = [
    'Phương pháp trộn bê tông',
    'Phương pháp thiết kế cấp phối bê tông',
    'Cấp phối bê tông theo nhà sản xuất',
    'Thành phần cấp phối theo nhà sản xuất',
    'Lưu ý quan trọng khi trộn bê tông',
    'Quy trình bảo dưỡng bê tông',
    'Tiêu chuẩn nén mẫu bê tông',
    'Kinh nghiệm đổ bê tông',
    'Bảng báo giá bê tông tươi',
    'Bảng tra cấp phối bê tông'
  ];

  for (const h of knownHeadings) {
    if (text.includes(h)) {
      const reg = new RegExp(`([^\\n#])(?:\\.\\s*|\\s+)(${h})(?:\\.|\\s*:\\s*|\\s*\\([\\s\\S]*?\\)\\s*)([A-ZÀ-ỸÁ-Ỵ])`, 'g');
      if (reg.test(text)) {
        text = text.replace(reg, '$1\n\n## $2\n\n$3');
        modified = true;
      }
    }
  }

  // Fix period followed immediately by uppercase letter (supports 2-letter words like Bê, Đá)
  if (/([a-zà-ỹá-ỵ0-9]{1,})\.([A-ZÀ-ỸÁ-Ỵ][a-zà-ỹá-ỵ]{1,})/.test(text)) {
    text = text.replace(/([a-zà-ỹá-ỵ0-9]{1,})\.([A-ZÀ-ỸÁ-Ỵ][a-zà-ỹá-ỵ]{1,})/g, '$1. $2');
    fixedSmushed++;
    modified = true;
  }

  // Fix space before dot: " .Từ" -> ". Từ"
  if (/\s+\.([A-ZÀ-ỸÁ-Ỵ])/.test(text)) {
    text = text.replace(/\s+\.([A-ZÀ-ỸÁ-Ỵ])/g, '. $1');
    modified = true;
  }

  // Fix missing space after colon: ":Từ" -> ": Từ", ":Bê" -> ": Bê"
  if (/:\s*([A-ZÀ-ỸÁ-Ỵ][a-zà-ỹá-ỵ])/.test(text)) {
    text = text.replace(/:\s*([A-ZÀ-ỸÁ-Ỵ][a-zà-ỹá-ỵ])/g, ': $1');
    modified = true;
  }

  // 7. Fix overly long pseudo-headings that are actually paragraphs (length > 120 chars with period)
  const lines = text.split('\n');
  let lineFixed = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (/^#{1,3}\s+/.test(l)) {
      const headingBody = l.replace(/^#{1,3}\s+/, '').trim();
      if (headingBody.length > 120 && headingBody.includes('. ')) {
        lines[i] = headingBody;
        lineFixed = true;
      }
    }
  }
  if (lineFixed) {
    text = lines.join('\n');
    modified = true;
  }

  // 8. Typography and punctuation spacing cleanup
  if (text.includes(' , ') || text.includes('( ') || text.includes(' )') || text.includes('bộ phân kết cấu')) {
    text = text.replace(/\s+,\s*/g, ', ');
    text = text.replace(/\(\s+/g, '(');
    text = text.replace(/\s+\)/g, ')');
    text = text.replace(/bộ phân kết cấu/g, 'bộ phận kết cấu');
    modified = true;
  }

  // Clean consecutive newlines
  text = text.replace(/\n{4,}/g, '\n\n');

  return { text: text.trim(), modified };
}

let totalModified = 0;
const updatedPosts = posts.map((p) => {
  const res = cleanPostContent(p.content, p.title, p.slug);
  if (res.modified) {
    totalModified++;
    return { ...p, content: res.text };
  }
  return p;
});

console.log(`\nScan Complete!`);
console.log(`- Fixed raw HTML CTA in: ${fixedCtaHtml} posts`);
console.log(`- Fixed crawler artifacts in: ${fixedArtifacts} posts`);
console.log(`- Fixed broken tables in: ${fixedTables} occurrences`);
console.log(`- Fixed smushed sentences in: ${fixedSmushed} posts`);
console.log(`- Total posts updated: ${totalModified} / ${posts.length}`);

// Write back to public/data/posts.json
fs.writeFileSync(filePath, JSON.stringify(updatedPosts, null, 2), 'utf8');
console.log(`Successfully updated public/data/posts.json!`);
