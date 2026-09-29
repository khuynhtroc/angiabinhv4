<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="vi">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Sơ Đồ Trang Web XML (XML Sitemap) | Bê Tông An Gia Bình Ninh Bình</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            padding: 24px 16px;
            line-height: 1.5;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
            overflow: hidden;
            border: 1px solid #e2e8f0;
          }
          .header {
            background: linear-gradient(135deg, #020617 0%, #0f172a 100%);
            color: #ffffff;
            padding: 32px 28px;
            border-bottom: 4px solid #f59e0b;
          }
          .badge {
            display: inline-block;
            background: #f59e0b;
            color: #020617;
            font-size: 11px;
            font-weight: 900;
            padding: 4px 10px;
            border-radius: 9999px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
          }
          h1 {
            font-size: 24px;
            font-weight: 900;
            margin-bottom: 8px;
            letter-spacing: -0.02em;
          }
          .desc {
            color: #94a3b8;
            font-size: 13px;
            max-width: 850px;
            line-height: 1.6;
          }
          .controls {
            padding: 20px 28px;
            background: #f1f5f9;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .search-box {
            display: flex;
            align-items: center;
            background: #ffffff;
            border: 2px solid #cbd5e1;
            border-radius: 12px;
            padding: 10px 16px;
            width: 100%;
            transition: all 0.2s;
          }
          .search-box:focus-within {
            border-color: #f59e0b;
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
          }
          .search-box input {
            border: none;
            outline: none;
            width: 100%;
            font-size: 14px;
            color: #0f172a;
            font-weight: 500;
          }
          .filter-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .filter-btn {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            padding: 8px 14px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            color: #475569;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
          .filter-btn:hover {
            background: #e2e8f0;
            color: #0f172a;
          }
          .filter-btn.active {
            background: #f59e0b;
            border-color: #f59e0b;
            color: #020617;
          }
          .stats-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #64748b;
            font-weight: 600;
            padding: 0 4px;
          }
          .table-wrapper {
            overflow-x: auto;
            padding: 16px 28px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          th {
            background: #f8fafc;
            color: #475569;
            font-weight: 800;
            text-align: left;
            padding: 12px 14px;
            border-bottom: 2px solid #e2e8f0;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.05em;
          }
          td {
            padding: 12px 14px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
          }
          tr:hover td {
            background: #fefce8;
          }
          .category-tag {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 11px;
            white-space: nowrap;
          }
          .cat-page { background: #e0f2fe; color: #0369a1; }
          .cat-blog { background: #fef3c7; color: #92400e; }
          .cat-cat { background: #f3e8ff; color: #6b21a8; }
          .cat-project { background: #dcfce7; color: #166534; }
          .cat-policy { background: #f1f5f9; color: #475569; }
          .url-link {
            color: #0284c7;
            text-decoration: none;
            font-weight: 600;
            word-break: break-all;
          }
          .url-link:hover {
            color: #d97706;
            text-decoration: underline;
          }
          .priority-tag {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 6px;
            font-weight: 800;
            font-size: 11px;
            font-family: monospace;
          }
          .priority-high { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
          .priority-med { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
          .priority-low { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
          .footer {
            padding: 20px 28px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
          }
          .footer a {
            color: #d97706;
            text-decoration: none;
            font-weight: 700;
          }
          .footer a:hover {
            text-decoration: underline;
          }
          .brand-row {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;
          }
          .site-logo {
            height: 52px;
            width: auto;
            max-width: 140px;
            object-fit: contain;
            border-radius: 12px;
            background: #ffffff;
            padding: 4px;
          }
        </style>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
        <link rel="shortcut icon" href="/favicon.ico"/>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand-row">
              <a href="https://betongangiabinh.vn">
                <img src="/logo.png" alt="Bê Tông An Gia Bình" class="site-logo" />
              </a>
              <div>
                <div class="badge">Google &amp; Search Engine Indexing Protocol</div>
                <h1>Sơ Đồ Trang Web XML (XML Sitemap)</h1>
              </div>
            </div>
            <p class="desc">
              Sơ đồ cấu trúc toàn bộ đường dẫn trên website Bê Tông An Gia Bình Ninh Bình, được phân loại mạch lạc theo Trang chính, Dịch vụ cốt lõi, Chuyên mục, Bài viết và Dự án để cả người dùng và bot tìm kiếm (Googlebot, Bingbot) tra cứu tức thì.
            </p>
          </div>

          <div class="controls">
            <div class="search-box">
              <input type="text" id="searchInput" placeholder="🔍 Nhập từ khóa tìm kiếm link trực tiếp (ví dụ: mác 250, bơm, khánh phú, giá, du-an...)" oninput="filterUrls()" />
            </div>

            <div class="filter-tabs">
              <button class="filter-btn active" onclick="setFilter('all', this)">
                Tất Cả (<span id="count-all"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>)
              </button>
              <button class="filter-btn" onclick="setFilter('blog', this)">
                📰 Bài Viết &amp; Cẩm Nang (<span id="count-blog">0</span>)
              </button>
              <button class="filter-btn" onclick="setFilter('page', this)">
                🏢 Trang &amp; Dịch Vụ (<span id="count-page">0</span>)
              </button>
              <button class="filter-btn" onclick="setFilter('cat', this)">
                📁 Chuyên Mục Blog (<span id="count-cat">0</span>)
              </button>
              <button class="filter-btn" onclick="setFilter('project', this)">
                🏗️ Dự Án Tiêu Biểu (<span id="count-project">0</span>)
              </button>
              <button class="filter-btn" onclick="setFilter('policy', this)">
                ⚖️ Chính Sách (<span id="count-policy">0</span>)
              </button>
            </div>

            <div class="stats-bar">
              <div>Đang hiển thị: <strong id="visibleCount"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> / <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> đường dẫn</div>
              <div>Cập nhật tự động: <strong>24/7</strong></div>
            </div>
          </div>

          <div class="table-wrapper">
            <table id="urlTable">
              <thead>
                <tr>
                  <th style="width: 45px;">STT</th>
                  <th style="width: 140px;">Phân Loại</th>
                  <th>Đường Dẫn URL</th>
                  <th style="width: 100px;">Ưu Tiên</th>
                  <th style="width: 120px;">Tần Suất</th>
                  <th style="width: 120px;">Cập Nhật</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <xsl:variable name="loc" select="sitemap:loc"/>
                  <xsl:variable name="type">
                    <xsl:choose>
                      <xsl:when test="contains($loc, '/du-an/')">project</xsl:when>
                      <xsl:when test="contains($loc, 'chinh-sach') or contains($loc, 'dieu-khoan')">policy</xsl:when>
                      <xsl:when test="contains($loc, '/blog/tin-tuc') or contains($loc, '/blog/kinh-nghiem') or contains($loc, '/blog/kien-thuc') or contains($loc, '/blog/chuyen-muc') or $loc = 'https://betongangiabinh.vn/blog'">cat</xsl:when>
                      <xsl:when test="contains($loc, '.html')">blog</xsl:when>
                      <xsl:otherwise>page</xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <tr data-type="{$type}" data-url="{$loc}">
                    <td style="color: #94a3b8; font-weight: bold; font-family: monospace;">
                      <xsl:value-of select="position()"/>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="$type = 'cat'">
                          <span class="category-tag cat-cat">📁 Chuyên Mục</span>
                        </xsl:when>
                        <xsl:when test="$type = 'blog'">
                          <span class="category-tag cat-blog">📰 Bài Viết</span>
                        </xsl:when>
                        <xsl:when test="$type = 'project'">
                          <span class="category-tag cat-project">🏗️ Dự Án</span>
                        </xsl:when>
                        <xsl:when test="$type = 'policy'">
                          <span class="category-tag cat-policy">⚖️ Chính Sách</span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="category-tag cat-page">🏢 Trang / Dịch Vụ</span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td>
                      <a class="url-link" href="{$loc}" target="_blank">
                        <xsl:value-of select="$loc"/>
                      </a>
                    </td>
                    <td>
                      <xsl:variable name="p" select="sitemap:priority"/>
                      <span class="priority-tag">
                        <xsl:choose>
                          <xsl:when test="$p &gt;= 0.8">
                            <xsl:attribute name="class">priority-tag priority-high</xsl:attribute>
                          </xsl:when>
                          <xsl:when test="$p &gt;= 0.6">
                            <xsl:attribute name="class">priority-tag priority-med</xsl:attribute>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:attribute name="class">priority-tag priority-low</xsl:attribute>
                          </xsl:otherwise>
                        </xsl:choose>
                        <xsl:value-of select="sitemap:priority"/>
                      </span>
                    </td>
                    <td style="text-transform: capitalize; color: #64748b; font-size: 12px; font-weight: 600;">
                      <xsl:value-of select="sitemap:changefreq"/>
                    </td>
                    <td style="color: #64748b; font-family: monospace; font-size: 12px;">
                      <xsl:value-of select="substring(sitemap:lastmod, 0, 11)"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <div class="footer">
            <div>
              Trang web chính thức: <a href="https://betongangiabinh.vn">betongangiabinh.vn</a> • Hotline: <strong>0988 2662 93</strong>
            </div>
            <div>
              Nguồn cấp dữ liệu bài viết: <a href="/rss.xml">RSS Feed 2.0</a>
            </div>
          </div>
        </div>

        <script>
          <![CDATA[
          let currentType = 'all';

          function updateCategoryCounts() {
            const rows = document.querySelectorAll('#urlTable tbody tr');
            const counts = { all: rows.length, page: 0, cat: 0, blog: 0, project: 0, policy: 0 };
            rows.forEach(r => {
              const t = r.getAttribute('data-type') || 'page';
              if (counts[t] !== undefined) counts[t]++;
            });
            const setVal = (id, val) => {
              const el = document.getElementById(id);
              if (el) el.innerText = val.toLocaleString('vi-VN');
            };
            setVal('count-all', counts.all);
            setVal('count-blog', counts.blog);
            setVal('count-page', counts.page);
            setVal('count-cat', counts.cat);
            setVal('count-project', counts.project);
            setVal('count-policy', counts.policy);
            const vis = document.getElementById('visibleCount');
            if (vis) vis.innerText = counts.all.toLocaleString('vi-VN');
          }

          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateCategoryCounts);
          } else {
            updateCategoryCounts();
          }

          function setFilter(type, el) {
            currentType = type;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            el.classList.add('active');
            filterUrls();
          }

          function filterUrls() {
            const query = (document.getElementById('searchInput').value || '').toLowerCase().trim();
            const rows = document.querySelectorAll('#urlTable tbody tr');
            let count = 0;

            rows.forEach(row => {
              const rowType = row.getAttribute('data-type');
              const rowUrl = (row.getAttribute('data-url') || '').toLowerCase();
              const matchesType = (currentType === 'all' || rowType === currentType);
              const matchesSearch = !query || rowUrl.includes(query);

              if (matchesType && matchesSearch) {
                row.style.display = '';
                count++;
              } else {
                row.style.display = 'none';
              }
            });

            document.getElementById('visibleCount').innerText = count.toLocaleString('vi-VN');
          }
          ]]>
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
