import JSZip from 'jszip';
import { BlogPost, Project, JekyllConfig } from './types';

export function generateJekyllConfigYaml(config: JekyllConfig): string {
  return `# _config.yml - Bê Tông An Gia Bình Jekyll Configuration
title: "${config.title || 'Bê Tông An Gia Bình - Ninh Bình'}"
slogan: "${config.slogan || config.tagline || 'Chất lượng vững bền - Đồng hành mọi công trình'}"
tagline: "${config.tagline || config.slogan || 'Chất lượng vững bền - Đồng hành mọi công trình'}"
allow_search_engine: ${config.allow_search_engine !== undefined ? config.allow_search_engine : true}
google_verify: "${config.google_verify || ''}"
bing_verify: "${config.bing_verify || ''}"
google_analytics: "${config.google_analytics || 'G-6J50BRBSZS'}"
google_tag_manager_id: "${config.google_tag_manager_id || 'GTM-MXH8TM7H'}"
google_plus: "${config.google_plus || ''}"
subcriber_url: "${config.subcriber_url || ''}"
email: "${config.email || 'ketoan.angiabinh@gmail.com'}"
description: >-
  ${config.description || 'Trạm trộn bê tông tươi, bê tông thương phẩm công nghệ cao tại Ninh Bình.'}
baseurl: "${config.baseurl || ''}"
url: "${config.url || 'https://betongangiabinh.vn'}"
twitter_username: "${config.twitter_username || ''}"
github_username: "${config.github_username || ''}"
facebook_page: "${config.facebook_page || ''}"
logo: "${config.logo || '/logo.png'}"
favicon: "${config.favicon || '/favicon.ico'}"
${config.customHeadCode ? `custom_head_code: >-\n  ${config.customHeadCode.split('\n').join('\n  ')}\n` : ''}${config.customBodyOpenCode ? `custom_body_open_code: >-\n  ${config.customBodyOpenCode.split('\n').join('\n  ')}\n` : ''}${config.customFooterCode ? `custom_footer_code: >-\n  ${config.customFooterCode.split('\n').join('\n  ')}\n` : ''}${config.customCss ? `custom_css: >-\n  ${config.customCss.split('\n').join('\n  ')}\n` : ''}
# Build settings
markdown: ${config.markdown || 'kramdown'}
permalink: "${config.permalink || '/:title.html'}"
plugins:
${(config.plugins || ['jekyll-feed', 'jekyll-seo-tag', 'jekyll-sitemap']).map(p => `  - ${p}`).join('\n')}

# Exclude from processing
exclude:
  - .sass-cache/
  - .jekyll-cache/
  - gemfiles/
  - Gemfile
  - Gemfile.lock
  - node_modules/
  - vendor/bundle/
  - vendor/cache/
  - vendor/gems/
  - vendor/ruby/
`;
}

export function generatePostMarkdown(post: BlogPost): string {
  const categoriesStr = post.category ? `[${post.category}]` : '[]';
  const tagsStr = post.tags && post.tags.length > 0 ? `[${post.tags.join(', ')}]` : '[]';
  const dateFormatted = post.date ? `${post.date} 08:00:00 +0700` : '2025-05-01 08:00:00 +0700';

  const permalinkStr = post.permalink
    ? (post.permalink.startsWith('/') ? post.permalink : `/${post.permalink}`)
    : `/${post.id}.html`;

  return `---
layout: post
title: "${post.title.replace(/"/g, '\\"')}"
date: ${dateFormatted}
permalink: ${permalinkStr}
categories: ${categoriesStr}
tags: ${tagsStr}
author: "${post.author}"
image: "${post.coverImage}"
description: "${(post.seoDescription || post.excerpt).replace(/"/g, '\\"')}"
seo_title: "${(post.seoTitle || post.title).replace(/"/g, '\\"')}"
---

${post.content}
`;
}

export async function createJekyllZip(
  config: JekyllConfig,
  posts: BlogPost[],
  projects: Project[]
): Promise<Blob> {
  const zip = new JSZip();

  // 1. _config.yml
  zip.file('_config.yml', generateJekyllConfigYaml(config));

  // 2. Gemfile
  zip.file(
    'Gemfile',
    `source "https://rubygems.org"

gem "jekyll", "~> 4.3.3"
gem "webrick", "~> 1.8"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
end
`
  );

  // 3. _posts directory
  const postsFolder = zip.folder('_posts');
  if (postsFolder) {
    posts.forEach(post => {
      const datePrefix = post.date || '2025-05-01';
      const fileName = `${datePrefix}-${post.id}.md`;
      postsFolder.file(fileName, generatePostMarkdown(post));
    });
  }

  // 4. _layouts directory
  const layoutsFolder = zip.folder('_layouts');
  if (layoutsFolder) {
    layoutsFolder.file(
      'default.html',
      `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ page.title | default: site.title }} - Bê Tông An Gia Bình Ninh Bình</title>
  <meta name="description" content="{{ page.description | default: site.description }}">
  <link rel="canonical" href="{{ page.url | replace:'index.html','' | absolute_url }}">
  <!-- Fast Tailwind CDN for Static Jekyll Preview -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .prose h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.75rem; color: #0f172a; }
    .prose h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #1e293b; }
    .prose p { margin-bottom: 1rem; line-height: 1.75; color: #334155; }
    .prose ul, .prose ol { margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc; }
    .prose table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
    .prose th, .prose td { border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; }
    .prose th { background-color: #f1f5f9; }
  </style>
  {% if site.custom_css %}
  <style>{{ site.custom_css }}</style>
  {% endif %}
  {% if site.custom_head_code %}
  {{ site.custom_head_code }}
  {% endif %}
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
  {% if site.custom_body_open_code %}
  {{ site.custom_body_open_code }}
  {% endif %}
  {% include header.html %}

  <main class="flex-grow container mx-auto px-4 py-8 max-w-6xl">
    {{ content }}
  </main>

  {% include footer.html %}
  {% include mobile-bar.html %}
  {% if site.custom_footer_code %}
  {{ site.custom_footer_code }}
  {% endif %}
</body>
</html>`
    );

    layoutsFolder.file(
      'post.html',
      `---
layout: default
---
<article class="max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200">
  <header class="mb-8 border-b border-slate-100 pb-6">
    <div class="flex items-center gap-3 text-sm text-amber-600 font-medium mb-3">
      <span>{{ page.categories | join: ", " }}</span>
      <span>•</span>
      <time datetime="{{ page.date | date_to_xmlschema }}">{{ page.date | date: "%d/%m/%Y" }}</time>
    </div>
    <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug mb-4">
      {{ page.title }}
    </h1>
    <div class="flex items-center gap-3 text-sm text-slate-500">
      <span>Tác giả: <strong>{{ page.author | default: "Kỹ Sư An Gia Bình" }}</strong></span>
      <span>•</span>
      <span>Khu vực: <strong>Ninh Bình & Lân cận</strong></span>
    </div>
  </header>

  {% if page.image %}
  <div class="mb-8 rounded-xl overflow-hidden shadow-sm">
    <img src="{{ page.image }}" alt="{{ page.title }}" class="w-full h-80 object-cover">
  </div>
  {% endif %}

  <div class="prose max-w-none">
    {{ content }}
  </div>

  <footer class="mt-10 pt-6 border-t border-slate-200 bg-amber-50 p-6 rounded-xl border border-amber-200">
    <h4 class="font-bold text-slate-900 text-lg mb-2">Cần Báo Giá Bê Tông Tươi Ninh Bình?</h4>
    <p class="text-sm text-slate-700 mb-4">Trạm trộn Bê Tông An Gia Bình phục vụ 24/7. Xe bồn, xe bơm cần 37m-56m sẵn sàng xuất xưởng trong vòng 45 phút.</p>
    <div class="flex flex-wrap gap-3">
      <a href="tel:0988266293" class="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm inline-flex items-center gap-2">
        <i class="fa-solid fa-phone"></i> 0988 2662 93
      </a>
      <a href="{{ site.facebook_page }}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm inline-flex items-center gap-2">
        <i class="fa-brands fa-facebook"></i> Fanpage Bê Tông An Gia Bình
      </a>
    </div>
  </footer>
</article>`
    );
  }

  // 5. _includes directory
  const includesFolder = zip.folder('_includes');
  if (includesFolder) {
    includesFolder.file(
      'header.html',
      `<header class="bg-slate-900 text-white shadow-md sticky top-0 z-40 border-b border-slate-800">
  <div class="container mx-auto px-4 max-w-7xl h-20 flex items-center justify-between">
    <a href="{{ '/' | relative_url }}" class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-xl">AGB</div>
      <div>
        <div class="font-bold text-lg tracking-wide uppercase leading-tight text-white">Bê Tông An Gia Bình</div>
        <div class="text-xs text-amber-400 font-medium">Ninh Bình • 0988 2662 93</div>
      </div>
    </a>

    <!-- Primary Navigation with-arrows -->
    <nav class="primary-menu with-arrows hidden lg:flex items-center">
      <ul class="menu-container flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-200">
        <li class="menu-item px-3 py-2 hover:text-amber-400 transition"><a class="menu-link" href="{{ '/' | relative_url }}"><div>Trang chủ</div></a></li>
        
        <!-- Giới thiệu -->
        <li class="menu-item group relative px-3 py-2 hover:text-amber-400 transition">
          <a class="menu-link flex items-center gap-1" href="{{ '/about/' | relative_url }}">
            <div>Giới thiệu</div>
            <span class="text-[10px]">▼</span>
          </a>
          <ul class="sub-menu-container absolute left-0 top-full hidden group-hover:block bg-slate-900 border border-slate-800 shadow-xl rounded-xl py-2 w-56 text-slate-300 z-50 text-xs">
            <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/about/thu-ngo/' | relative_url }}"><div>Thư ngỏ</div></a></li>
            <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/about#tamnhin' | relative_url }}"><div>Tầm nhìn</div></a></li>
            <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/about#sumenh' | relative_url }}"><div>Sứ mệnh</div></a></li>
            <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/about#giatri' | relative_url }}"><div>Giá trị cốt lõi</div></a></li>
            <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/about#doitac' | relative_url }}"><div>Đối tác chiến lược</div></a></li>
          </ul>
        </li>

        <!-- Lĩnh vực hoạt động -->
        <li class="menu-item group relative px-3 py-2 hover:text-amber-400 transition">
          <a class="menu-link flex items-center gap-1" href="{{ '/dich-vu/' | relative_url }}">
            <div>Lĩnh vực hoạt động</div>
            <span class="text-[10px]">▼</span>
          </a>
          <ul class="sub-menu-container absolute left-0 top-full hidden group-hover:block bg-slate-900 border border-slate-800 shadow-xl rounded-xl py-2 w-64 text-slate-300 z-50 text-xs">
            <li class="menu-item group/sub relative px-4 py-2 hover:bg-slate-800 hover:text-amber-400">
              <a class="menu-link flex items-center justify-between" href="{{ '/be-tong-tuoi/' | relative_url }}">
                <div>Bê tông tươi</div>
                <span class="text-[10px]">►</span>
              </a>
              <ul class="sub-menu-container absolute left-full top-0 hidden group-hover/sub:block bg-slate-900 border border-slate-800 shadow-xl rounded-xl py-2 w-60 text-slate-300 text-xs">
                <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/be-tong-tuoi/be-tong-thuong/' | relative_url }}"><div>Bê tông thường</div></a></li>
                <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/be-tong-tuoi/be-tong-chong-tham/' | relative_url }}"><div>Bê tông chống thấm</div></a></li>
                <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/be-tong-tuoi/be-tong-chat-luong-cao/' | relative_url }}"><div>Bê tông chất lượng cao</div></a></li>
                <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/be-tong-tuoi/be-tong-ninh-ket-cham/' | relative_url }}"><div>Bê tông ninh kết chậm</div></a></li>
              </ul>
            </li>
            <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/be-tong-thuong-pham/' | relative_url }}"><div>Bê tông thương phẩm</div></a></li>
            <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/bom-be-tong/' | relative_url }}"><div>Bơm bê tông</div></a></li>
            <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/be-tong-sieu-nhe/' | relative_url }}"><div>Bê tông siêu nhẹ</div></a></li>
            <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/be-tong-nhua/' | relative_url }}"><div>Bê tông nhựa</div></a></li>
            <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/be-tong-khi-chung-ap/' | relative_url }}"><div>Bê tông khí chưng áp</div></a></li>
          </ul>
        </li>

        <li class="menu-item px-3 py-2 hover:text-amber-400 transition"><a class="menu-link" href="{{ '/du-an/' | relative_url }}"><div>Dự án</div></a></li>
        
        <!-- Blog -->
        <li class="menu-item group relative px-3 py-2 hover:text-amber-400 transition">
          <a class="menu-link flex items-center gap-1" href="{{ '/blog/' | relative_url }}">
            <div>Blog</div>
            <span class="text-[10px]">▼</span>
          </a>
          <ul class="sub-menu-container absolute left-0 top-full hidden group-hover:block bg-slate-900 border border-slate-800 shadow-xl rounded-xl py-2 w-48 text-slate-300 z-50 text-xs">
            <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/blog/tin-tuc/' | relative_url }}"><div>Tin Tức</div></a></li>
            <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/blog/kinh-nghiem/' | relative_url }}"><div>Kinh Nghiệm</div></a></li>
            <li class="menu-item px-4 py-2 hover:bg-slate-800 hover:text-amber-400"><a class="menu-link block" href="{{ '/blog/kien-thuc/' | relative_url }}"><div>Kiến Thức</div></a></li>
          </ul>
        </li>

        <li class="menu-item px-3 py-2 hover:text-amber-400 transition"><a class="menu-link" href="{{ '/tuyen-dung/' | relative_url }}"><div>Tuyển dụng</div></a></li>
        <li class="menu-item px-3 py-2 hover:text-amber-400 transition"><a class="menu-link" href="{{ '/lien-he/' | relative_url }}"><div>Liên hệ</div></a></li>
      </ul>
    </nav>

    <div class="flex items-center gap-3">
      <a href="tel:0988266293" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-2">
        <i class="fa-solid fa-phone-volume"></i> 0988 2662 93
      </a>
    </div>
  </div>
</header>`
    );

    includesFolder.file(
      'footer.html',
      `<footer class="bg-slate-950 text-slate-300 py-12 mt-16 border-t border-slate-800">
  <div class="container mx-auto px-4 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
    <div>
      <h3 class="text-white font-bold text-base mb-3 uppercase tracking-wider">CÔNG TY TNHH BÊ TÔNG AN GIA BÌNH</h3>
      <p class="text-slate-400 leading-relaxed mb-3">Chuyên sản xuất và cung ứng bê tông thương phẩm, xe bơm cần 37m-56m, bơm tĩnh áp lực cao tại tỉnh Ninh Bình.</p>
      <p class="text-amber-400 font-semibold"><i class="fa-solid fa-phone mr-2"></i>Hotline 24/7: 0988 2662 93</p>
      <p class="text-slate-400 text-xs mt-1">Email: ketoan.angiabinh@gmail.com</p>
    </div>
    <div>
      <h3 class="text-white font-bold text-base mb-3 uppercase tracking-wider">Hệ Thống Trạm Trộn</h3>
      <ul class="space-y-2 text-slate-400">
        <li>• Trạm 1: KCN Khánh Phú, phường Đông Hoa Lư, Ninh Bình (300m³/h)</li>
        <li>• Trạm 2: Xã Kim Sơn, Tỉnh Ninh Bình (150m³/h)</li>
        <li>• Bán kính phục vụ: Toàn tỉnh Ninh Bình & lân cận</li>
      </ul>
    </div>
    <div>
      <h3 class="text-white font-bold text-base mb-3 uppercase tracking-wider">Kết Nối Mạng Xã Hội</h3>
      <p class="text-slate-400 mb-3">Theo dõi fanpage chính thức để cập nhật tiến độ công trình và ưu đãi giá mới nhất:</p>
      <a href="{{ site.facebook_page }}" target="_blank" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
        <i class="fa-brands fa-facebook-f"></i> Facebook Fanpage An Gia Bình
      </a>
    </div>
  </div>
</footer>`
    );

    includesFolder.file(
      'mobile-bar.html',
      `<div class="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-2.5 flex items-center justify-around z-50 text-xs">
  <a href="tel:0988266293" class="flex flex-col items-center text-amber-400 font-bold">
    <i class="fa-solid fa-phone text-lg mb-1"></i>
    <span>Gọi Hotline</span>
  </a>
  <a href="{{ site.facebook_page }}" target="_blank" class="flex flex-col items-center text-blue-400 font-bold">
    <i class="fa-brands fa-facebook-messenger text-lg mb-1"></i>
    <span>Fanpage</span>
  </a>
  <a href="{{ '/blog.html' | relative_url }}" class="flex flex-col items-center text-slate-300 font-medium">
    <i class="fa-solid fa-book-open text-lg mb-1"></i>
    <span>Xem Giá</span>
  </a>
</div>`
    );
  }

  // 6. index.markdown
  zip.file(
    'index.markdown',
    `---
layout: default
title: Trang Chủ
---
<div class="text-center py-12">
  <span class="bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">Trạm Trộn Bê Tông Công Nghệ Cao Ninh Bình</span>
  <h1 class="text-3xl sm:text-5xl font-black text-slate-900 mt-4 mb-6">BÊ TÔNG AN GIA BÌNH</h1>
  <p class="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg mb-8">
    Chuyên cung ứng bê tông tươi mác 150 - 450, dịch vụ xe bơm cần 37m-56m, bơm tĩnh áp lực cao. Kiểm định chuẩn TCVN, đo nén mẫu R7, R28 uy tín hàng đầu Ninh Bình.
  </p>
  <div class="flex flex-wrap justify-center gap-4">
    <a href="tel:0988266293" class="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl shadow-md text-base">
      <i class="fa-solid fa-phone-volume mr-2"></i> Gọi Đặt Bê Tông: 0988 2662 93
    </a>
    <a href="{{ '/projects.html' | relative_url }}" class="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl text-base">
      Xem Dự Án Đã Thi Công
    </a>
  </div>
</div>

<section class="mt-12">
  <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
    <i class="fa-solid fa-newspaper text-amber-600"></i> Bài Viết Mới Chuẩn SEO
  </h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {% for post in site.posts limit:4 %}
    <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-amber-400 transition">
      <div class="text-xs text-amber-600 font-semibold mb-2">{{ post.categories | join: ', ' }} • {{ post.date | date: "%d/%m/%Y" }}</div>
      <h3 class="font-bold text-slate-900 text-lg mb-2 leading-snug">
        <a href="{{ post.url | relative_url }}" class="hover:text-amber-600">{{ post.title }}</a>
      </h3>
      <p class="text-slate-600 text-sm line-clamp-2 mb-4">{{ post.description | default: post.excerpt }}</p>
      <a href="{{ post.url | relative_url }}" class="text-amber-600 font-bold text-sm hover:underline">Đọc tiếp &rarr;</a>
    </div>
    {% endfor %}
  </div>
</section>
`
  );

  // 7. projects.markdown
  zip.file(
    'projects.markdown',
    `---
layout: default
title: Hồ Sơ Dự Án Đã Thi Công
---
<div class="mb-10">
  <h1 class="text-3xl font-extrabold text-slate-900 mb-3">Hồ Sơ Dự Án Đã Thi Công</h1>
  <p class="text-slate-600">Tổng hợp các công trình tiêu biểu do Bê Tông An Gia Bình cung ứng tại Ninh Bình và khu vực lân cận.</p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
${projects.map(proj => `
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
    <img src="${proj.image}" alt="${proj.title}" class="w-full h-52 object-cover">
    <div class="p-6 flex-grow flex flex-col justify-between">
      <div>
        <div class="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full mb-3">${proj.category}</div>
        <h3 class="text-xl font-bold text-slate-900 mb-2">${proj.title}</h3>
        <p class="text-xs text-slate-500 mb-3"><i class="fa-solid fa-location-dot text-amber-500 mr-1"></i> ${proj.location}</p>
        <p class="text-sm text-slate-600 mb-4">${proj.description}</p>
        <div class="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-700 mb-4">
          <div><strong>Khối lượng:</strong> ${proj.volumeM3.toLocaleString()} m³</div>
          <div><strong>Mác bê tông:</strong> ${proj.concreteGrade}</div>
          <div><strong>Thiết bị bơm:</strong> ${proj.pumpService}</div>
          <div><strong>Chủ đầu tư / Tổng thầu:</strong> ${proj.client}</div>
        </div>
      </div>
    </div>
  </div>
`).join('\n')}
</div>
`
  );

  // 8. blog.markdown
  zip.file(
    'blog.markdown',
    `---
layout: default
title: Kiến Thức Chuyên Môn & Báo Giá Bê Tông
---
<div class="mb-8">
  <h1 class="text-3xl font-black text-slate-900 mb-2">Chuyên Mục Kiến Thức & Báo Giá Bê Tông</h1>
  <p class="text-slate-600">Tổng hợp cẩm nang kỹ thuật, tiêu chuẩn nén mẫu R7/R28 và bảng giá bê tông tươi Ninh Bình.</p>
</div>

<div class="space-y-6">
  {% for post in site.posts %}
  <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
    {% if post.image %}
    <img src="{{ post.image }}" alt="{{ post.title }}" class="w-full md:w-56 h-40 object-cover rounded-xl">
    {% endif %}
    <div class="flex-grow">
      <div class="text-xs text-amber-600 font-semibold mb-2">
        {{ post.categories | join: ', ' }} • {{ post.date | date: "%d/%m/%Y" }}
      </div>
      <h2 class="text-xl font-bold text-slate-900 mb-2">
        <a href="{{ post.url | relative_url }}" class="hover:text-amber-600">{{ post.title }}</a>
      </h2>
      <p class="text-slate-600 text-sm mb-4">{{ post.description | default: post.excerpt }}</p>
      <a href="{{ post.url | relative_url }}" class="text-amber-600 font-bold text-sm inline-flex items-center gap-1">
        Xem chi tiết bài viết <i class="fa-solid fa-arrow-right text-xs"></i>
      </a>
    </div>
  </div>
  {% endfor %}
</div>
`
  );

  // 9. README.md
  zip.file(
    'README.md',
    `# Bê Tông An Gia Bình - Jekyll Static Website Bundle

Trọn bộ mã nguồn tĩnh Jekyll cho website doanh nghiệp Bê Tông An Gia Bình (Ninh Bình).
Tốc độ tải siêu tốc, bảo mật tối ưu (không cần database runtime), chuẩn SEO Google On-Page.

## Hướng Dẫn Cài Đặt & Chạy Thử (Local)

1. Yêu cầu: Đã cài Ruby & Bundler.
2. Cài đặt gems:
   \`\`\`bash
   bundle install
   \`\`\`
3. Chạy máy chủ Jekyll:
   \`\`\`bash
   bundle exec jekyll serve
   \`\`\`
4. Mở trình duyệt: \`http://localhost:4000\`

## Deploy lên GitHub Pages / Netlify / Vercel
- **GitHub Pages:** Đẩy toàn bộ source này lên repository GitHub, kích hoạt GitHub Pages trong Settings > Pages > Source = GitHub Actions (hoặc Deploy from a branch).
- **Netlify / Vercel:** Kết nối repo, Build command: \`jekyll build\`, Publish directory: \`_site\`.

Fanpage chính thức: https://www.facebook.com/betongangiabinh/
Hotline: 0988 2662 93
Email: ketoan.angiabinh@gmail.com
`
  );

  return await zip.generateAsync({ type: 'blob' });
}

export async function generateJekyllZipBundle(
  config: JekyllConfig,
  posts: BlogPost[],
  projects: Project[]
): Promise<void> {
  const blob = await createJekyllZip(config, posts, projects);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `betongangiabinh-jekyll-source-${new Date().toISOString().split('T')[0]}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

