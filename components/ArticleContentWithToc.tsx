'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { List, ListOrdered, ChevronRight, ChevronDown, Hash, BookOpen, ArrowUp, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { resolveMediaUrl, handleImageFallback } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: 1 | 2 | 3 | 4;
}

interface Props {
  content: string;
}

function slugify(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function cleanHeadingText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove markdown links
    .replace(/[*_`#]/g, '') // remove markdown marks
    .replace(/\s+/g, ' ')
    .trim();
}

function getTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(getTextFromReactNode).join('');
  if (React.isValidElement(node) && (node.props as any)?.children) {
    return getTextFromReactNode((node.props as any).children);
  }
  return '';
}

export default function ArticleContentWithToc({ content }: Props) {
  const { mediaFiles } = useAppStore();
  const [activeId, setActiveId] = useState<string>('');
  const [showFloatingToc, setShowFloatingToc] = useState(false);
  const [modalTocOpen, setModalTocOpen] = useState(false);
  // Default TOC to collapsed as requested by user to optimize space
  const [inArticleTocOpen, setInArticleTocOpen] = useState(false);

  // 1. Normalize markdown content:
  // - Strip Jekyll frontmatter (--- ... ---)
  // - Convert HTML headings (<h1>..<h4>) to Markdown headings (##)
  // - Normalize Jekyll image liquid tags {{ site.url }}
  const processedContent = useMemo(() => {
    if (!content) return '';
    let cleaned = content;

    // Strip YAML frontmatter at start if present
    cleaned = cleaned.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');

    // Transform Jekyll Liquid tags
    cleaned = cleaned
      .replace(/!\[([^\]]*)\]\(\s*\{\{\s*site\.(?:url|baseurl)\s*\}\}([^)]*)\)/g, '![$1]($2)')
      .replace(/\{\{\s*site\.(?:url|baseurl)\s*\}\}/g, '')
      .replace(/!\[([^\]]*)\]\(\s*([^\s)]+)\s*\)/g, '![$1]($2)');

    // Convert HTML headings to Markdown format so ReactMarkdown parses them uniformly
    cleaned = cleaned.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, text) => `\n\n# ${cleanHeadingText(text)}\n\n`);
    cleaned = cleaned.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, text) => `\n\n## ${cleanHeadingText(text)}\n\n`);
    cleaned = cleaned.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, text) => `\n\n### ${cleanHeadingText(text)}\n\n`);
    cleaned = cleaned.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, text) => `\n\n#### ${cleanHeadingText(text)}\n\n`);

    return cleaned.trim();
  }, [content]);

  // 2. Extract headings with multi-tier fallback so TOC is NEVER lost
  const tocItems = useMemo<TocItem[]>(() => {
    if (!processedContent) return [];
    const items: TocItem[] = [];
    const lines = processedContent.split(/\r?\n/);

    // Tier 1: Look for Markdown headings (#, ##, ###, ####)
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      const mdMatch = trimmed.match(/^(#{1,4})\s*(.+)$/);
      if (mdMatch) {
        const hashes = mdMatch[1];
        const rawText = mdMatch[2];
        const text = cleanHeadingText(rawText);
        if (text) {
          const rawId = slugify(text) || `heading-${idx + 1}`;
          let id = rawId;
          let counter = 1;
          while (items.some((it) => it.id === id)) {
            id = `${rawId}-${counter++}`;
          }
          const level = (hashes.length >= 2 ? hashes.length : 2) as 1 | 2 | 3 | 4;
          items.push({ id, text, level });
        }
      }
    });

    // Tier 2: If no markdown headings were detected, look for bold section markers
    // e.g. **1. Giới thiệu**, **Phần 1: ...**, **I. ...**, **Bước 1: ...**
    if (items.length === 0) {
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        const boldMatch =
          trimmed.match(/^\*\*([0-9IVX]+[\.\:\-]\s*[^*]+)\*\*/i) ||
          trimmed.match(/^\*\*(Phần|Mục|Bước|Chương)\s+[0-9IVX]+[\:\.\-]?\s*[^*]+\*\*/i) ||
          trimmed.match(/^([0-9IVX]+[\.\:\-]\s+[^.!?\n]{5,80})/i);

        if (boldMatch) {
          const text = cleanHeadingText(boldMatch[1] || boldMatch[0]);
          if (text && text.length > 3) {
            const rawId = slugify(text) || `section-${idx + 1}`;
            let id = rawId;
            let counter = 1;
            while (items.some((it) => it.id === id)) {
              id = `${rawId}-${counter++}`;
            }
            items.push({ id, text, level: 2 });
          }
        }
      });
    }

    // Tier 3: Universal Fallback
    // If the article is a plain story/announcement with paragraphs and still 0 headings,
    // generate section items from paragraphs so the user ALWAYS has an active Table of Contents
    if (items.length === 0) {
      const paragraphs = processedContent
        .split(/\r?\n\r?\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 40 && !p.startsWith('!') && !p.startsWith('>'));

      if (paragraphs.length >= 2) {
        paragraphs.slice(0, 5).forEach((p, idx) => {
          // Take first sentence or first 60 characters
          const firstSentence = p.split(/[.!?]/)[0].replace(/^[*_`#\s]+/, '').trim();
          const title = firstSentence.length > 60 ? firstSentence.substring(0, 57) + '...' : firstSentence;
          if (title) {
            const id = `muc-${idx + 1}-${slugify(title).slice(0, 25)}`;
            items.push({
              id,
              text: `${idx + 1}. ${title}`,
              level: 2
            });
          }
        });
      }
    }

    return items;
  }, [processedContent]);

  // Scroll spy to highlight active TOC heading and trigger floating sticky icon
  useEffect(() => {
    const handleScroll = () => {
      // Trigger floating sticky TOC icon when user scrolls down past 220px
      setShowFloatingToc(window.scrollY > 220);

      if (tocItems.length === 0) return;
      const scrollPosition = window.scrollY + 160;

      for (let i = tocItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(tocItems[i].id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveId(tocItems[i].id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [tocItems]);

  // Lock body scroll and close on Escape when TOC modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalTocOpen(false);
    };
    if (modalTocOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [modalTocOpen]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
      setModalTocOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setModalTocOpen(false);
  };

  // Build a map of slugified ids to ensure heading ids match TOC items exactly
  const headingIdMap = useMemo(() => {
    const map = new Map<string, string>();
    tocItems.forEach((item) => {
      const clean = cleanHeadingText(item.text);
      map.set(clean.toLowerCase(), item.id);
      map.set(slugify(clean), item.id);
    });
    return map;
  }, [tocItems]);

  const resolveHeadingId = (rawNode: React.ReactNode, fallbackLevel: number): string => {
    const text = cleanHeadingText(getTextFromReactNode(rawNode));
    const lower = text.toLowerCase();
    const slug = slugify(text);

    if (headingIdMap.has(lower)) return headingIdMap.get(lower)!;
    if (headingIdMap.has(slug)) return headingIdMap.get(slug)!;

    // Partial match in tocItems
    const matchedItem = tocItems.find(
      (it) => it.text.toLowerCase().includes(lower) || lower.includes(it.text.toLowerCase())
    );
    if (matchedItem) return matchedItem.id;

    return slug || `heading-lv${fallbackLevel}-${Math.random().toString(36).slice(2, 6)}`;
  };

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Content Rendered via ReactMarkdown */}
      <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-8 lg:p-10 border border-slate-200/90 shadow-xs overflow-hidden min-w-0">
        <div className="article-body-markdown text-slate-700 leading-relaxed text-base space-y-6 break-words text-justify [text-align-last:left]">
          
          {/* Space-Optimized In-Article Table of Contents Box (Default Collapsed) */}
          {tocItems.length > 0 && (
            <div className="bg-slate-50/90 hover:bg-amber-50/40 border border-slate-200/90 rounded-xl p-3 sm:p-3.5 mb-6 not-prose transition-all shadow-2xs">
              <div
                onClick={() => setInArticleTocOpen(!inArticleTocOpen)}
                className="flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                    <ListOrdered className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-slate-900 text-sm">Mục Lục Bài Viết</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      {tocItems.length} mục
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInArticleTocOpen(!inArticleTocOpen);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-amber-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-amber-300 transition shadow-2xs shrink-0"
                  title="Ẩn / Hiện mục lục bài viết"
                >
                  <span>{inArticleTocOpen ? 'Thu gọn' : 'Xem mục lục'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${inArticleTocOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {inArticleTocOpen && (
                <nav className="pt-3 mt-3 border-t border-slate-200/80 space-y-1 text-xs max-h-72 overflow-y-auto pr-1">
                  {tocItems.map((item, index) => {
                    const isActive = activeId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToHeading(item.id)}
                        className={`w-full flex items-start gap-2 text-left py-1.5 px-2 rounded-lg transition ${
                          item.level === 3 ? 'pl-6 text-[11px] text-slate-600' : 'font-semibold text-slate-800'
                        } ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                            : 'hover:bg-amber-100/60 hover:text-amber-900 text-slate-700'
                        }`}
                      >
                        <span className="text-xs font-mono opacity-60 mt-0.5 select-none shrink-0">
                          {item.level === 3 ? '↳' : `${index + 1}.`}
                        </span>
                        <span className="leading-relaxed flex-grow">{item.text}</span>
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>
          )}

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => {
                const id = resolveHeadingId(children, 1);
                return (
                  <h1 id={id} className="text-2xl sm:text-3xl font-black text-slate-900 mt-8 mb-4 tracking-tight scroll-mt-28 flex items-center gap-2.5 text-left [text-align-last:left]">
                    <span className="w-2 h-7 bg-amber-500 rounded-full inline-block shrink-0"></span>
                    <span>{children}</span>
                  </h1>
                );
              },
              h2: ({ children }) => {
                const id = resolveHeadingId(children, 2);
                return (
                  <h2 id={id} className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2.5 scroll-mt-28 group text-left [text-align-last:left]">
                    <span className="w-1.5 h-5 bg-amber-500 rounded-full inline-block shrink-0"></span>
                    <span className="text-amber-500 font-bold select-none text-base">#</span>
                    <span>{children}</span>
                  </h2>
                );
              },
              h3: ({ children }) => {
                const id = resolveHeadingId(children, 3);
                return (
                  <h3 id={id} className="text-lg font-bold text-slate-900 mt-6 mb-3 scroll-mt-28 flex items-center gap-2 text-left [text-align-last:left]">
                    <span className="w-1.5 h-3.5 bg-amber-400 rounded-full inline-block shrink-0"></span>
                    <span>{children}</span>
                  </h3>
                );
              },
              h4: ({ children }) => {
                const id = resolveHeadingId(children, 4);
                return (
                  <h4 id={id} className="text-base font-bold text-slate-800 mt-5 mb-2 scroll-mt-28 text-left [text-align-last:left]">
                    {children}
                  </h4>
                );
              },
              // Safe div wrapper for paragraphs prevents React 19 hydration error "<div> cannot be a descendant of <p>"
              // Căn chỉnh dàn đều các hàng với nhau (Justified text)
              p: ({ children }) => (
                <div className="text-slate-700 leading-relaxed sm:leading-loose mb-5 text-justify [text-align-last:left]">
                  {children}
                </div>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 mb-5 pl-2 text-slate-700 marker:text-amber-500">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 mb-5 pl-2 text-slate-700 marker:text-amber-600 font-medium">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed text-justify [text-align-last:left]">
                  <span className="font-normal text-slate-700">{children}</span>
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="my-6 pl-5 py-3 border-l-4 border-amber-500 bg-amber-50/60 rounded-r-xl italic text-slate-800 font-medium text-justify [text-align-last:left]">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-xs max-w-full">
                  <div className="sm:hidden bg-slate-100/90 px-3 py-1.5 text-[11px] text-slate-600 border-b border-slate-200 flex items-center justify-between font-medium">
                    <span>Bảng dữ liệu kỹ thuật</span>
                    <span className="text-amber-700 font-semibold">Vuốt ngang để xem ➔</span>
                  </div>
                  <table className="min-w-[560px] sm:min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-slate-100 text-slate-900 font-bold text-left">
                  {children}
                </thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-slate-100 bg-white">
                  {children}
                </tbody>
              ),
              tr: ({ children }) => (
                <tr className="hover:bg-amber-50/40 transition">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="px-3.5 sm:px-4 py-2.5 sm:py-3 font-bold text-slate-900 whitespace-nowrap text-xs sm:text-sm">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3.5 sm:px-4 py-2.5 sm:py-3 text-slate-700 text-xs sm:text-sm leading-relaxed align-top">
                  {children}
                </td>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-slate-900">{children}</strong>
              ),
              hr: () => <hr className="my-8 border-slate-200" />,
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-4 decoration-amber-400"
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {children}
                </a>
              ),
              code: ({ children }) => (
                <code className="bg-slate-100 text-amber-900 text-xs px-2 py-1 rounded font-mono border border-slate-200">
                  {children}
                </code>
              ),
              img: ({ src, alt }) => {
                const rawSrc = typeof src === 'string' ? src : '';
                const cleanPath = rawSrc.replace(/^https?:\/\/[^/]+/, '');
                const filename = rawSrc.split('/').pop() || '';

                // Look up in mediaFiles
                const matched = mediaFiles.find(m => 
                  m.url === rawSrc ||
                  m.path === cleanPath ||
                  m.path === rawSrc ||
                  (m.folder && `${m.folder}/${m.name}` === cleanPath) ||
                  m.name === filename
                );

                const baseSrc = matched?.url || matched?.dataUrl || rawSrc;
                const finalSrc = resolveMediaUrl(baseSrc);

                return (
                  <figure className="my-8 group">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-100">
                      <img
                        src={finalSrc}
                        alt={alt || 'Bê tông thương phẩm An Gia Bình'}
                        className="w-full h-auto max-h-[550px] object-cover transition duration-300 group-hover:scale-[1.01]"
                        loading="lazy"
                        onError={(e) => handleImageFallback(e, alt || 'bê tông thương phẩm')}
                      />
                    </div>
                    {alt && (
                      <figcaption className="text-center text-xs text-slate-500 mt-2 italic">
                        {alt}
                      </figcaption>
                    )}
                  </figure>
                );
              }
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </div>
      </div>

      {/* Desktop Sticky Table of Contents & CTA Sidebar */}
      <aside className="hidden lg:block lg:col-span-4 self-start sticky top-28 space-y-4 z-20">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                <List className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Mục Lục Bài Viết</h3>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              {tocItems.length} mục
            </span>
          </div>

          <nav className="space-y-1 max-h-[500px] min-h-[120px] overflow-y-auto pr-1 text-xs">
            {tocItems.map((item, idx) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={`group flex items-start gap-2 w-full text-left py-2 px-3 rounded-xl transition-all ${
                    item.level === 3 ? 'pl-6 text-[11px]' : 'font-semibold'
                  } ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="font-mono text-xs opacity-70 shrink-0 mt-0.5">
                    {item.level === 3 ? '↳' : `${idx + 1}.`}
                  </span>
                  <span className="line-clamp-2 leading-relaxed flex-grow">{item.text}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100 mt-2">
            <button
              onClick={scrollToTop}
              className="w-full flex items-center justify-center gap-1.5 text-slate-500 hover:text-amber-700 text-xs font-semibold py-1.5 transition"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Lên đầu trang</span>
            </button>
          </div>
        </div>

        {/* Quick Hotline Widget (Static CTA) */}
        <div className="bg-amber-50 text-slate-900 p-5 rounded-2xl shadow-2xs border border-amber-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Tư vấn kỹ thuật 24/7</div>
          <div className="text-base font-extrabold mt-1 text-slate-900">Khảo sát & Báo Giá Bê Tông</div>
          <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
            Trạm 1 KCN Khánh Phú (300m³/h) & Trạm 2 Xã Kim Sơn (150m³/h) sẵn sàng điều động 35+ xe bồn, xe bơm cần 37m - 56m.
          </p>
          <a
            href="tel:0988266293"
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs transition shadow-sm"
          >
            Hotline: 0988 2662 93
          </a>
        </div>
      </aside>

      {/* Mobile Drawer (Only opened if explicitly triggered) */}
      {modalTocOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            onClick={() => setModalTocOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            className="relative bg-white w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="toc-modal-title"
          >
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <ListOrdered className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="toc-modal-title" className="font-bold text-sm text-white flex items-center gap-2">
                    <span>Mục Lục Bài Viết</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {tocItems.length} phần
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Chạm vào tiêu đề để nhảy nhanh đến nội dung</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalTocOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Đóng mục lục"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable Headings */}
            <div className="p-3 sm:p-4 overflow-y-auto max-h-[60vh] space-y-1 divide-y divide-slate-100">
              {tocItems.map((item, idx) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToHeading(item.id)}
                    className={`w-full text-left py-2.5 px-3 rounded-xl transition flex items-start gap-2.5 ${
                      item.level === 3 ? 'pl-7 text-xs text-slate-600' : 'font-semibold text-slate-800 text-sm'
                    } ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'hover:bg-amber-50 hover:text-amber-900'
                    }`}
                  >
                    <span className="font-mono text-xs opacity-70 shrink-0 mt-0.5">
                      {item.level === 3 ? '↳' : `${idx + 1}.`}
                    </span>
                    <span className="leading-snug flex-grow">{item.text}</span>
                    {isActive && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded shrink-0">
                        Đang đọc
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={scrollToTop}
                className="flex items-center gap-1.5 text-slate-600 hover:text-amber-700 font-semibold py-1.5 px-3 rounded-lg hover:bg-slate-200/60 transition"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Lên đầu trang</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTocOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
