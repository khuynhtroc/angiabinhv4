'use client';

import React, { useState, useMemo, useRef } from 'react';
import { BlogPost } from '@/lib/types';
import { useAppStore, getGlobalStore } from '@/lib/store';
import { cleanExcerptText } from '@/lib/utils';
import {
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  Sparkles,
  Layers,
  Code,
  AlertCircle,
  UploadCloud,
  Files,
  FileCode,
  Check,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (count: number) => void;
  initialMode?: 'files' | 'form' | 'markdown';
}

interface DraftBulkPost {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  focusKeywords: string;
  author: string;
  permalink?: string;
}

interface UploadedMdFile {
  id: string;
  fileName: string;
  fileSize: string;
  title: string;
  slug: string;
  permalink?: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  focusKeywords: string;
  author: string;
  date: string;
  readTime: string;
  isSelected: boolean;
  isValid: boolean;
}

const DEFAULT_CATEGORY = 'Kỹ Thuật Thi Công';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1000&auto=format&fit=crop&q=80';

const CATEGORIES = [
  'Kỹ Thuật Thi Công',
  'Báo Giá & Thị Trường',
  'Tiêu Chuẩn Chất Lượng',
  'Cẩm Nang Xây Dựng',
  'Dự Án Tiêu Biểu'
];

export default function AdminBulkPostModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'files'
}: Props) {
  const { batchAddPosts, categories } = useAppStore();
  const [activeMode, setActiveMode] = useState<'files' | 'form' | 'markdown'>(initialMode);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isReadingFiles, setIsReadingFiles] = useState(false);

  // Available categories from store or fallback
  const availableCategories = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map((c) => c.name);
    }
    return CATEGORIES;
  }, [categories]);

  // Uploaded Files State
  const [uploadedFiles, setUploadedFiles] = useState<UploadedMdFile[]>([]);
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState<string>('');

  // Form Mode State: Array of multiple posts
  const [formPosts, setFormPosts] = useState<DraftBulkPost[]>([
    {
      title: 'Báo Giá Bê Tông Thương Phẩm Mác 250 Tại Kim Sơn Ninh Bình',
      category: 'Báo Giá & Thị Trường',
      excerpt: 'Cập nhật bảng giá bê tông thương phẩm mác 250 chuẩn TCVN tại huyện Kim Sơn và lân cận từ Trạm 2 An Gia Bình.',
      content: `## 1. Báo Giá Bê Tông Thương Phẩm Mác 250 Tại Kim Sơn\n\nBê Tông An Gia Bình cung cấp bê tông tươi mác 250 đạt chuẩn R28 với cát vàng sông Lô, đá 1x2 sàng tuyển kỹ.\n\n![Bê tông thương phẩm An Gia Bình]({{ site.url }}/images/blog/be-tong-thuong-pham-an-gia-binh.jpg)\n\n### Tiêu chuẩn kỹ thuật:\n- Độ sụt: 12 ± 2 cm hoặc 14 ± 2 cm cho bơm cần\n- Xi măng: Nghi Sơn / Tam Điệp PCB40 chuyên dụng\n- Hotline điều vận trạm: 0988 2662 93`,
      coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1000&auto=format&fit=crop&q=80',
      focusKeywords: 'bê tông kim sơn, giá bê tông ninh bình, an gia bình',
      author: 'Kỹ Sư An Gia Bình'
    },
    {
      title: 'Quy Trình Nghiệm Thu Độ Sụt Bê Tông Tươi Trước Khi Bơm Sàn',
      category: 'Kỹ Thuật Thi Công',
      excerpt: 'Hướng dẫn chi tiết cách kiểm tra côn đo độ sụt, đúc mẫu thí nghiệm R7 và R28 ngay tại công trường Ninh Bình.',
      content: `## Quy Trình Thử Côn Độ Sụt Tại Công Trường\n\nTrước khi xả bê tông vào phễu bơm cần, cán bộ kỹ thuật An Gia Bình và giám sát công trình tiến hành thử côn độ sụt theo TCVN 3106:1993.\n\n### Các bước kiểm tra:\n1. Lau ẩm mặt trong côn hình nón cụt.\n2. Đổ bê tông làm 3 lớp, mỗi lớp đầm 25 phát.\n3. Nhấc côn thẳng đứng trong 5-10 giây và đo độ hạ thấp.\n\nKiểm tra độ sụt đạt yêu cầu kỹ thuật trước khi tiến hành thi công.`,
      coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&auto=format&fit=crop&q=80',
      focusKeywords: 'độ sụt bê tông, nghiệm thu bê tông ninh bình, kỹ thuật đổ sàn',
      author: 'Phòng Kỹ Thuật Nghiệm Thu'
    }
  ]);

  // Text/Markdown Mode State
  const [rawText, setRawText] = useState('');

  // Helper to parse single markdown text
  const parseSingleMarkdown = (
    raw: string,
    fileName: string = 'bai-viet.md',
    fileSizeBytes: number = 0
  ): UploadedMdFile => {
    // Clean UTF-8 BOM, carriage returns
    const cleanRaw = (raw || '').replace(/^\uFEFF/, '').trim();
    const fmMatch = cleanRaw.match(/^---\s*?\r?\n([\s\S]*?)\r?\n---\s*?\r?\n?([\s\S]*)$/);
    let title = '';
    let category = availableCategories[0] || DEFAULT_CATEGORY;
    let excerpt = '';
    let coverImage = DEFAULT_IMAGE;
    let focusKeywords = 'bê tông ninh bình, an gia bình';
    let content = cleanRaw;
    let author = 'Bê Tông An Gia Bình';
    let permalink = '';
    let date = new Date().toISOString().split('T')[0];
    let tags: string[] = ['bê tông ninh bình'];

    // Extract date from filename with multiple common patterns
    let extractedDateFromFileName: string | null = null;
    
    // Pattern 1: YYYY-MM-DD, YYYY_MM_DD, YYYY.MM.DD anywhere in filename
    const ymdMatch = fileName.match(/(\d{4})[-_.\s](\d{2})[-_.\s](\d{2})/);
    if (ymdMatch) {
      const year = parseInt(ymdMatch[1], 10);
      const month = parseInt(ymdMatch[2], 10);
      const day = parseInt(ymdMatch[3], 10);
      if (year >= 2000 && year <= 2099 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        extractedDateFromFileName = `${ymdMatch[1]}-${ymdMatch[2].padStart(2, '0')}-${ymdMatch[3].padStart(2, '0')}`;
      }
    }

    // Pattern 2: DD-MM-YYYY, DD_MM_YYYY, DD.MM.YYYY
    if (!extractedDateFromFileName) {
      const dmyMatch = fileName.match(/(\d{2})[-_.\s](\d{2})[-_.\s](\d{4})/);
      if (dmyMatch) {
        const day = parseInt(dmyMatch[1], 10);
        const month = parseInt(dmyMatch[2], 10);
        const year = parseInt(dmyMatch[3], 10);
        if (year >= 2000 && year <= 2099 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          extractedDateFromFileName = `${year}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`;
        }
      }
    }

    // Pattern 3: YYYYMMDD (compact 8-digit date)
    if (!extractedDateFromFileName) {
      const compactMatch = fileName.match(/(20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])/);
      if (compactMatch) {
        extractedDateFromFileName = `${compactMatch[1]}-${compactMatch[2]}-${compactMatch[3]}`;
      }
    }

    if (extractedDateFromFileName) {
      date = extractedDateFromFileName;
    }

    if (fmMatch) {
      const fm = fmMatch[1];
      content = fmMatch[2].trim();

      fm.split(/\r?\n/).forEach((line) => {
        const colon = line.indexOf(':');
        if (colon > -1) {
          const k = line.slice(0, colon).trim().toLowerCase();
          let v = line.slice(colon + 1).trim();
          v = v.replace(/^["']|["']$/g, '');

          if (k === 'title' || k === 'tieude' || k === 'name') {
            title = v;
          } else if (k === 'date' || k === 'ngay') {
            const rawDate = v.split(' ')[0].replace(/^["']|["']$/g, '');
            if (rawDate && !extractedDateFromFileName) date = rawDate;
          } else if (k === 'category' || k === 'categories' || k === 'chuyenmuc' || k === 'chuyen_muc') {
            const cleanCat = v.replace(/[\[\]"']/g, '').split(',')[0]?.trim();
            if (cleanCat) category = cleanCat;
          } else if (k === 'excerpt' || k === 'description' || k === 'seo_description' || k === 'summary') {
            excerpt = v;
          } else if (k === 'image' || k === 'coverimage' || k === 'cover_image' || k === 'thumbnail') {
            coverImage = v.replace(/\{\{\s*site\.url\s*\}\}/g, '').replace(/\{\{\s*site\.baseurl\s*\}\}/g, '') || DEFAULT_IMAGE;
          } else if (k === 'keywords' || k === 'focus_keywords' || k === 'tags') {
            focusKeywords = v.replace(/[\[\]"']/g, '');
            tags = focusKeywords.split(',').map((t) => t.trim()).filter(Boolean);
          } else if (k === 'author' || k === 'tacgia') {
            author = v;
          } else if (k === 'permalink' || k === 'url' || k === 'duong_dan') {
            permalink = v;
          }
        }
      });
    }

    // Fallback title from markdown heading or clean filename
    if (!title) {
      const firstHeading = content.match(/^#+\s+(.*)$/m);
      if (firstHeading) {
        title = firstHeading[1].trim();
      } else {
        const cleanName = fileName
          .replace(/^\d{4}-\d{2}-\d{2}-?/, '')
          .replace(/\.(md|markdown|txt|html)$/i, '')
          .replace(/[-_]/g, ' ')
          .trim();
        title = cleanName ? (cleanName.charAt(0).toUpperCase() + cleanName.slice(1)) : 'Bài viết mới';
      }
    }

    // Fallback content if empty or only frontmatter was present
    if (!content) {
      content = excerpt || `Nội dung kỹ thuật trạm trộn bê tông tươi An Gia Bình cho chuyên đề "${title}".`;
    }

    // Sanitize and clean excerpt
    excerpt = cleanExcerptText(excerpt || content, 170);

    // If permalink is specified in .md frontmatter, derive slug and standardize permalink
    let formattedPermalink = '';
    let slugFromPermalink = '';
    if (permalink) {
      let p = permalink.trim();
      if (!p.startsWith('/') && !p.startsWith('http://') && !p.startsWith('https://')) {
        p = '/' + p;
      }
      formattedPermalink = p;

      // Extract clean slug from permalink
      const cleanP = p
        .replace(/^https?:\/\/[^/]+/, '')
        .replace(/^\/+|\/+$/g, '')
        .replace(/\.html$/i, '');
      const segments = cleanP.split('/').filter(Boolean);
      if (segments.length > 0) {
        slugFromPermalink = segments[segments.length - 1]
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }
    }

    // Slug: prioritize slug derived from permalink if available
    const slugBase = slugFromPermalink || title || fileName.replace(/\.(md|markdown|txt|html)$/i, '');
    const slug = slugFromPermalink || slugBase
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readTime = `${Math.max(3, Math.ceil(wordCount / 200))} phút`;

    const sizeFormatted =
      fileSizeBytes > 1024 * 1024
        ? `${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(fileSizeBytes / 1024))} KB`;

    return {
      id: `up-md-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fileName,
      fileSize: sizeFormatted,
      title,
      slug,
      permalink: formattedPermalink || undefined,
      category,
      excerpt,
      content,
      coverImage: coverImage || DEFAULT_IMAGE,
      tags,
      focusKeywords,
      author,
      date,
      readTime,
      isSelected: true,
      isValid: true
    };
  };

  // Handle files selection
  const processFiles = (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);

    if (filesArray.length === 0) {
      alert('Vui lòng chọn ít nhất 1 file để tải lên.');
      return;
    }

    setIsReadingFiles(true);

    const promises = filesArray.map((file) => {
      return new Promise<UploadedMdFile>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = (e.target?.result as string) || '';
          const parsed = parseSingleMarkdown(text, file.name, file.size);
          resolve(parsed);
        };
        reader.onerror = () => {
          resolve({
            id: `err-${Math.random()}`,
            fileName: file.name,
            fileSize: '0 KB',
            title: file.name.replace(/\.[^/.]+$/, ''),
            slug: 'bai-viet-moi',
            category: DEFAULT_CATEGORY,
            excerpt: '',
            content: 'Nội dung cập nhật kỹ thuật bê tông An Gia Bình.',
            coverImage: DEFAULT_IMAGE,
            tags: [],
            focusKeywords: '',
            author: 'An Gia Bình',
            date: new Date().toISOString().split('T')[0],
            readTime: '3 phút',
            isSelected: true,
            isValid: true
          });
        };
        reader.readAsText(file);
      });
    });

    Promise.all(promises).then((results) => {
      setUploadedFiles((prev) => [...prev, ...results]);
      setIsReadingFiles(false);
      setActiveMode('files');
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Bulk File Actions
  const handleToggleSelectAll = (checked: boolean) => {
    setUploadedFiles((prev) => prev.map((f) => ({ ...f, isSelected: checked })));
  };

  const handleToggleFileSelection = (id: string) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isSelected: !f.isSelected } : f))
    );
  };

  const handleUpdateFileField = (
    id: string,
    field: keyof UploadedMdFile,
    value: any
  ) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleApplyBulkCategory = () => {
    if (!bulkCategoryTarget) {
      alert('Vui lòng chọn chuyên mục muốn áp dụng.');
      return;
    }
    setUploadedFiles((prev) =>
      prev.map((f) =>
        f.isSelected ? { ...f, category: bulkCategoryTarget } : f
      )
    );
  };

  // Form mode actions
  const handleAddPostRow = () => {
    setFormPosts((prev) => [
      ...prev,
      {
        title: '',
        category: availableCategories[0] || DEFAULT_CATEGORY,
        excerpt: '',
        content: '',
        coverImage: DEFAULT_IMAGE,
        focusKeywords: 'bê tông ninh bình, an gia bình',
        author: 'Ban Biên Tập Kỹ Thuật'
      }
    ]);
  };

  const handleRemoveRow = (index: number) => {
    if (formPosts.length <= 1) {
      alert('Cần giữ lại ít nhất 1 bài viết trong danh sách.');
      return;
    }
    setFormPosts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateField = (
    index: number,
    field: keyof DraftBulkPost,
    value: string
  ) => {
    setFormPosts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Parse multi-post markdown/text in tab 3
  const parsedTextPosts: DraftBulkPost[] = useMemo((): DraftBulkPost[] => {
    if (!rawText.trim()) return [];

    if (rawText.trim().startsWith('[') && rawText.trim().endsWith(']')) {
      try {
        const json = JSON.parse(rawText);
        if (Array.isArray(json)) {
          return json.map((item: any, i: number): DraftBulkPost => ({
            title: item.title || `Bài viết nhập hàng loạt #${i + 1}`,
            category: item.category || availableCategories[0] || DEFAULT_CATEGORY,
            excerpt: item.excerpt || (item.content ? item.content.slice(0, 160).trim() + '...' : ''),
            content: item.content || item.body || '',
            coverImage: item.coverImage || item.image || DEFAULT_IMAGE,
            focusKeywords: Array.isArray(item.keywords)
              ? item.keywords.join(', ')
              : item.keywords || 'bê tông ninh bình',
            author: item.author || 'Bê Tông An Gia Bình',
            permalink: item.permalink || item.url || undefined
          }));
        }
      } catch {}
    }

    const chunks = rawText
      .split(/(?:^|\n)(?:={3,}|---(?:\r?\n---)?)(?:\r?\n|$)/)
      .map((c) => c.trim())
      .filter(Boolean);

    const results: DraftBulkPost[] = [];

    chunks.forEach((chunk, idx) => {
      const fmMatch = chunk.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      let title = '';
      let category = availableCategories[0] || DEFAULT_CATEGORY;
      let excerpt = '';
      let coverImage = DEFAULT_IMAGE;
      let focusKeywords = 'bê tông ninh bình';
      let content = chunk;
      let author = 'Bê Tông An Gia Bình';
      let permalink = '';

      if (fmMatch) {
        const fm = fmMatch[1];
        content = fmMatch[2].trim();

        fm.split('\n').forEach((line) => {
          const colon = line.indexOf(':');
          if (colon > -1) {
            const k = line.slice(0, colon).trim().toLowerCase();
            const v = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
            if (k === 'title') title = v;
            else if (k === 'category' || k === 'categories') category = v;
            else if (k === 'excerpt' || k === 'description') excerpt = v;
            else if (k === 'image' || k === 'coverimage') coverImage = v;
            else if (k === 'keywords' || k === 'tags') focusKeywords = v;
            else if (k === 'author') author = v;
            else if (k === 'permalink' || k === 'url' || k === 'duong_dan') permalink = v;
          }
        });
      }

      if (!title) {
        const firstHeading = content.match(/^#+\s+(.*)$/m);
        if (firstHeading) {
          title = firstHeading[1].trim();
        } else {
          title = `Bài viết ${idx + 1}: ${content.slice(0, 50).replace(/\n/g, ' ')}...`;
        }
      }

      if (!excerpt) {
        excerpt = content.replace(/^[#\s\*\-\_\>]+/gm, '').slice(0, 160).trim() + '...';
      }

      results.push({
        title,
        category,
        excerpt,
        content,
        coverImage,
        focusKeywords,
        author,
        permalink: permalink ? (permalink.startsWith('/') ? permalink : '/' + permalink) : undefined
      });
    });

    return results;
  }, [rawText, availableCategories]);

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let payload: any[] = [];

    if (activeMode === 'files') {
      const selected = uploadedFiles.filter((f) => f.isSelected);
      if (selected.length === 0) {
        alert('Vui lòng chọn ít nhất 1 file để tải lên.');
        return;
      }

      payload = selected.map((f, idx) => {
        const title = (f.title || f.fileName.replace(/\.[^/.]+$/, '')).trim() || `Bài viết mới ${idx + 1}`;
        const content = (f.content || f.excerpt || title).trim();
        const excerpt = (f.excerpt || content.slice(0, 160).replace(/\n/g, ' ')).trim() + '...';

        return {
          title,
          slug: f.slug || `bai-viet-${Date.now()}-${idx}`,
          permalink: f.permalink,
          category: f.category || availableCategories[0] || DEFAULT_CATEGORY,
          excerpt,
          content,
          coverImage: f.coverImage?.trim() || DEFAULT_IMAGE,
          author: f.author || 'Bê Tông An Gia Bình',
          date: f.date || new Date().toISOString().split('T')[0],
          readTime: f.readTime || '5 phút',
          tags: f.tags && f.tags.length > 0 ? f.tags : (f.focusKeywords || '').split(',').map((s) => s.trim()).filter(Boolean),
          focusKeywords: (f.focusKeywords || '').split(',').map((s) => s.trim()).filter(Boolean),
          featured: false
        };
      });
    } else {
      const sourcePosts = activeMode === 'form' ? formPosts : parsedTextPosts;
      const validPosts = sourcePosts.filter((p) => p.title.trim().length > 0);

      if (validPosts.length === 0) {
        alert('Vui lòng nhập ít nhất 1 bài viết hợp lệ có tiêu đề.');
        return;
      }

      payload = validPosts.map((p, idx) => {
        const slug =
          p.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') || `bai-viet-${Date.now()}-${idx}`;

        const content = (p.content || p.excerpt || p.title).trim();
        const excerpt = (p.excerpt || content.slice(0, 160).replace(/\n/g, ' ')).trim() + '...';

        return {
          title: p.title.trim(),
          slug,
          permalink: p.permalink,
          category: p.category || availableCategories[0] || DEFAULT_CATEGORY,
          excerpt,
          content,
          coverImage: p.coverImage?.trim() || DEFAULT_IMAGE,
          author: p.author || 'Bê Tông An Gia Bình',
          date: new Date().toISOString().split('T')[0],
          readTime: `${Math.max(3, Math.ceil(content.split(/\s+/).length / 200))} phút`,
          tags: (p.focusKeywords || '').split(',').map((s: string) => s.trim()).filter(Boolean),
          focusKeywords: (p.focusKeywords || '').split(',').map((s: string) => s.trim()).filter(Boolean),
          featured: false
        };
      });
    }

    const added = batchAddPosts(payload);

    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch {}

    try {
      const allPosts = getGlobalStore().posts;
      fetch('/api/admin/persist-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: allPosts })
      }).catch(() => {});
    } catch {}

    if (onSuccess) onSuccess(added.length);
    alert(`Đã tải lên và xuất bản thành công ${added.length} bài viết mới vào hệ thống Blog!`);
    onClose();
  };

  if (!isOpen) return null;

  const totalReadyCount =
    activeMode === 'files'
      ? uploadedFiles.filter((f) => f.isSelected).length
      : activeMode === 'form'
      ? formPosts.filter((p) => p.title.trim()).length
      : parsedTextPosts.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Nhập Nhiều Bài Viết Cùng Lúc (Bulk Import)
              </h3>
              <p className="text-xs text-slate-500">
                Hỗ trợ chọn nhiều file .md cùng lúc từ máy tính, dán văn bản hàng loạt hoặc điền biểu mẫu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center text-sm font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-3 pb-1 border-b border-slate-200 flex items-center gap-2 text-xs font-bold bg-white overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveMode('files')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeMode === 'files'
                ? 'border-amber-500 text-amber-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-amber-500" />
            <span>Tải Lên Nhiều File .md ({uploadedFiles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('form')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeMode === 'form'
                ? 'border-amber-500 text-amber-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Điền Biểu Mẫu Nhiều Bài ({formPosts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('markdown')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeMode === 'markdown'
                ? 'border-amber-500 text-amber-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Dán Nhiều Bài (Markdown / JSON)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: MULTI-FILE .MD UPLOAD */}
          {activeMode === 'files' && (
            <div className="space-y-6">
              {/* File Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50/80 scale-[0.99]'
                    : 'border-slate-300 hover:border-amber-500 hover:bg-slate-50/80 bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".md,.markdown,.txt"
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center">
                  <UploadCloud className="w-7 h-7 animate-pulse" />
                </div>

                <div className="space-y-1 max-w-lg">
                  <p className="font-extrabold text-sm text-slate-900">
                    Nhấp để chọn nhiều file .md cùng lúc (hoặc Kéo &amp; Thả vào đây)
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Bạn có thể giữ phím <strong>Ctrl</strong> (Windows) hoặc <strong>Cmd</strong> (Mac) / <strong>Shift</strong> để chọn hàng chục file .md cùng lúc. Hệ thống tự động bóc tách tiêu đề, chuyên mục, ngày tháng và nội dung chuẩn Jekyll Markdown.
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-xs transition">
                    <Files className="w-3.5 h-3.5" />
                    <span>Chọn Nhiều File .md Từ Máy Tính</span>
                  </span>
                </div>
              </div>

              {/* Uploaded Files Table / Manager */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800 select-none">
                        <input
                          type="checkbox"
                          checked={
                            uploadedFiles.length > 0 &&
                            uploadedFiles.every((f) => f.isSelected)
                          }
                          onChange={(e) => handleToggleSelectAll(e.target.checked)}
                          className="w-4 h-4 accent-amber-600 rounded"
                        />
                        <span>
                          Chọn tất cả ({uploadedFiles.filter((f) => f.isSelected).length}/{uploadedFiles.length} file)
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => setUploadedFiles([])}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa danh sách</span>
                      </button>
                    </div>

                    {/* Bulk category assign */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs text-slate-600 whitespace-nowrap font-medium">Gán chuyên mục cho các file đã chọn:</span>
                      <select
                        value={bulkCategoryTarget}
                        onChange={(e) => setBulkCategoryTarget(e.target.value)}
                        className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:border-amber-500"
                      >
                        <option value="">-- Chọn chuyên mục --</option>
                        {availableCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleApplyBulkCategory}
                        disabled={!bulkCategoryTarget}
                        className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
                      >
                        Áp Dụng
                      </button>
                    </div>
                  </div>

                  {/* List of files */}
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={file.id}
                        className={`p-4 rounded-2xl border transition space-y-3 ${
                          file.isSelected
                            ? 'bg-white border-amber-300 shadow-2xs'
                            : 'bg-slate-50/70 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={file.isSelected}
                              onChange={() => handleToggleFileSelection(file.id)}
                              className="w-4 h-4 accent-amber-600 rounded shrink-0 cursor-pointer"
                            />
                            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                              {idx + 1}
                            </div>
                            <div className="truncate flex-1">
                              <span className="font-mono text-xs text-slate-500 font-medium mr-2">
                                {file.fileName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                ({file.fileSize} • {file.readTime})
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveFile(file.id)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded transition"
                            title="Xóa khỏi danh sách"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs pl-7">
                          <div className="sm:col-span-8">
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Tiêu đề bài viết
                            </label>
                            <input
                              type="text"
                              value={file.title}
                              onChange={(e) =>
                                handleUpdateFileField(file.id, 'title', e.target.value)
                              }
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:border-amber-500 focus:bg-white"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Chuyên mục
                            </label>
                            <select
                              value={file.category}
                              onChange={(e) =>
                                handleUpdateFileField(file.id, 'category', e.target.value)
                              }
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:border-amber-500 focus:bg-white"
                            >
                              {availableCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {file.permalink ? (
                          <div className="pl-7 flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 font-mono">
                            <span className="font-bold text-emerald-900 shrink-0">URL (permalink từ .md):</span>
                            <span className="truncate">{file.permalink}</span>
                          </div>
                        ) : (
                          <div className="pl-7 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                            <span className="text-slate-400 shrink-0">Đường dẫn:</span>
                            <span className="truncate">/{file.slug}.html</span>
                          </div>
                        )}

                        <div className="pl-7 text-[11px] text-slate-500 line-clamp-1 italic">
                          &ldquo;{file.excerpt}&rdquo;
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MULTI-POST FORM */}
          {activeMode === 'form' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Bạn đang chuẩn bị nhập <strong>{formPosts.length}</strong> bài viết cùng lúc. Bạn có thể nhấn <strong>+ Thêm Bài Viết Nữa</strong> để tạo thêm không giới hạn.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddPostRow}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Thêm Bài Viết Nữa</span>
                </button>
              </div>

              {formPosts.map((post, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs relative"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-extrabold text-sm text-slate-900">
                        {post.title ? post.title : `Bài Viết Số ${idx + 1}`}
                      </span>
                    </div>

                    {formPosts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(idx)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 text-xs flex items-center gap-1 font-semibold"
                        title="Xóa bài viết này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa bài này</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="md:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">
                        Tiêu đề bài viết *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Báo Giá Bê Tông Ninh Bình Mới Nhất..."
                        value={post.title}
                        onChange={(e) => handleUpdateField(idx, 'title', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Chuyên mục
                      </label>
                      <select
                        value={post.category}
                        onChange={(e) => handleUpdateField(idx, 'category', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:border-amber-500 font-medium"
                      >
                        {availableCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Đoạn tóm tắt (Excerpt / Meta SEO)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Tóm tắt 1-2 câu về nội dung bài viết..."
                        value={post.excerpt}
                        onChange={(e) => handleUpdateField(idx, 'excerpt', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Từ khóa SEO (ngăn cách bằng dấu phẩy)
                      </label>
                      <input
                        type="text"
                        placeholder="bê tông ninh bình, bê tông mác 250, an gia bình"
                        value={post.focusKeywords}
                        onChange={(e) =>
                          handleUpdateField(idx, 'focusKeywords', e.target.value)
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:border-amber-500 font-mono text-[11px]"
                      />
                      <label className="block font-bold text-slate-700 mt-2 mb-1">
                        URL hình ảnh bìa
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={post.coverImage}
                        onChange={(e) =>
                          handleUpdateField(idx, 'coverImage', e.target.value)
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block font-bold text-slate-700 mb-1">
                      Nội dung bài viết (Hỗ trợ Markdown &amp; hình ảnh &#123;&#123; site.url &#125;&#125;)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="## 1. Mở đầu&#10;&#10;Nội dung bài viết...&#10;&#10;![Alt]({{ site.url }}/images/blog/anh.jpg)"
                      value={post.content}
                      onChange={(e) => handleUpdateField(idx, 'content', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:border-amber-500 leading-relaxed"
                    />
                  </div>
                </div>
              ))}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleAddPostRow}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold px-5 py-2.5 rounded-xl text-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Thêm Bài Viết Tiếp Theo</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: DÁN NHIỀU BÀI (MARKDOWN / TEXT / JSON) */}
          {activeMode === 'markdown' && (
            <div className="space-y-4 text-xs">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span>Hướng dẫn dán nhiều bài viết cùng lúc:</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Bạn có thể dán nhiều bài viết ngăn cách nhau bởi dòng <code>===</code> hoặc cú pháp Jekyll <code>---</code> có Frontmatter. Hệ thống sẽ tự động tách và nhận diện tiêu đề, chuyên mục, tóm tắt và nội dung của từng bài!
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Dán nội dung các bài viết vào đây:
                </label>
                <textarea
                  rows={10}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={`---
title: Báo Giá Bê Tông Thương Phẩm Mác 200 Tại Ninh Bình
category: Báo Giá & Thị Trường
excerpt: Bảng giá bê tông mác 200 trạm trộn Khánh Phú mới nhất...
---
# Nội dung bài viết 1...
===
---
title: Kỹ Thuật Đổ Bê Tông Cột Vách Nhà Cao Tầng
category: Kỹ Thuật Thi Công
---
# Nội dung bài viết 2...`}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-slate-900 font-mono text-xs focus:border-amber-500 leading-relaxed"
                />
              </div>

              {parsedTextPosts.length > 0 && (
                <div className="space-y-3">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Đã nhận diện thành công {parsedTextPosts.length} bài viết:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                    {parsedTextPosts.map((p, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1"
                      >
                        <div className="font-bold text-slate-900 truncate">
                          {i + 1}. {p.title}
                        </div>
                        <div className="text-[11px] text-amber-600 font-semibold">
                          {p.category}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-2">
                          {p.excerpt}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Độ dài: {p.content.length} ký tự
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Tổng số bài sẵn sàng xuất bản:{' '}
              <strong className="text-slate-900 font-bold text-sm">
                {totalReadyCount} bài
              </strong>
              {activeMode === 'files' && uploadedFiles.length > 0 && (
                <span className="text-slate-400 ml-1">
                  (từ {uploadedFiles.length} file .md đã tải lên)
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={totalReadyCount === 0 || isReadingFiles}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition"
              >
                {isReadingFiles ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang đọc file...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xuất Bản Tất Cả ({totalReadyCount} Bài)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
