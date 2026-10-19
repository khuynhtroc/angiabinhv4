const fs = require('fs');
const path = require('path');

function cleanPostContent(rawContent, postTitle) {
  if (!rawContent) return '';
  let text = rawContent;

  // 1. Remove raw HTML CTA block if present
  text = text.replace(/<div class=["']my-8 p-6 bg-slate-900[\s\S]*?<\/div>\s*<\/div>/gi, '');
  text = text.replace(/<div class=["'][^"']*["']>[\s\S]*?<\/div>/gi, (match) => {
    // If it contains hotline or CTA info, remove it since we render native CTA
    if (match.includes('Hotline') || match.includes('Trạm Trộn') || match.includes('Cần Tư Vấn')) {
      return '';
    }
    return match;
  });

  // 2. Remove crawl artifacts like -24SO, &nbsp;, broken entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/\s*-\s*24SO/g, ' ($SO_4^{2-}$)');
  text = text.replace(/-24SO/g, ' ($SO_4^{2-}$)');

  // 3. Fix smushed headings in text
  // e.g. "Phương pháp trộn bê tông.Hiện nay" -> "\n\n## Phương pháp trộn bê tông\n\nHiện nay"
  const knownHeadingPhrases = [
    'Phương pháp trộn bê tông',
    'Phương pháp thiết kế cấp phối bê tông',
    'Cấp phối bê tông theo nhà sản xuất',
    'Thành phần cấp phối theo nhà sản xuất',
    'Lưu ý quan trọng khi trộn bê tông',
    'Quy trình bảo dưỡng bê tông',
    'Tiêu chuẩn nén mẫu bê tông',
    'Kinh nghiệm đổ bê tông',
    'Ưu điểm và nhược điểm',
    'Bảng báo giá bê tông tươi',
    'Bảng tra cấp phối bê tông'
  ];

  for (const phrase of knownHeadingPhrases) {
    const reg = new RegExp(`([^\\n#])(?:\\.\\s*|\\s+)(${phrase})(?:\\.|\\s*:\\s*|\\s*\\([\\s\\S]*?\\)\\s*)([A-ZÀ-ỸÁ-Ỵ])`, 'g');
    text = text.replace(reg, '$1\n\n## $2\n\n$3');
  }

  // 4. Fix specific smushed section titles in cấp phối article
  text = text.replace(/cấp phối bê tông – sản xuấtHiện nay/gi, 'cấp phối bê tông cốt thép.\n\n### Kinh nghiệm kiểm soát tỷ lệ cấp phối khi thi công\n\nHiện nay');
  text = text.replace(/Về nguyên liệu\s*:\s*Xi măng\s*\.Xi măng là/gi, 'Về nguyên liệu:\n\n### 1. Tiêu chuẩn chọn Xi Măng:\nXi măng là');
  text = text.replace(/chịu lực của bê tông\.Để chế tạo/gi, 'chịu lực của bê tông.\n\nĐể chế tạo');
  text = text.replace(/đảm bảo kinh tế\.Nếu dùng/gi, 'đảm bảo kinh tế.\n\nNếu dùng');
  text = text.replace(/xấu cho bê tông\.Vì vậy cần/gi, 'xấu cho bê tông.\n\nVì vậy cần');
  text = text.replace(/thích hợp\| Mác bê tông/gi, 'thích hợp:\n\n| Mác bê tông');
  text = text.replace(/\|\s*600\s*\|\s*Cát:/gi, '| 600 |\n\n### 2. Tiêu chuẩn Cát xây dựng:\nCát:');
  text = text.replace(/\|\s*600\s*\|Cát:/gi, '| 600 |\n\n### 2. Tiêu chuẩn Cát xây dựng:\nCát:');
  text = text.replace(/nhỏ\.Đá\s*,\s*sỏi\s*:\s*Đá,\s*sỏi\s*là/gi, 'nhỏ.\n\n### 3. Cốt liệu Đá, Sỏi chịu lực:\nĐá, sỏi là');
  text = text.replace(/dùng đá dăm\.Nướclà/gi, 'dùng đá dăm.\n\n### 4. Tiêu chuẩn Nước trộn bê tông:\nNước là');
  text = text.replace(/dùng đá dăm\.Nước là/gi, 'dùng đá dăm.\n\n### 4. Tiêu chuẩn Nước trộn bê tông:\nNước là');
  text = text.replace(/nước giếng\.Các loại nước/gi, 'nước giếng.\n\nCác loại nước');
  text = text.replace(/vòng là được\.Công việc/gi, 'vòng là được.\n\nCông việc');
  text = text.replace(/thường gặp\s*\)\s*Xác định cấp phối/gi, 'thường gặp):\n\n### Xác định cấp phối bê tông thực tế:\nXác định cấp phối');
  text = text.replace(/\+\s*Đá dmax\s*=\s*20\s*mm/gi, '\n\n**Quy cách cốt liệu đá:**\n- Đá dmax = 20 mm');
  text = text.replace(/Am hiểu những kiến th[uú]c/gi, '\n\n---\n\nAm hiểu những kiến thức');

  // 5. Fix generic smushed sentences where dot is directly followed by uppercase letter without space
  // E.g. "bê tông.Bê tông là một" -> "bê tông. Bê tông là một"
  // E.g. "kết cấu .Từ các nguyên liệu" -> "kết cấu. Từ các nguyên liệu"
  text = text.replace(/\s+\.([A-ZÀ-ỸÁ-Ỵ])/g, '. $1');
  text = text.replace(/([a-zà-ỹá-ỵ0-9]{2,})\.([A-ZÀ-ỸÁ-Ỵ][a-zà-ỹá-ỵ]{2,})/g, '$1. $2');

  // Fix missing space after colon when followed directly by capital letter
  text = text.replace(/:\s*([A-ZÀ-ỸÁ-Ỵ][a-zà-ỹá-ỵ])/g, ': $1');

  // 6. Fix broken Cấp phối tables (Mác 200, 250)
  // Check if text has the 5-col header with 8-col row
  const brokenCapPhoiPattern = /\|\s*Thành phần vật liệu\s*\|\s*Đơn vị\s*\|\s*Mác bê tông\s*\|\s*Khối lượng\/1 bao xi măng 50kg\s*\|\s*Khối lượng tính theo thùng đổ 18 lít\s*\|[\s\S]*?\|\s*Phụ gia\s*\|[^\n]*/g;
  
  text = text.replace(brokenCapPhoiPattern, (match) => {
    // Check if it's table 1 (Xi măng 281 / 327) or table 2 (Xi măng 290 / 341)
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

  // 7. Fix 2-row header tables (Cát thường / Cát vàng)
  // e.g. | Mác bê tông | Tiêu chuẩn | Độ sụt (cm) | Sai số (cm) | ĐVT | Đơn Giá(đ/m3) | |
  // followed by | Cát Thường | Cát Vàng |
  text = text.replace(
    /\|\s*\**Mác bê tông\**\s*\|\s*\**Tiêu chuẩn\**\s*\|\s*\**Độ sụt\s*\(cm\)\**\s*\|\s*\**Sai số\s*\(cm\)\**\s*\|\s*\**ĐVT\**\s*\|\s*\**Đơn Giá[^|]*\**\s*\|\s*\|\r?\n\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\r?\n\|\s*\**Cát Thường\**\s*\|\s*\**Cát Vàng\**\s*\|/gi,
    `| Mác bê tông | Tiêu chuẩn | Độ sụt (cm) | Sai số (cm) | ĐVT | Giá Cát Thường (đ/m³) | Giá Cát Vàng (đ/m³) |\n| --- | --- | --- | --- | --- | --- | --- |`
  );

  text = text.replace(
    /\|\s*Mác bê tông\s*\|\s*Tiêu chuẩn\s*\|\s*Độ sụt\s*\(cm\)\s*\|\s*Sai số\s*\(cm\)\s*\|\s*ĐVT\s*\|\s*Đơn Giá[^\n|]*\|\r?\n\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\r?\n\|\s*Cát Thường\s*\|\s*Cát Vàng\s*\|/gi,
    `| Mác bê tông | Tiêu chuẩn | Độ sụt (cm) | Sai số (cm) | ĐVT | Giá Cát Thường (đ/m³) | Giá Cát Vàng (đ/m³) |\n| --- | --- | --- | --- | --- | --- | --- |`
  );

  // 8. Fix empty table rows like "| Phụ gia | | | | | | | |"
  text = text.replace(/\|\s*Phụ gia\s*\|\s*\|\s*\|\s*\|\s*\|\s*\|\s*\|\s*\|/g, '');

  // 9. Standardize consecutive newlines (no more than 2 consecutive newlines)
  text = text.replace(/\n{4,}/g, '\n\n');

  return text.trim();
}

// Test on sample post
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/posts.json'), 'utf8'));
const target = posts.find(p => p.slug === 'chon-cap-phoi-be-tong-thong-minh-hop-ly-tiet-kiem-an-gia-binh-ninh-binh');

console.log('--- ORIGINAL SNIPPET ---');
console.log(target.content.substring(target.content.indexOf('Cát:'), target.content.indexOf('Am hiểu')));

const cleaned = cleanPostContent(target.content, target.title);

console.log('\n--- CLEANED SNIPPET ---');
console.log(cleaned.substring(cleaned.indexOf('Cát:'), cleaned.indexOf('Am hiểu')));

console.log('\n--- CLEANED TABLES ---');
const tableIdx = cleaned.indexOf('| Thành phần vật liệu');
if (tableIdx !== -1) {
  console.log(cleaned.substring(tableIdx, tableIdx + 700));
}

console.log('\n--- RAW HTML REMAINING? ---');
console.log('Has <div class="my-8:', cleaned.includes('<div class="my-8'));
console.log('Has -24SO:', cleaned.includes('-24SO'));
