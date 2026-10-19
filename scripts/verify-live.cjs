const { execSync } = require('child_process');

try {
  const html = execSync('curl.exe -sL https://www.betongangiabinh.vn/chon-cap-phoi-be-tong-thong-minh-hop-ly-tiet-kiem-an-gia-binh-ninh-binh.html', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  console.log('HTML length:', html.length);
  
  // Check if escaped raw div tags are printed as text in HTML
  const hasEscapedDiv = html.includes('&lt;div class=') || html.includes('&lt;p class=');
  console.log('Has escaped raw HTML code shown as text:', hasEscapedDiv);
  
  // Check if native CTA banner is present
  const hasHotline = html.includes('0988 2662 93');
  console.log('Has native CTA banner with hotline:', hasHotline);
  
  // Check if Cấp Phối table exists
  const hasTable = html.includes('Bảng thông số kỹ thuật') && html.includes('Xi măng PC40');
  console.log('Has clean Cấp Phối technical table:', hasTable);
  
  // Check if headings are separated
  const hasHeadings = html.includes('Tiêu chuẩn chọn Xi Măng') && html.includes('Cốt liệu Cát');
  console.log('Has properly separated headings and paragraphs:', hasHeadings);
} catch (err) {
  console.error('Error verifying live:', err);
}
