const fs = require('fs');
const path = require('path');

function sanitizeBrands(text) {
  if (!text || typeof text !== 'string') return text;
  let s = text;

  // 1. External URLs to our official domain
  s = s.replace(/https?:\/\/(?:www\.)?dufago\.com(?:\.vn)?/gi, 'https://www.betongangiabinh.vn');
  s = s.replace(/dufago\.com(?:\.vn)?/gi, 'betongangiabinh.vn');
  s = s.replace(/https?:\/\/(?:www\.)?mekongthuongtin(?:\.com)?(?:\.vn)?/gi, 'https://www.betongangiabinh.vn');
  s = s.replace(/mekongthuongtin(?:\.com)?(?:\.vn)?/gi, 'betongangiabinh.vn');

  // 2. Dufago
  s = s.replace(/B[êe] [Tt]ông Dufago/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/b[êe] tông dufago/gi, 'bê tông An Gia Bình');
  s = s.replace(/Hệ [Tt]hống [Nn]hà [Mm]áy B[êe] [Tt]ông Dufago/gi, 'Hệ Thống Trạm Trộn Bê Tông An Gia Bình');
  s = s.replace(/Nhà [Mm]áy B[êe] [Tt]ông Dufago/gi, 'Trạm Trộn Bê Tông An Gia Bình');
  s = s.replace(/Văn hóa Dufago/gi, 'Văn hóa An Gia Bình');
  s = s.replace(/Tại Sao Chọn Dufago/gi, 'Tại Sao Chọn An Gia Bình');
  s = s.replace(/Chính sách nhân sự Dufago/gi, 'Chính sách nhân sự An Gia Bình');
  s = s.replace(/Dufago/g, 'An Gia Bình');
  s = s.replace(/dufago/g, 'an gia bình');
  s = s.replace(/DUFAGO/g, 'AN GIA BÌNH');

  // 3. Mê Kông / Mekong
  s = s.replace(/C[ôo]ng ty (?:TNHH )?b[êe] tông Mê Kông Thương Tín/gi, 'Công ty TNHH Bê Tông An Gia Bình');
  s = s.replace(/b[êe] tông m[êe] k[ôo]ng th[ưừ][ơờ]ng t[íi]n/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/m[êe] k[ôo]ng th[ưừ][ơờ]ng t[íi]n/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/mekong th[ưừ][ơờ]ng t[íi]n/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/c[ôo]ng ty tnhh b[êe] tông nsg m[êe] k[ôo]ng/gi, 'Công ty TNHH Bê Tông An Gia Bình');
  s = s.replace(/c[ôo]ng ty nsg-mekong/gi, 'Công ty Bê Tông An Gia Bình');
  s = s.replace(/nsg-mekong/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/b[êe] tông m[êe] k[ôo]ng xanh/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/m[êe] k[ôo]ng star/gi, 'An Gia Bình');
  s = s.replace(/mekong star/gi, 'An Gia Bình');
  s = s.replace(/m[êe] k[ôo]ng cc1/gi, 'An Gia Bình');
  s = s.replace(/mekong cc1/gi, 'An Gia Bình');
  s = s.replace(/b[êe] tông m[êe] k[ôo]ng/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/b[êe] tông mekong/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/M[êe] K[ôo]ng/g, 'An Gia Bình');
  s = s.replace(/m[êe] k[ôo]ng/g, 'an gia bình');
  s = s.replace(/Mekong/g, 'An Gia Bình');
  s = s.replace(/mekong/g, 'an gia bình');
  s = s.replace(/MÊ KÔNG/g, 'AN GIA BÌNH');
  s = s.replace(/MEKONG/g, 'AN GIA BÌNH');

  // 4. Công Thanh
  s = s.replace(/b[êe] tông t[ưư][ơờ]i c[ôo]ng thanh/gi, 'bê tông tươi An Gia Bình');
  s = s.replace(/b[êe] tông c[ôo]ng thanh/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/t[ậa]p [đd]o[àa]n c[ôo]ng thanh(?: group)?/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/c[ôo]ng thanh group/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/xi m[ăa]ng c[ôo]ng thanh/gi, 'xi măng tiêu chuẩn chất lượng cao');
  s = s.replace(/Công Thanh/g, 'An Gia Bình');
  s = s.replace(/công thanh/g, 'an gia bình');
  s = s.replace(/CÔNG THANH/g, 'AN GIA BÌNH');

  // 5. Thăng Long
  s = s.replace(/b[êe] tông t[ưư][ơờ]i c[ủu]a th[ăa]ng long/gi, 'bê tông tươi của An Gia Bình');
  s = s.replace(/b[êe] tông th[ăa]ng long/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/xi m[ăa]ng th[ăa]ng long(?: pc40)?/gi, 'xi măng mác cao đạt chuẩn TCVN');
  s = s.replace(/tr[ạa]m tr[ộo]n th[ăa]ng long/gi, 'trạm trộn An Gia Bình');
  s = s.replace(/th[ăa]ng long cung c[ấa]p/gi, 'An Gia Bình cung cấp');
  s = s.replace(/khuyến ngh[ịi] c[ủu]a th[ăa]ng long/gi, 'khuyến nghị của An Gia Bình');
  s = s.replace(/tiêu chu[ẩa]n c[ủu]a th[ăa]ng long/gi, 'tiêu chuẩn của An Gia Bình');
  s = s.replace(/ưu điểm nổi bật của thăng long/gi, 'ưu điểm nổi bật của An Gia Bình');
  s = s.replace(/danh sách bê tông tươi bắc.*?thăng long/gi, 'danh sách bê tông tươi Ninh Bình An Gia Bình');

  // 6. Việt Đức
  s = s.replace(/c[ôo]ng ty c[ổo] ph[ầa]n [đd][ầa]u t[ưư] th[ưư][ơờ]ng m[ạa]i x[âa]y d[ựu]ng vi[ệe]t [đd][ứu]c/gi, 'Công ty TNHH Bê Tông An Gia Bình');
  s = s.replace(/b[êe] tông th[ưư][ơờ]ng ph[ẩa]m vi[ệe]t [đd][ứu]c/gi, 'Bê tông thương phẩm An Gia Bình');
  s = s.replace(/b[êe] tông vi[ệe]t [đd][ứu]c/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/d[ựu] [áa]n vi[ệe]t [đd][ứu]c/gi, 'dự án An Gia Bình');
  s = s.replace(/Việt Đức/g, 'An Gia Bình');
  s = s.replace(/việt đức/g, 'An Gia Bình');
  s = s.replace(/VIỆT ĐỨC/g, 'AN GIA BÌNH');

  // 7. Việt Úc
  s = s.replace(/b[êe] tông vi[ệe]t [úu]c/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/Việt Úc/g, 'An Gia Bình');
  s = s.replace(/việt úc/g, 'An Gia Bình');

  // 8. Holcim / Insee / Fico / Sài Gòn RDC / Becamex / SCG
  s = s.replace(/b[êe] tông t[ưư][ơờ]i holcim/gi, 'bê tông tươi An Gia Bình');
  s = s.replace(/b[êe] tông holcim/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/Holcim/g, 'An Gia Bình');
  s = s.replace(/holcim/g, 'An Gia Bình');
  s = s.replace(/HOLCIM/g, 'AN GIA BÌNH');

  s = s.replace(/b[êe] tông t[ưư][ơờ]i insee/gi, 'bê tông tươi An Gia Bình');
  s = s.replace(/b[êe] tông insee/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/INSEE/g, 'An Gia Bình');
  s = s.replace(/Insee/g, 'An Gia Bình');
  s = s.replace(/insee/g, 'An Gia Bình');

  s = s.replace(/b[êe] tông fico/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/b[êe] tông tươi fico/gi, 'Bê tông tươi An Gia Bình');
  s = s.replace(/FiCO/g, 'An Gia Bình');
  s = s.replace(/Fico/g, 'An Gia Bình');

  s = s.replace(/b[êe] tông t[ưư][ơờ]i s[àa]i g[òo]n rdc/gi, 'bê tông tươi An Gia Bình');
  s = s.replace(/s[àa]i g[òo]n rdc/gi, 'An Gia Bình');
  s = s.replace(/sai gon rdc/gi, 'An Gia Bình');

  s = s.replace(/b[êe] tông becamex/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/Becamex/g, 'An Gia Bình');

  s = s.replace(/b[êe] tông scg/gi, 'Bê Tông An Gia Bình');
  s = s.replace(/b[êe] tông chinfon/gi, 'Bê Tông An Gia Bình');

  return s;
}

function processJsonFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  console.log(`Processing ${filePath}...`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);

  function recurse(obj) {
    if (typeof obj === 'string') {
      return sanitizeBrands(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(recurse);
    }
    if (obj && typeof obj === 'object') {
      const res = {};
      for (const k of Object.keys(obj)) {
        res[k] = recurse(obj[k]);
      }
      return res;
    }
    return obj;
  }

  const cleaned = recurse(data);
  fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf8');
  console.log(`Updated ${filePath}`);
}

function processCodeFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  console.log(`Processing code file ${filePath}...`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const sanitized = sanitizeBrands(raw);
  if (sanitized !== raw) {
    fs.writeFileSync(filePath, sanitized, 'utf8');
    console.log(`Updated code file ${filePath}`);
  }
}

// 1. Process data files
processJsonFile(path.join(process.cwd(), 'public/data/posts.json'));
processJsonFile(path.join(process.cwd(), 'public/data/projects.json'));
processJsonFile(path.join(process.cwd(), 'public/data/pages.json'));
processJsonFile(path.join(process.cwd(), 'public/data/config.json'));

// 2. Process initial-data.ts
processCodeFile(path.join(process.cwd(), 'lib/initial-data.ts'));

console.log('Sanitization complete!');
