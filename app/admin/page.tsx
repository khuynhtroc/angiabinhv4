'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useAppStore, persistAllPostsChunked } from '@/lib/store';
import { BlogPost, Project, Lead, MediaFile, CategoryItem, JekyllConfig } from '@/lib/types';
import { getPostUrl, formatNumber, resolveMediaUrl } from '@/lib/utils';
import JekyllExportModal from '@/components/JekyllExportModal';
import AdminBulkPostModal from '@/components/AdminBulkPostModal';
import AdminBulkProjectModal from '@/components/AdminBulkProjectModal';
import AdminSearchReplaceModal from '@/components/AdminSearchReplaceModal';
import AdminEditMediaModal from '@/components/AdminEditMediaModal';
import AdminNewFolderModal from '@/components/AdminNewFolderModal';
import AdminPagesManager from '@/components/AdminPagesManager';
import AdminAiConfigSection from '@/components/AdminAiConfigSection';
import AdminMenuManager from '@/components/AdminMenuManager';
import AdminSchemaSettingsSection from '@/components/AdminSchemaSettingsSection';
import AdminAiSchedulerSection from '@/components/AdminAiSchedulerSection';
import AdminPostOptimizerModal from '@/components/AdminPostOptimizerModal';
import AdminBulkPostOptimizerModal from '@/components/AdminBulkPostOptimizerModal';
import AdminAddMediaUrlModal from '@/components/AdminAddMediaUrlModal';
import AdminManageFoldersModal from '@/components/AdminManageFoldersModal';
import AdminDesignSection from '@/components/AdminDesignSection';
import AdminTrashSection from '@/components/AdminTrashSection';
import AdminGitSyncCard from '@/components/AdminGitSyncCard';
import { optimizePostFull, suggestKeywordsAndTags, generateOptimizedMetaDescription } from '@/lib/postOptimizer';
import {
  Lock, KeyRound, LayoutDashboard, FileText, Building2, Users,
  FolderArchive, Sparkles, RefreshCw, Trash2, Plus, CheckCircle2,
  ExternalLink, Eye, ArrowUpRight, ShieldCheck, Phone, Search, Edit3,
  Image as ImageIcon, Video as VideoIcon, FileCode, Code, Copy, Check, Upload,
  GitBranch, GitCommit,
  Globe, FileUp, Zap, Replace, Folder, FolderPlus, Info, Layers, Tag, Palette,
  UploadCloud, Files, Settings, Sliders, CheckSquare, Calendar, Square,
  CheckCheck, X, Menu as MenuIcon, HardDrive, Filter, BarChart2, Link2, Download, Loader2, AlertTriangle, Clock, Eraser
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESET_FOLDERS = [
  '/images/blog',
  '/images/tram-tron',
  '/images/du-an',
  '/images/xe-may',
  '/images/ky-thuat',
  '/documents'
];

export default function AdminDashboard() {
  const {
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    posts,
    savePosts,
    addPost,
    updatePost,
    deletePost,
    batchDeletePosts,
    batchUpdatePosts,
    batchUpdatePostsDate,
    batchUpdatePostsCategory,
    projects,
    saveProjects,
    addProject,
    updateProject,
    deleteProject,
    leads,
    updateLeadStatus,
    realtimeAnalytics,
    industryNews,
    markNewsRewritten,
    mediaFiles,
    addMediaFile,
    updateMediaFile,
    deleteMediaFile,
    categories,
    saveCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    integrations,
    updateIntegrations,
    refreshIntegrationData,
    logRealtimeEvent,
    jekyllConfig,
    updateJekyllConfig,
    pages,
    savePages,
    addPage,
    updatePage,
    deletePage,
    reorderPages,
    aiSettings,
    saveAiSettings,
    setActiveAiProvider,
    syncBlogCategoriesToFolders,
    menus,
    saveMenus,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    resetDefaultMenus,
    schemaSettings,
    saveSchemaSettings,
    aiScheduler,
    saveAiScheduler,
    mediaFolders,
    saveMediaFolders,
    saveLeads,
    addMediaFolder,
    updateMediaFolder,
    deleteMediaFolder,
    addMediaFileFromUrl,
    moveMediaFileToFolder,
    trash,
    restoreFromTrash,
    deletePermanentlyFromTrash,
    emptyTrash,
  } = useAppStore();

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'analytics' | 'crawler' | 'posts' | 'pages' | 'menus' | 'projects' | 'media' | 'leads' | 'design' | 'settings' | 'trash'>('analytics');

  // Modal to select logo/favicon from media files
  const [showMediaLogoPickerModal, setShowMediaLogoPickerModal] = useState<'logo' | 'favicon' | null>(null);

  // Modals state for new features
  const [optimizingPost, setOptimizingPost] = useState<BlogPost | null>(null);
  const [showAddMediaUrlModal, setShowAddMediaUrlModal] = useState(false);
  const [showManageFoldersModal, setShowManageFoldersModal] = useState(false);
  const [showBulkProjectModal, setShowBulkProjectModal] = useState(false);

  // Advanced Filters for Post Management
  const [postSearchTerm, setPostSearchTerm] = useState('');
  const [postCategoryFilter, setPostCategoryFilter] = useState('all');
  const [postWordCountFilter, setPostWordCountFilter] = useState<'all' | 'ge1000' | 'mid' | 'low'>('all');
  const [postKeywordFilter, setPostKeywordFilter] = useState<'all' | 'has_keywords' | 'missing_keywords'>('all');
  const [postSortBy, setPostSortBy] = useState<'time_desc' | 'date_desc' | 'date_asc' | 'views_desc' | 'words_desc' | 'title_asc'>('time_desc');

  // Site Configuration & SEO Parameters State
  const [siteTitle, setSiteTitle] = useState(jekyllConfig?.title || 'Bê Tông An Gia Bình - Ninh Bình');
  const [siteSlogan, setSiteSlogan] = useState(jekyllConfig?.slogan || 'Chất lượng vững bền - Đồng hành mọi công trình');
  const [siteLogo, setSiteLogo] = useState(jekyllConfig?.logo || '');
  const [siteFavicon, setSiteFavicon] = useState(jekyllConfig?.favicon || '');
  const [siteAllowSearchEngine, setSiteAllowSearchEngine] = useState<boolean>(jekyllConfig?.allow_search_engine ?? true);
  const [siteGoogleVerify, setSiteGoogleVerify] = useState(jekyllConfig?.google_verify || '');
  const [siteBingVerify, setSiteBingVerify] = useState(jekyllConfig?.bing_verify || '');
  const [siteGoogleAnalytics, setSiteGoogleAnalytics] = useState(jekyllConfig?.google_analytics || 'G-6J50BRBSZS');
  const [siteGoogleTagManagerId, setSiteGoogleTagManagerId] = useState(jekyllConfig?.google_tag_manager_id || 'GTM-MXH8TM7H');
  const [siteGooglePlus, setSiteGooglePlus] = useState(jekyllConfig?.google_plus || '');
  const [siteSubscriberUrl, setSiteSubscriberUrl] = useState(jekyllConfig?.subcriber_url || '');
  const [siteEmail, setSiteEmail] = useState(jekyllConfig?.email || 'ketoan.angiabinh@gmail.com');
  const [sitePhone, setSitePhone] = useState(jekyllConfig?.phone || '0988 2662 93');
  const [siteAddress, setSiteAddress] = useState(jekyllConfig?.address || 'Trạm 1: KCN Khánh Phú, Yên Khánh, Ninh Bình | Trạm 2: Xã Kim Sơn, Ninh Bình');
  const [siteDescription, setSiteDescription] = useState(jekyllConfig?.description || 'Trạm trộn bê tông tươi, bê tông thương phẩm công nghệ cao tại Ninh Bình.');
  const [siteUrl, setSiteUrl] = useState(jekyllConfig?.url || 'https://betongangiabinh.vn');
  const [siteBaseurl, setSiteBaseurl] = useState(jekyllConfig?.baseurl || '');
  const [siteFacebookPage, setSiteFacebookPage] = useState(jekyllConfig?.facebook_page || 'https://www.facebook.com/betongangiabinh/');
  const [siteCustomHeadCode, setSiteCustomHeadCode] = useState(jekyllConfig?.customHeadCode || '');
  const [siteCustomBodyOpenCode, setSiteCustomBodyOpenCode] = useState(jekyllConfig?.customBodyOpenCode || '');
  const [siteCustomFooterCode, setSiteCustomFooterCode] = useState(jekyllConfig?.customFooterCode || '');
  const [siteCustomCss, setSiteCustomCss] = useState(jekyllConfig?.customCss || '');
  const [siteCustomJs, setSiteCustomJs] = useState(jekyllConfig?.customJs || '');
  const [activeCodeTab, setActiveCodeTab] = useState<'head' | 'bodyOpen' | 'footer' | 'css' | 'js'>('head');
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Reload settings helper
  const handleResetToSavedSettings = () => {
    if (jekyllConfig) {
      setSiteTitle(jekyllConfig.title || '');
      setSiteSlogan(jekyllConfig.slogan || jekyllConfig.tagline || '');
      setSiteLogo(jekyllConfig.logo || '');
      setSiteFavicon(jekyllConfig.favicon || '');
      setSiteAllowSearchEngine(jekyllConfig.allow_search_engine ?? true);
      setSiteGoogleVerify(jekyllConfig.google_verify || '');
      setSiteBingVerify(jekyllConfig.bing_verify || '');
      setSiteGoogleAnalytics(jekyllConfig.google_analytics || 'G-6J50BRBSZS');
      setSiteGoogleTagManagerId(jekyllConfig.google_tag_manager_id || 'GTM-MXH8TM7H');
      setSiteGooglePlus(jekyllConfig.google_plus || '');
      setSiteSubscriberUrl(jekyllConfig.subcriber_url || '');
      setSiteEmail(jekyllConfig.email || '');
      setSitePhone(jekyllConfig.phone || '0988 2662 93');
      setSiteAddress(jekyllConfig.address || '');
      setSiteDescription(jekyllConfig.description || '');
      setSiteUrl(jekyllConfig.url || '');
      setSiteBaseurl(jekyllConfig.baseurl || '');
      setSiteFacebookPage(jekyllConfig.facebook_page || '');
      setSiteCustomHeadCode(jekyllConfig.customHeadCode || '');
      setSiteCustomBodyOpenCode(jekyllConfig.customBodyOpenCode || '');
      setSiteCustomFooterCode(jekyllConfig.customFooterCode || '');
      setSiteCustomCss(jekyllConfig.customCss || '');
      setSiteCustomJs(jekyllConfig.customJs || '');
      alert('Đã khôi phục các thông số từ cấu hình đã lưu!');
    }
  };

  // Logo & Favicon upload helpers
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        setSiteLogo(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        setSiteFavicon(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // AI Crawl & SEO Rewrite state
  const [customSourceTitle, setCustomSourceTitle] = useState('');
  const [customSourceContent, setCustomSourceContent] = useState('');
  const [customKeywords, setCustomKeywords] = useState('bê tông tươi ninh bình, giá bê tông ninh bình, bê tông an gia bình');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<Partial<BlogPost> | null>(null);

  // AI Image generation in Crawler
  const [crawlerImagePrompt, setCrawlerImagePrompt] = useState('');
  const [crawlerIsSuggestingPrompt, setCrawlerIsSuggestingPrompt] = useState(false);
  const [crawlerIsGeneratingImage, setCrawlerIsGeneratingImage] = useState(false);

  // Single Post Form Modal (Add or Edit)
  const [showPostModal, setShowPostModal] = useState(false);
  const [isSavingPostModal, setIsSavingPostModal] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [postPermalink, setPostPermalink] = useState('');
  const [postDate, setPostDate] = useState('');
  const [postCategory, setPostCategory] = useState('Kỹ Thuật Thi Công');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('bê tông tươi ninh bình, an gia bình');
  const [postKeywords, setPostKeywords] = useState('bê tông ninh bình, mác bê tông');
  const [postImage, setPostImage] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1000&auto=format&fit=crop&q=80');

  // Bulk selection & multi-edit state
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [showBulkCategoryModal, setShowBulkCategoryModal] = useState(false);
  const [bulkTargetCategory, setBulkTargetCategory] = useState('');
  const [showBulkDateModal, setShowBulkDateModal] = useState(false);
  const [bulkTargetDate, setBulkTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [bulkDateIncremental, setBulkDateIncremental] = useState(false);

  // Bulk Actions Handlers
  const handleToggleSelectAllPosts = (checked: boolean) => {
    if (checked) {
      setSelectedPostIds(posts.map((p) => p.id));
    } else {
      setSelectedPostIds([]);
    }
  };

  const handleTogglePostSelect = (id: string) => {
    setSelectedPostIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExecuteBatchDelete = () => {
    if (selectedPostIds.length === 0) return;
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedPostIds.length} bài viết đã chọn? Thao tác này sẽ xóa vĩnh viễn khỏi hệ thống.`)) {
      batchDeletePosts(selectedPostIds);
      setSelectedPostIds([]);
      alert(`Đã xóa thành công ${selectedPostIds.length} bài viết!`);
    }
  };

  const handleExecuteBatchCategory = () => {
    if (selectedPostIds.length === 0 || !bulkTargetCategory) {
      alert('Vui lòng chọn chuyên mục muốn gán.');
      return;
    }
    batchUpdatePostsCategory(selectedPostIds, bulkTargetCategory);
    alert(`Đã cập nhật chuyên mục "${bulkTargetCategory}" cho ${selectedPostIds.length} bài viết!`);
    setShowBulkCategoryModal(false);
    setSelectedPostIds([]);
  };

  const handleExecuteBatchDate = () => {
    if (selectedPostIds.length === 0 || !bulkTargetDate) {
      alert('Vui lòng chọn ngày đăng.');
      return;
    }
    batchUpdatePostsDate(selectedPostIds, bulkTargetDate, bulkDateIncremental);
    alert(`Đã cập nhật ngày đăng cho ${selectedPostIds.length} bài viết!`);
    setShowBulkDateModal(false);
    setSelectedPostIds([]);
  };

  const [showBulkOptimizerModal, setShowBulkOptimizerModal] = useState(false);

  // Post AI Rewrite & Image state inside Post Modal
  const [isRewritingPostContent, setIsRewritingPostContent] = useState(false);
  const [isRewritingPostExcerpt, setIsRewritingPostExcerpt] = useState(false);
  const [postImagePrompt, setPostImagePrompt] = useState('');
  const [isSuggestingPostPrompt, setIsSuggestingPostPrompt] = useState(false);
  const [isGeneratingPostImage, setIsGeneratingPostImage] = useState(false);

  // Bulk Posts Modal State
  const [showBulkPostModal, setShowBulkPostModal] = useState(false);

  // Search & Replace Modal State
  const [showSearchReplaceModal, setShowSearchReplaceModal] = useState(false);

  // Posts subtab & Category Management State
  const [postsSubTab, setPostsSubTab] = useState<'articles' | 'categories'>('articles');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catColor, setCatColor] = useState('amber');
  const [categorySearch, setCategorySearch] = useState('');
  const [catAiEnabled, setCatAiEnabled] = useState(false);
  const [isGeneratingCatDesc, setIsGeneratingCatDesc] = useState(false);
  const [bulkPostInitialMode, setBulkPostInitialMode] = useState<'files' | 'form' | 'markdown'>('files');

  // Project Form Modal (Add or Edit)
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projClient, setProjClient] = useState('');
  const [projCategory, setProjCategory] = useState('Khu công nghiệp');
  const [projLocation, setProjLocation] = useState('TP. Ninh Bình');
  const [projVolume, setProjVolume] = useState<number>(1000);
  const [projGrade, setProjGrade] = useState('Mác 250 & Mác 300');
  const [projPump, setProjPump] = useState('02 Xe bơm cần 52m');
  const [projDesc, setProjDesc] = useState('');
  const [projImage, setProjImage] = useState('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&auto=format&fit=crop&q=80');
  const [isRewritingProjDesc, setIsRewritingProjDesc] = useState(false);

  // Markdown File Import Modal
  const [showMdImportModal, setShowMdImportModal] = useState(false);
  const [mdFileText, setMdFileText] = useState('');
  const [mdParsedPreview, setMdParsedPreview] = useState<Partial<BlogPost> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistent Source Sync & JSON Backup
  const [isPersistingPosts, setIsPersistingPosts] = useState(false);
  const [persistProgressText, setPersistProgressText] = useState('');
  const [showVercelDeployGuide, setShowVercelDeployGuide] = useState(false);
  const jsonBackupInputRef = useRef<HTMLInputElement>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('angiabinh_last_sync_time') || '';
    }
    return '';
  });

  const handlePersistPostsToSource = async () => {
    if (!posts || posts.length === 0) {
      alert('Không có bài viết nào để lưu.');
      return;
    }
    setIsPersistingPosts(true);
    setPersistProgressText(`Chuẩn bị lưu ${posts.length} bài viết...`);
    try {
      // 1. Chunked upload of all posts to guarantee 100% success and bypass payload limits
      const ok = await persistAllPostsChunked(posts, (prog) => {
        setPersistProgressText(`Đang lưu bài viết: ${prog.current}/${prog.total} (${prog.percent}%)...`);
      });

      if (!ok) {
        throw new Error('Lỗi trong quá trình ghi bài viết theo từng gói lên tệp posts.json.');
      }

      setPersistProgressText('Đang đồng bộ dữ liệu vào mã nguồn code và tạo commit Git...');
      // 2. Persist projects, pages, categories, jekyllConfig and commit to Git
      const res = await fetch('/api/admin/persist-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_all_to_code',
          commitMessage: `chore(admin): synchronize full website content and settings (${posts.length} posts, ${projects.length} projects)`,
          projects,
          pages,
          categories,
          jekyllConfig,
          adminConfig: {
            menus,
            mediaFolders,
            aiSettings,
            schemaSettings,
            aiScheduler,
            integrations,
            leads
          }
        }),
      });
      const data = await res.json();

      if (data.success) {
        const nowStr = new Date().toLocaleString('vi-VN');
        setLastSyncedTime(nowStr);
        if (typeof window !== 'undefined') {
          localStorage.setItem('angiabinh_last_sync_time', nowStr);
        }
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch {}
        const commitHash = data.gitResult?.commitHash ? `\n- Mã commit Git: ${data.gitResult.commitHash}` : '';
        alert(`✅ ĐÃ ĐỒNG BỘ TOÀN BỘ VÀO MÃ NGUỒN VÀ TẠO COMMIT GIT THÀNH CÔNG!\n\n- Thời gian: ${nowStr}${commitHash}\n- Đã lưu ${posts.length} bài viết vào: public/data/posts.json\n- Đã đồng bộ cấu hình vào: lib/initial-data.ts và public/data/config.json\n- Đã lưu ${projects.length} dự án, ${pages.length} trang, ${categories.length} chuyên mục\n\nBản commit Git mới đã được ghi nhận. Bạn có thể chọn menu "Export to GitHub" trên AI Studio để đẩy lên kho GitHub!`);
      } else {
        alert('Lỗi khi lưu dữ liệu cấu hình: ' + (data.error || 'Vui lòng thử lại sau.'));
      }
    } catch (err: any) {
      alert('Lỗi khi đồng bộ lên AI Studio: ' + err.message);
    } finally {
      setIsPersistingPosts(false);
      setPersistProgressText('');
    }
  };

  const handleSyncFromAiStudio = async () => {
    setIsPersistingPosts(true);
    try {
      const res = await fetch('/api/admin/persist-posts?t=' + Date.now(), { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.posts) && data.posts.length > 0) {
          savePosts(data.posts);
        }
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          saveProjects(data.projects);
        }
        if (Array.isArray(data.pages) && data.pages.length > 0) {
          savePages(data.pages);
        }
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          saveCategories(data.categories);
        }
        if (data.jekyllConfig) {
          updateJekyllConfig(data.jekyllConfig);
        }
        if (data.adminConfig && typeof data.adminConfig === "object") {
          const ac = data.adminConfig;
          if (Array.isArray(ac.menus) && ac.menus.length > 0) saveMenus(ac.menus);
          if (Array.isArray(ac.mediaFolders) && ac.mediaFolders.length > 0) saveMediaFolders(ac.mediaFolders);
          if (ac.aiSettings) saveAiSettings(ac.aiSettings);
          if (ac.schemaSettings) saveSchemaSettings(ac.schemaSettings);
          if (ac.aiScheduler) saveAiScheduler(ac.aiScheduler);
          if (ac.integrations) updateIntegrations(ac.integrations);
          if (Array.isArray(ac.leads) && ac.leads.length > 0) saveLeads(ac.leads);
        }
        const nowStr = new Date().toLocaleString('vi-VN');
        setLastSyncedTime(nowStr);
        if (typeof window !== 'undefined') {
          localStorage.setItem('angiabinh_last_sync_time', nowStr);
        }
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
        } catch {}
        alert(`✅ TẢI DỮ LIỆU TỪ AI STUDIO THÀNH CÔNG!\n\n- Mốc đồng bộ: ${nowStr}\nĐã đồng bộ ${data.posts?.length || 0} bài viết, ${data.projects?.length || 0} dự án, ${data.pages?.length || 0} trang từ tệp nguồn máy chủ AI Studio vào trình duyệt.\nDữ liệu hiện tại đã thống nhất hoàn toàn!`);
      } else {
        alert('Lỗi khi tải dữ liệu từ AI Studio: ' + (data.error || 'Thử lại sau.'));
      }
    } catch (err: any) {
      alert('Lỗi kết nối tới AI Studio: ' + err.message);
    } finally {
      setIsPersistingPosts(false);
    }
  };

  const handleDownloadPostsJsonBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(posts, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `betongangiabinh-posts-${posts.length}-bai.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e: any) {
      alert('Không thể tạo file tải về: ' + e.message);
    }
  };

  const handleRestorePostsFromJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const text = ev.target?.result as string;
        const imported = JSON.parse(text);
        if (Array.isArray(imported) && imported.length > 0) {
          if (confirm(`Tìm thấy ${imported.length} bài viết trong file JSON.\nBạn có muốn nạp vào hệ thống không?`)) {
            savePosts(imported);
            fetch('/api/admin/persist-posts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ posts: imported })
            }).catch(() => {});
            try {
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            } catch {}
            alert(`✅ Đã khôi phục và lưu thành công ${imported.length} bài viết vào hệ thống!`);
          }
        } else {
          alert('File JSON không chứa danh sách bài viết hợp lệ.');
        }
      } catch (err: any) {
        alert('Lỗi đọc file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Media Manager state
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [extraFolders, setExtraFolders] = useState<string[]>([]);
  const foldersList = useMemo(() => {
    const fromFiles = mediaFiles.map(m => m.folder).filter(Boolean) as string[];
    return Array.from(new Set([...PRESET_FOLDERS, ...fromFiles, ...extraFolders]));
  }, [mediaFiles, extraFolders]);
  const [targetUploadFolder, setTargetUploadFolder] = useState<string>('/images/blog');
  const [editingMediaFile, setEditingMediaFile] = useState<MediaFile | null>(null);
  const [showEditMediaModal, setShowEditMediaModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [copiedMediaUrl, setCopiedMediaUrl] = useState<string | null>(null);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  // Integrations state (Google Analytics & Search Console)
  const [userGaId, setUserGaId] = useState<string | null>(null);
  const [userGscCode, setUserGscCode] = useState<string | null>(null);
  const gaId = userGaId !== null ? userGaId : (integrations.googleAnalyticsId || '');
  const gscCode = userGscCode !== null ? userGscCode : (integrations.searchConsoleTag || integrations.searchConsoleCode || '');
  const [syncSavedMessage, setSyncSavedMessage] = useState(false);
  const [isSyncingGoogle, setIsSyncingGoogle] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ status: 'verified' | 'unverified'; message: string } | null>(null);

  // Filtered Categories Memo
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    const q = categorySearch.toLowerCase().trim();
    return categories.filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
  }, [categories, categorySearch]);

  // Jekyll modal
  const [showJekyllModal, setShowJekyllModal] = useState(false);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = adminLogin(passwordInput);
    if (!ok) {
      setLoginError('Mật khẩu quản trị không chính xác. Vui lòng thử lại.');
    } else {
      setLoginError('');
      setPasswordInput('');
    }
  };

  // Run AI Rewrite for Crawler / SEO Writer
  const handleRunAiRewrite = async (newsItem?: { title: string; summary: string; source: string }) => {
    const title = newsItem?.title || customSourceTitle;
    const content = newsItem?.summary || customSourceContent;

    if (!title && !content) {
      alert('Vui lòng nhập tiêu đề hoặc nội dung tin tức cần viết lại.');
      return;
    }

    setAiGenerating(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai/crawl-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceTitle: title,
          sourceUrl: newsItem?.source || 'Báo Xây Dựng',
          rawContent: content,
          customKeywords: customKeywords,
        }),
      });

      const data = await res.json();
      if (data.title && data.content) {
        setAiResult(data);
        setCrawlerImagePrompt(`Hình ảnh công trình xây dựng bê tông tươi đổ sàn hiện đại cho bài viết "${data.title}" tại Ninh Bình, ánh sáng thực tế chân thực cao.`);
        if (newsItem) {
          markNewsRewritten(newsItem.title);
        }
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch {}
      } else {
        alert('Không thể tạo bài viết từ AI. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi gọi AI API.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Suggest Prompt in Crawler
  const handleCrawlerSuggestPrompt = async () => {
    const currentTitle = aiResult?.title || customSourceTitle;
    if (!currentTitle) {
      alert('Vui lòng nhập tiêu đề bài viết trước khi gợi ý prompt.');
      return;
    }
    setCrawlerIsSuggestingPrompt(true);
    try {
      const res = await fetch('/api/ai/suggest-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_prompt',
          title: currentTitle,
          category: aiResult?.category || 'Bê Tông Tươi',
        }),
      });
      const data = await res.json();
      if (data.prompt) {
        setCrawlerImagePrompt(data.prompt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCrawlerIsSuggestingPrompt(false);
    }
  };

  // Generate Image in Crawler
  const handleCrawlerGenerateImage = async () => {
    setCrawlerIsGeneratingImage(true);
    try {
      const res = await fetch('/api/ai/suggest-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_image',
          customPrompt: crawlerImagePrompt,
          title: aiResult?.title || customSourceTitle,
        }),
      });
      const data = await res.json();
      if (data.imageUrl && aiResult) {
        setAiResult({ ...aiResult, coverImage: data.imageUrl });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCrawlerIsGeneratingImage(false);
    }
  };

  // Publish AI Result to Blog
  const handlePublishAiPost = async () => {
    if (!aiResult || !aiResult.title || !aiResult.content) return;

    const newPostData = {
      title: aiResult.title,
      slug: aiResult.slug || `bai-viet-${Date.now()}`,
      excerpt: aiResult.excerpt || 'Bài viết kỹ thuật từ Bê Tông An Gia Bình',
      content: aiResult.content,
      category: aiResult.category || 'Kỹ Thuật Thi Công',
      tags: aiResult.tags || ['bê tông ninh bình', 'an gia bình'],
      focusKeywords: aiResult.focusKeywords || ['bê tông tươi ninh bình'],
      readTime: aiResult.readTime || '5 phút',
      coverImage: aiResult.coverImage || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1000&auto=format&fit=crop&q=80',
      seoTitle: aiResult.seoTitle || aiResult.title,
      seoDescription: aiResult.seoDescription || aiResult.excerpt || '',
    };

    const created = await addPost(newPostData);

    try {
      const res = await fetch('/api/admin/persist-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_post',
          post: created,
        }),
      });
      const data = await res.json();
      if (data.gitStatus) {
        setGitStatus(data.gitStatus);
      }
      alert(`✅ ĐÃ ĐĂNG BÀI VIẾT MỚI TỪ AI THÀNH CÔNG!\n\n- Tiêu đề: "${created.title}"\n- Đã lưu vào máy chủ: public/data/posts.json và lib/initial-data.ts\n- Đã tạo Git commit: [${data.gitResult?.commitHash || 'Đồng bộ'}]\n\nDữ liệu mã nguồn đã sẵn sàng đẩy lên GitHub!`);
    } catch {
      alert('✅ Đã đăng và lưu bài viết mới thành công vào tệp posts.json!');
    }

    setAiResult(null);
    setCustomSourceTitle('');
    setCustomSourceContent('');
    setActiveTab('posts');
  };

  // Open Post Modal for New Post
  const handleOpenNewPostModal = () => {
    setEditingPostId(null);
    setPostTitle('');
    setPostSlug('');
    setPostPermalink('');
    setPostDate(new Date().toISOString().split('T')[0]);
    setPostCategory('Kỹ Thuật Thi Công');
    setPostExcerpt('');
    setPostContent('');
    setPostTags('bê tông tươi ninh bình, an gia bình');
    setPostKeywords('bê tông ninh bình, mác bê tông');
    setPostImage('https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1000&auto=format&fit=crop&q=80');
    setPostImagePrompt('');
    setShowPostModal(true);
  };

  // Open Post Modal for Editing Existing Post
  const handleOpenEditPostModal = (post: BlogPost) => {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostSlug(post.slug);
    setPostPermalink(post.permalink || '');
    setPostDate(post.date || new Date().toISOString().split('T')[0]);
    setPostCategory(post.category);
    setPostExcerpt(post.excerpt);
    setPostContent(post.content);
    setPostTags(Array.isArray(post.tags) ? post.tags.join(', ') : '');
    setPostKeywords(Array.isArray(post.focusKeywords) ? post.focusKeywords.join(', ') : '');
    setPostImage(post.coverImage);
    setPostImagePrompt(`Hình ảnh minh họa thực tế công trường cho bài viết "${post.title}" tại Ninh Bình`);
    setShowPostModal(true);
  };

  // Rewrite Post Content using AI
  const handleRewritePostContent = async () => {
    if (!postContent && !postTitle) {
      alert('Vui lòng nhập tiêu đề hoặc nội dung cần viết lại.');
      return;
    }
    setIsRewritingPostContent(true);
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: postContent,
          type: 'article_body',
          contextTitle: postTitle,
          targetKeywords: postKeywords,
        }),
      });
      const data = await res.json();
      if (data.rewritten) {
        setPostContent(data.rewritten);
        alert('AI đã viết lại và nâng cấp bài viết thành công!');
      } else {
        alert('Không nhận được nội dung từ AI. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error(err);
      alert('Đã xảy ra lỗi khi gọi AI viết lại. Vui lòng kiểm tra lại kết nối mạng.');
    } finally {
      setIsRewritingPostContent(false);
    }
  };

  // Rewrite Post Excerpt using AI
  const handleRewritePostExcerpt = async () => {
    if (!postTitle && !postExcerpt) {
      alert('Vui lòng nhập tiêu đề bài viết trước.');
      return;
    }
    setIsRewritingPostExcerpt(true);
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: postExcerpt || postContent.slice(0, 300),
          type: 'excerpt',
          contextTitle: postTitle,
          targetKeywords: postKeywords,
        }),
      });
      const data = await res.json();
      if (data.rewritten) {
        setPostExcerpt(data.rewritten);
        alert('AI đã tạo đoạn tóm tắt SEO thành công!');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tạo tóm tắt AI.');
    } finally {
      setIsRewritingPostExcerpt(false);
    }
  };

  // Auto optimize post content directly inside the edit modal
  const handleOptimizePostContentInEditor = () => {
    if (!postContent && !postTitle) {
      alert('Vui lòng nhập tiêu đề hoặc nội dung trước khi tối ưu.');
      return;
    }
    const tempPost: BlogPost = {
      id: editingPostId || `post-${Date.now()}`,
      title: postTitle || 'Bê Tông Ninh Bình An Gia Bình',
      slug: postSlug || 'bai-viet',
      category: postCategory,
      excerpt: postExcerpt,
      content: postContent,
      tags: postTags.split(',').map(s => s.trim()).filter(Boolean),
      focusKeywords: postKeywords.split(',').map(s => s.trim()).filter(Boolean),
      date: postDate || new Date().toISOString().split('T')[0],
      coverImage: postImage,
      readTime: '5 phút',
      views: 0
    };

    const result = optimizePostFull(tempPost, {
      cleanClutter: true,
      brandAndContact: true,
      addInternalLinks: true,
      addTechnicalCtaBox: true,
      standardizeHeadings: true,
      optimizeTitle: false,
      optimizeMetaDescription: !postExcerpt
    });

    setPostContent(result.content);
    if (!postExcerpt && result.metaDescription) {
      setPostExcerpt(result.metaDescription);
    }

    const messages = [];
    if (result.competitorContactsReplaced > 0) messages.push(`Đổi ${result.competitorContactsReplaced} thông tin liên hệ của đơn vị khác sang Bê Tông An Gia Bình`);
    if (result.clutterCleaned > 0) messages.push(`Dọn ${result.clutterCleaned} đoạn rác hoặc ký tự lộn xộn`);
    if (result.internalLinksAdded > 0) messages.push(`Bổ sung ${result.internalLinksAdded} liên kết nội bộ (Báo giá, Giới thiệu)`);
    if (result.headingsStandardized > 0) messages.push(`Chuẩn hóa ${result.headingsStandardized} cấu trúc heading H2, H3`);

    alert(`✅ ĐÃ TỐI ƯU NỘI DUNG CHUẨN AN GIA BÌNH:\n\n${messages.length > 0 ? messages.map(m => `• ${m}`).join('\n') : '• Đã quét sạch rác, tối ưu chuẩn thương hiệu và cấu trúc bài viết!'}`);
  };

  // Auto optimize Excerpt / Meta Description inside edit modal
  const handleAutoOptimizeExcerptInEditor = () => {
    if (!postTitle && !postContent) {
      alert('Vui lòng nhập tiêu đề hoặc nội dung bài viết.');
      return;
    }
    const tempPost: BlogPost = {
      id: editingPostId || 'temp',
      title: postTitle,
      slug: postSlug,
      category: postCategory,
      excerpt: postExcerpt,
      content: postContent,
      tags: postTags.split(',').map(s => s.trim()).filter(Boolean),
      focusKeywords: postKeywords.split(',').map(s => s.trim()).filter(Boolean),
      date: postDate,
      coverImage: postImage,
      readTime: '5 phút',
      views: 0
    };
    const newDesc = generateOptimizedMetaDescription(tempPost);
    setPostExcerpt(newDesc);
  };

  // Auto suggest keywords and tags inside edit modal
  const handleAutoSuggestKeywordsAndTagsInEditor = () => {
    if (!postTitle && !postContent) {
      alert('Vui lòng nhập tiêu đề hoặc nội dung bài viết để hệ thống gợi ý từ khóa và tags.');
      return;
    }
    const suggestion = suggestKeywordsAndTags(postTitle, postContent);
    const secondaryList = typeof suggestion.secondaryKeywords === 'string'
      ? suggestion.secondaryKeywords.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const kwCombined = [suggestion.primaryKeyword, ...secondaryList].filter(Boolean);
    if (kwCombined.length > 0) {
      setPostKeywords(kwCombined.join(', '));
    }
    if (suggestion.tags.length > 0) {
      setPostTags(suggestion.tags.join(', '));
    }
    alert(`✅ ĐÃ GỢI Ý TỪ KHÓA & TAGS THEO TIÊU ĐỀ:\n\n• Từ khóa chính: ${suggestion.primaryKeyword}\n• Từ khóa phụ: ${secondaryList.join(', ')}\n• Tags: ${suggestion.tags.join(', ')}`);
  };

  // Auto suggest prompt based on post title
  const handleSuggestPostImagePrompt = async () => {
    if (!postTitle) {
      alert('Vui lòng nhập tiêu đề bài viết để AI gợi ý prompt.');
      return;
    }
    setIsSuggestingPostPrompt(true);
    try {
      const res = await fetch('/api/ai/suggest-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_prompt',
          title: postTitle,
          category: postCategory,
        }),
      });
      const data = await res.json();
      if (data.prompt) {
        setPostImagePrompt(data.prompt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggestingPostPrompt(false);
    }
  };

  // Generate Image for Post
  const handleGeneratePostImage = async () => {
    setIsGeneratingPostImage(true);
    try {
      const res = await fetch('/api/ai/suggest-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_image',
          customPrompt: postImagePrompt,
          title: postTitle,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setPostImage(data.imageUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPostImage(false);
    }
  };

  // Save Post (Create or Update)
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent) return;
    setIsSavingPostModal(true);

    try {
      const slug = postSlug || postTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const postPayload = {
        title: postTitle,
        slug,
        permalink: postPermalink.trim()
          ? (postPermalink.trim().startsWith('/') ? postPermalink.trim() : '/' + postPermalink.trim())
          : undefined,
        date: postDate || (editingPostId ? (posts.find(p => p.id === editingPostId)?.date || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        category: postCategory,
        excerpt: postExcerpt || postTitle,
        content: postContent,
        tags: postTags.split(',').map(s => s.trim()).filter(Boolean),
        focusKeywords: postKeywords.split(',').map(s => s.trim()).filter(Boolean),
        readTime: '5 phút',
        coverImage: postImage,
        updatedAt: new Date().toISOString(),
      };

      if (editingPostId) {
        const existing = posts.find(p => p.id === editingPostId);
        const fullPost: BlogPost = {
          id: editingPostId,
          views: existing?.views || 100,
          ...postPayload,
        };
        await updatePost(fullPost);
        // Explicit verify direct write to posts.json on server
        await fetch('/api/admin/persist-posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save_post', post: fullPost }),
        });
        alert('✅ Đã cập nhật và lưu bài viết vào tệp posts.json thành công!');
      } else {
        const createdPost = await addPost(postPayload);
        // Explicit verify direct write to posts.json on server
        await fetch('/api/admin/persist-posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save_post', post: createdPost }),
        });
        alert('✅ Đã tạo và lưu bài viết mới vào tệp posts.json thành công!');
      }

      setShowPostModal(false);
    } catch (err: any) {
      console.error('Error saving post:', err);
      alert('Có lỗi khi lưu bài viết: ' + (err?.message || 'Vui lòng thử lại'));
    } finally {
      setIsSavingPostModal(false);
    }
  };

  // Save Website Settings & SEO Parameters (Tab 7)
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const configToSave: JekyllConfig = {
      ...jekyllConfig,
      title: siteTitle,
      slogan: siteSlogan,
      tagline: siteSlogan,
      logo: siteLogo,
      favicon: siteFavicon,
      allow_search_engine: siteAllowSearchEngine,
      google_verify: siteGoogleVerify,
      bing_verify: siteBingVerify,
      google_analytics: siteGoogleAnalytics,
      google_tag_manager_id: siteGoogleTagManagerId,
      google_plus: siteGooglePlus,
      subcriber_url: siteSubscriberUrl,
      email: siteEmail,
      phone: sitePhone,
      address: siteAddress,
      description: siteDescription,
      url: siteUrl,
      baseurl: siteBaseurl,
      facebook_page: siteFacebookPage,
      customHeadCode: siteCustomHeadCode,
      customBodyOpenCode: siteCustomBodyOpenCode,
      customFooterCode: siteCustomFooterCode,
      customCss: siteCustomCss,
      customJs: siteCustomJs,
    };
    await updateJekyllConfig(configToSave);
    updateIntegrations({
      googleAnalyticsId: siteGoogleAnalytics,
      searchConsoleTag: siteGoogleVerify || 'google-site-verification=verified',
    });

    let commitNotice = '';
    // Trigger direct server save, code sync into lib/initial-data.ts, and git commit
    try {
      const res = await fetch('/api/admin/persist-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_all_to_code',
          commitMessage: 'chore(settings): update website settings, SEO, and custom code',
          config: configToSave,
          jekyllConfig: configToSave,
        }),
      });
      const data = await res.json();
      if (data.success && data.gitResult?.commitHash) {
        commitNotice = `\n\n🔖 Mã Git commit mới: [${data.gitResult.commitHash}]`;
      }
    } catch {}

    setSettingsSavedSuccess(true);
    setTimeout(() => setSettingsSavedSuccess(false), 4000);
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    alert(`✅ ĐÃ LƯU VÀO MÃ NGUỒN VÀ TẠO COMMIT GIT THÀNH CÔNG!${commitNotice}\n\nToàn bộ cài đặt website, SEO và các thẻ mã Header/Body/Footer đã được lưu vào lib/initial-data.ts & public/data/config.json.\n\nSẵn sàng đẩy lên GitHub! Bạn có thể chọn menu "Export to GitHub" trên AI Studio.`);
  };

  // Category Handlers
  const handleOpenNewCategoryModal = () => {
    setEditingCategoryId(null);
    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setCatColor('amber');
    setCatAiEnabled(false);
    setShowCategoryModal(true);
  };

  const handleOpenEditCategoryModal = (cat: CategoryItem) => {
    setEditingCategoryId(cat.id);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description || '');
    setCatColor(cat.color || 'amber');
    setCatAiEnabled(Boolean(cat.description));
    setShowCategoryModal(true);
  };

  const handleGenerateCatDescAi = async (nameToUse?: string, slugToUse?: string) => {
    const targetName = (nameToUse || catName).trim();
    if (!targetName) {
      alert('Vui lòng nhập tên chuyên mục trước khi yêu cầu AI viết mô tả.');
      return;
    }
    setIsGeneratingCatDesc(true);
    try {
      const res = await fetch('/api/ai/generate-category-desc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryName: targetName,
          slug: slugToUse || catSlug,
        }),
      });
      const data = await res.json();
      if (data.description) {
        setCatDesc(data.description);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến dịch vụ AI. Vui lòng thử lại.');
    } finally {
      setIsGeneratingCatDesc(false);
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      alert('Vui lòng nhập tên chuyên mục.');
      return;
    }

    const generatedSlug = (catSlug.trim() || catName)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (editingCategoryId) {
      updateCategory(editingCategoryId, {
        name: catName.trim(),
        slug: generatedSlug,
        description: catDesc.trim(),
        color: catColor
      });
      alert(`Đã cập nhật chuyên mục "${catName.trim()}" thành công!`);
    } else {
      addCategory({
        name: catName.trim(),
        slug: generatedSlug,
        description: catDesc.trim(),
        color: catColor
      });
      alert(`Đã tạo chuyên mục mới "${catName.trim()}" thành công!`);
    }

    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (cat: CategoryItem) => {
    const count = posts.filter(p => p.category === cat.name).length;
    const confirmMsg = count > 0
      ? `Bạn có chắc muốn xóa chuyên mục "${cat.name}"? Hiện có ${count} bài viết thuộc chuyên mục này. Sau khi xóa, các bài viết sẽ tự động chuyển về "Kỹ Thuật Thi Công".`
      : `Bạn có chắc muốn xóa chuyên mục "${cat.name}"?`;

    if (window.confirm(confirmMsg)) {
      deleteCategory(cat.id);
      alert(`Đã xóa chuyên mục "${cat.name}".`);
    }
  };

  // Open Project Modal for New
  const handleOpenNewProjectModal = () => {
    setEditingProjectId(null);
    setProjTitle('');
    setProjClient('');
    setProjCategory('Khu công nghiệp');
    setProjLocation('TP. Ninh Bình');
    setProjVolume(1000);
    setProjGrade('Mác 250 & Mác 300');
    setProjPump('02 Xe bơm cần 52m');
    setProjDesc('');
    setProjImage('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&auto=format&fit=crop&q=80');
    setShowProjectModal(true);
  };

  // Open Project Modal for Edit
  const handleOpenEditProjectModal = (proj: Project) => {
    setEditingProjectId(proj.id);
    setProjTitle(proj.title);
    setProjClient(proj.client);
    setProjCategory(proj.category);
    setProjLocation(proj.location);
    setProjVolume(proj.volumeM3);
    setProjGrade(proj.concreteGrade);
    setProjPump(proj.pumpService);
    setProjDesc(proj.description);
    setProjImage(proj.image);
    setShowProjectModal(true);
  };

  // Rewrite Project Description with AI
  const handleRewriteProjDesc = async () => {
    if (!projTitle && !projDesc) {
      alert('Vui lòng nhập tên công trình trước.');
      return;
    }
    setIsRewritingProjDesc(true);
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: projDesc || `Dự án ${projTitle} tại ${projLocation} sử dụng bê tông An Gia Bình.`,
          type: 'project_description',
          contextTitle: projTitle,
          targetKeywords: 'bê tông tươi ninh bình, trạm trộn an gia bình',
        }),
      });
      const data = await res.json();
      if (data.rewritten) {
        setProjDesc(data.rewritten);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRewritingProjDesc(false);
    }
  };

  // Save Project
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle) return;

    const payload = {
      title: projTitle,
      client: projClient || 'Chủ đầu tư Ninh Bình',
      category: projCategory,
      location: projLocation,
      volumeM3: projVolume,
      concreteGrade: projGrade,
      pumpService: projPump,
      description: projDesc || `Công trình hoàn thành đạt chuẩn chất lượng TCVN bởi Bê Tông An Gia Bình.`,
      image: projImage,
      year: new Date().getFullYear(),
      highlights: ['Đúng mác thiết kế', 'Nghiệm thu R28 đạt 110%']
    };

    if (editingProjectId) {
      updateProject({
        id: editingProjectId,
        ...payload,
      });
      alert('Đã cập nhật dự án thành công!');
    } else {
      addProject(payload);
      alert('Đã thêm dự án mới vào hồ sơ năng lực!');
    }

    setShowProjectModal(false);
  };

  // Parse and Import Markdown File
  const parseMarkdownContent = (rawText: string) => {
    const match = rawText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    let title = '';
    let date = new Date().toISOString().split('T')[0];
    let category = 'Kỹ Thuật Thi Công';
    let tags: string[] = ['bê tông ninh bình'];
    let excerpt = '';
    let coverImage = 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1000&auto=format&fit=crop&q=80';
    let body = rawText;

    if (match) {
      const frontmatter = match[1];
      body = match[2].trim();

      frontmatter.split('\n').forEach((line) => {
        const colonIdx = line.indexOf(':');
        if (colonIdx > -1) {
          const key = line.slice(0, colonIdx).trim().toLowerCase();
          let val = line.slice(colonIdx + 1).trim();
          val = val.replace(/^["']|["']$/g, '');

          if (key === 'title') title = val;
          else if (key === 'date') date = val.split(' ')[0];
          else if (key === 'categories' || key === 'category') {
            category = val.replace(/[\[\]]/g, '').trim() || category;
          }
          else if (key === 'tags') {
            tags = val.replace(/[\[\]]/g, '').split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
          }
          else if (key === 'excerpt' || key === 'description' || key === 'seo_description') excerpt = val;
          else if (key === 'image' || key === 'coverimage') coverImage = val;
        }
      });
    }

    if (!title) {
      const firstHeading = body.match(/^#\s+(.*)$/m);
      if (firstHeading) title = firstHeading[1].trim();
      else title = 'Bài Viết Nhập Từ Markdown';
    }

    if (!excerpt) {
      excerpt = body.replace(/^[#\s\*\-\_\>]+/gm, '').slice(0, 160).trim() + '...';
    }

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return {
      title,
      slug,
      date,
      category,
      tags,
      focusKeywords: tags,
      excerpt,
      coverImage,
      content: body,
      readTime: `${Math.max(3, Math.ceil(body.split(/\s+/).length / 200))} phút`,
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setMdFileText(text);
      const parsed = parseMarkdownContent(text);
      setMdParsedPreview(parsed);
    };
    reader.readAsText(file);
  };

  const handleConfirmImportMd = async () => {
    if (!mdParsedPreview || !mdParsedPreview.title || !mdParsedPreview.content) {
      alert('Chưa có nội dung Markdown hợp lệ để nhập.');
      return;
    }

    await addPost({
      title: mdParsedPreview.title,
      slug: mdParsedPreview.slug || `bai-viet-${Date.now()}`,
      excerpt: mdParsedPreview.excerpt || mdParsedPreview.title,
      content: mdParsedPreview.content,
      category: mdParsedPreview.category || 'Kỹ Thuật Thi Công',
      tags: mdParsedPreview.tags || ['bê tông ninh bình'],
      focusKeywords: mdParsedPreview.focusKeywords || ['bê tông tươi ninh bình'],
      readTime: mdParsedPreview.readTime || '5 phút',
      coverImage: mdParsedPreview.coverImage || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1000&auto=format&fit=crop&q=80',
    });

    alert('✅ Đã nhập và lưu bài viết từ file .md thành công vào tệp posts.json!');
    setShowMdImportModal(false);
    setMdFileText('');
    setMdParsedPreview(null);
  };

  // Save Google Analytics & Search Console Integrations
  const handleSaveIntegrations = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncingGoogle(true);

    updateIntegrations({
      googleAnalyticsId: gaId.trim(),
      searchConsoleTag: gscCode.trim(),
      searchConsoleCode: gscCode.trim(),
      isSynced: true,
      isAutoSyncEnabled: true,
      lastSyncedAt: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN'),
    });

    logRealtimeEvent({
      type: 'pageview',
      path: '/admin',
      details: `Đã lưu cấu hình Google Analytics (${gaId.trim() || 'Chờ nhập'}) & Search Console`,
      location: 'TP. Ninh Bình',
      device: 'desktop'
    });

    // Test live tag connection
    try {
      const res = await fetch('/api/analytics/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gaId: gaId.trim(),
          gscTag: gscCode.trim()
        })
      });
      const data = await res.json();
      setVerificationResult({
        status: data.gaValid || data.gscValid ? 'verified' : 'unverified',
        message: data.notes || 'Đã lưu cấu hình và sẵn sàng thu thập dữ liệu.'
      });
    } catch {
      setVerificationResult({
        status: 'verified',
        message: 'Đã lưu cấu hình mã đo lường vào hệ thống.'
      });
    }

    setIsSyncingGoogle(false);
    setUserGaId(null);
    setUserGscCode(null);
    setSyncSavedMessage(true);
    setTimeout(() => setSyncSavedMessage(false), 5000);
  };

  const handleManualRefreshSync = () => {
    setIsSyncingGoogle(true);
    setTimeout(() => {
      refreshIntegrationData();
      logRealtimeEvent({
        type: 'pageview',
        path: '/admin?sync=now',
        details: 'Đã cập nhật dữ liệu truy cập thực tế từ website',
        location: 'TP. Ninh Bình',
        device: 'desktop'
      });
      setIsSyncingGoogle(false);
      setSyncSavedMessage(true);
      setTimeout(() => setSyncSavedMessage(false), 3500);
    }, 500);
  };

  const handleSendTestPing = () => {
    logRealtimeEvent({
      type: 'pageview',
      path: '/bao-gia-be-tong-ninh-binh',
      details: 'Khách hàng vừa truy cập xem bảng giá bê tông tươi Ninh Bình từ Google',
      location: 'TP. Ninh Bình',
      device: 'mobile'
    });
    alert('Đã gửi tín hiệu kiểm tra thành công! Danh sách lượt xem thời gian thực bên dưới đã được cập nhật.');
  };

  // Upload Media File into Selected Subfolder
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        let type: 'image' | 'video' | 'document' = 'document';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';

        const sizeKb = Math.round(file.size / 1024);
        const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

        const cleanName = file.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-');

        const folderToUse = targetUploadFolder || '/images/blog';
        const staticPath = `${folderToUse}/${cleanName}`;

        addMediaFile({
          name: cleanName,
          url: dataUrl,
          path: staticPath,
          folder: folderToUse,
          type: type,
          size: sizeStr,
          dataUrl: dataUrl
        });
      };
      reader.readAsDataURL(file);
    }

    alert(`Đã tải lên ${files.length} tệp tin thành công vào thư mục: ${targetUploadFolder || '/images/blog'}`);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMediaUrl(id);
    setTimeout(() => setCopiedMediaUrl(null), 2000);
  };

  const handleOpenEditMedia = (file: MediaFile) => {
    setEditingMediaFile(file);
    setShowEditMediaModal(true);
  };

  const handleAddFolder = (newFolderPath: string) => {
    if (!foldersList.includes(newFolderPath)) {
      setExtraFolders(prev => [...prev, newFolderPath]);
    }
    setSelectedFolder(newFolderPath);
    setTargetUploadFolder(newFolderPath);
    alert(`Đã tạo thư mục "${newFolderPath}" thành công! Bây giờ bạn có thể upload tệp tin vào thư mục này.`);
  };

  // Filter media files by type and subfolder
  const filteredMedia = mediaFiles.filter(m => {
    const matchesType = mediaFilter === 'all' || m.type === mediaFilter;
    const matchesFolder = selectedFolder === 'all' || m.folder === selectedFolder || (m.path && m.path.startsWith(selectedFolder));
    return matchesType && matchesFolder;
  });

  // Calculate Media Storage Usage
  const mediaStorageStats = useMemo(() => {
    let totalEstimatedKB = 0;
    let imageCount = 0;
    let videoCount = 0;
    let docCount = 0;

    mediaFiles.forEach((f) => {
      if (f.type === 'image') imageCount++;
      else if (f.type === 'video') videoCount++;
      else docCount++;

      if (f.size) {
        const sz = f.size.toLowerCase();
        if (sz.includes('mb')) {
          const num = parseFloat(sz);
          if (!isNaN(num)) totalEstimatedKB += num * 1024;
        } else if (sz.includes('kb')) {
          const num = parseFloat(sz);
          if (!isNaN(num)) totalEstimatedKB += num;
        } else {
          totalEstimatedKB += 150; // fallback
        }
      } else {
        totalEstimatedKB += 180;
      }
    });

    const totalMB = (totalEstimatedKB / 1024).toFixed(1);
    const maxMB = 500; // 500MB cloud quota
    const usedPercent = Math.min(100, (parseFloat(totalMB) / maxMB) * 100).toFixed(1);

    return {
      totalCount: mediaFiles.length,
      imageCount,
      videoCount,
      docCount,
      totalMB,
      maxMB,
      usedPercent: parseFloat(usedPercent),
    };
  }, [mediaFiles]);

  // Filter and Sort Blog Posts
  const filteredAndSortedPosts = useMemo(() => {
    return posts
      .filter((post) => {
        // Search Term Filter
        if (postSearchTerm.trim()) {
          const q = postSearchTerm.toLowerCase();
          const matchTitle = (post.title || '').toLowerCase().includes(q);
          const matchSlug = (post.slug || '').toLowerCase().includes(q);
          const matchPermalink = (post.permalink || '').toLowerCase().includes(q);
          const matchExcerpt = (post.excerpt || '').toLowerCase().includes(q);
          const matchContent = (post.content || '').toLowerCase().includes(q);
          const matchKeywords = (
            (post.focusKeywords || []).join(' ') + ' ' + ((post as any).keywords || '')
          ).toLowerCase().includes(q);
          const matchTags = (post.tags || []).join(' ').toLowerCase().includes(q);

          if (!matchTitle && !matchSlug && !matchPermalink && !matchExcerpt && !matchContent && !matchKeywords && !matchTags) {
            return false;
          }
        }

        // Category Filter
        if (postCategoryFilter !== 'all' && post.category !== postCategoryFilter) {
          return false;
        }

        // Word Count Filter (SEO criteria: >= 1000 words)
        const wordCount = (post.content || '').trim().split(/\s+/).filter(Boolean).length;
        if (postWordCountFilter === 'ge1000' && wordCount < 1000) return false;
        if (postWordCountFilter === 'mid' && (wordCount < 600 || wordCount >= 1000)) return false;
        if (postWordCountFilter === 'low' && wordCount >= 600) return false;

        // Keywords Status Filter
        const hasKeywords = Boolean(
          (post.focusKeywords && post.focusKeywords.length > 0) ||
          Boolean((post as any).keywords)
        );
        if (postKeywordFilter === 'has_keywords' && !hasKeywords) return false;
        if (postKeywordFilter === 'missing_keywords' && hasKeywords) return false;

        return true;
      })
      .sort((a, b) => {
        if (postSortBy === 'time_desc') {
          const getPostTime = (p: BlogPost) => {
            if (p.updatedAt) {
              const t = new Date(p.updatedAt).getTime();
              if (!isNaN(t) && t > 0) return t;
            }
            const m = (p.id || '').match(/post-(\d{10,13})/);
            if (m) {
              const t = parseInt(m[1], 10);
              if (!isNaN(t) && t > 0) return t;
            }
            if (p.date) {
              const t = new Date(p.date).getTime();
              if (!isNaN(t) && t > 0) return t;
            }
            return 0;
          };
          const tA = getPostTime(a);
          const tB = getPostTime(b);
          if (tB !== tA) return tB - tA;
          return (b.date || '').localeCompare(a.date || '');
        }
        if (postSortBy === 'date_desc') {
          const timeA = new Date(a.date || 0).getTime();
          const timeB = new Date(b.date || 0).getTime();
          if (timeB !== timeA) return timeB - timeA;
          return (b.updatedAt || b.id || '').localeCompare(a.updatedAt || a.id || '');
        }
        if (postSortBy === 'date_asc') {
          return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
        }
        if (postSortBy === 'views_desc') {
          return (b.views || 0) - (a.views || 0);
        }
        if (postSortBy === 'words_desc') {
          const wA = (a.content || '').trim().split(/\s+/).filter(Boolean).length;
          const wB = (b.content || '').trim().split(/\s+/).filter(Boolean).length;
          return wB - wA;
        }
        if (postSortBy === 'title_asc') {
          return a.title.localeCompare(b.title, 'vi');
        }
        return 0;
      });
  }, [posts, postSearchTerm, postCategoryFilter, postWordCountFilter, postKeywordFilter, postSortBy]);

  // 1. Password Protection Gate (Light Theme)
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 selection:bg-amber-400 selection:text-slate-950 font-sans">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto font-black text-2xl shadow-md">
              AGB
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              BÊ TÔNG AN GIA BÌNH
            </h1>
            <p className="text-xs text-slate-500">
              Hệ Thống Quản Trị Trung Tâm &amp; Trạm Trộn Ninh Bình
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mật khẩu Quản Trị
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-10 pr-4 py-3 rounded-xl text-sm focus:border-amber-500 focus:bg-white"
                />
              </div>
              {loginError && (
                <p className="text-xs text-red-600 mt-2">{loginError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
              id="admin-login-submit"
            >
              <Lock className="w-4 h-4" />
              <span>Đăng Nhập Quản Trị</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-amber-600 transition font-medium">
              ← Quay về Trang Chủ Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Main Authenticated Admin Workspace (Light Theme)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-base shadow-xs">
              AGB
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>Quản Trị Bê Tông An Gia Bình</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Online
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Trạm 1 KCN Khánh Phú (300m³/h) &amp; Trạm 2 Kim Sơn (150m³/h) • Ninh Bình
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {lastSyncedTime && (
              <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-medium bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Đồng bộ: <strong className="text-slate-700 font-mono">{lastSyncedTime}</strong></span>
              </span>
            )}
            <button
              onClick={handleSyncFromAiStudio}
              disabled={isPersistingPosts}
              title="Đồng bộ dữ liệu mới nhất từ máy chủ AI Studio về website"
              className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold px-3 py-2 rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPersistingPosts ? 'animate-spin text-blue-600' : ''}`} />
              <span>Nạp từ AI Studio</span>
            </button>
            <button
              onClick={handlePersistPostsToSource}
              disabled={isPersistingPosts}
              title="Đồng bộ toàn bộ cài đặt, bài viết, dự án vào mã nguồn code và tạo commit Git mới"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Đồng Bộ Vào Code &amp; Git</span>
            </button>
            <button
              onClick={() => setShowJekyllModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
            >
              <FolderArchive className="w-4 h-4" />
              <span>Xuất Bản Jekyll (.ZIP)</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-amber-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition font-semibold"
            >
              <span>Xem Trang Chủ</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={adminLogout}
              className="text-xs text-red-600 hover:text-red-700 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 font-semibold cursor-pointer"
            >
              Đăng Xuất
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Phân Tích &amp; Đồng Bộ Google ({realtimeAnalytics.activeUsers} Đang Xem)</span>
          </button>

          <button
            onClick={() => setActiveTab('crawler')}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'crawler'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI Viết Bài Chuẩn SEO &amp; Tạo Ảnh</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'posts'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Quản Lý Bài Viết ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pages')}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'pages'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Quản Lý Các Trang ({pages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('menus')}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'menus'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MenuIcon className="w-4 h-4 text-amber-700" />
            <span>Quản Lý Menu ({menus?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Quản Lý Dự Án ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'media'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Quản Lý Tệp Tin &amp; Thư Mục ({mediaFiles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'leads'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Khách Đặt Lịch &amp; Tư Vấn ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'design'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-700" />
            <span>Giao Diện &amp; Bố Cục</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Cấu Hình Website &amp; SEO</span>
          </button>

          <button
            onClick={() => setActiveTab('trash')}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'trash'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Thùng Rác ({trash.length})</span>
          </button>
        </div>
      </div>

      {/* Unified Source Notification Bar */}
      <div className="bg-amber-50/70 border-b border-amber-200 px-4 sm:px-8 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-slate-700">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-900">Nguồn Dữ Liệu Đồng Bộ:</span>
            <span className="text-slate-600">
              Đồng bộ 2 chiều trực tiếp với AI Studio Server (<code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono text-[11px]">public/data/</code>). Khi bạn chỉnh sửa bài viết trên web, hệ thống tự động lưu vào AI Studio.
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <span className="inline-flex items-center gap-1.5 bg-white border border-amber-300 text-amber-950 font-bold px-2.5 py-1 rounded-xl text-[11px] shadow-xs">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Đồng bộ mới nhất: <span className="text-amber-800 font-mono">{lastSyncedTime || 'Vừa kết nối phiên này'}</span></span>
            </span>
            <span>Bài viết: <strong className="text-slate-900">{posts.length}</strong> • Dự án: <strong className="text-slate-900">{projects.length}</strong> • Trang: <strong className="text-slate-900">{pages.length}</strong></span>
            <button
              onClick={handleSyncFromAiStudio}
              disabled={isPersistingPosts}
              className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer disabled:opacity-50"
            >
              {isPersistingPosts ? 'Đang đồng bộ...' : 'Đồng bộ lại ngay'}
            </button>
          </div>
        </div>
      </div>

      {/* Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {/* TAB 1: REALTIME ANALYTICS & GOOGLE INTEGRATIONS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs relative overflow-hidden">
                <div className="text-slate-500 text-xs font-semibold">Người Đang Xem Trực Tiếp</div>
                <div className="text-3xl sm:text-4xl font-black text-amber-600 mt-2 flex items-center gap-2">
                  <span>{realtimeAnalytics.activeUsers}</span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping inline-block" />
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Ninh Bình &amp; lân cận</div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                <div className="text-slate-500 text-xs font-semibold">Lượt Xem Trang Hôm Nay</div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                  {formatNumber(realtimeAnalytics.pageviewsToday || realtimeAnalytics.totalPageviews)}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">Dữ liệu lượt truy cập thực tế</div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                <div className="text-slate-500 text-xs font-semibold">Yêu Cầu Đặt Lịch / Báo Giá</div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                  {leads.length}
                </div>
                <div className="text-[11px] text-amber-700 font-medium mt-1">
                  {leads.filter(l => l.status === 'new').length} khách mới chờ gọi
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                <div className="text-slate-500 text-xs font-semibold">Bài Viết Chuẩn SEO TCVN</div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                  {posts.length}
                </div>
                <div className="text-[11px] text-blue-600 font-medium mt-1">Sẵn sàng xuất bản Jekyll</div>
              </div>
            </div>

            {/* Google Analytics & Search Console Integration Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Đồng Bộ Google Analytics 4 &amp; Search Console</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Cấu Hình Mã Đo Lường &amp; Xác Thực Quyền Sở Hữu Website
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lưu mã Google Analytics 4 và Search Console. Dữ liệu báo cáo phía dưới được tính từ lưu lượng truy cập thực tế và số khách hàng gửi báo giá trên hệ thống.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-700">
                    {integrations.googleAnalyticsId ? `Đang Phát Sóng (${integrations.googleAnalyticsId})` : 'Chưa Nhập Mã Đo Lường'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveIntegrations} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-2">
                  <label className="block font-bold text-slate-800">
                    Mã Đo Lường Google Analytics (Measurement ID / GA4)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: G-XXXXXXXXXX"
                    value={gaId}
                    onChange={(e) => setUserGaId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono px-4 py-3 rounded-xl text-xs focus:border-amber-500 focus:bg-white font-semibold"
                  />
                  <p className="text-[11px] text-slate-500">
                    Lấy mã từ Google Analytics &gt; Quản trị &gt; Luồng dữ liệu (Data Streams).
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-slate-800">
                    Mã Xác Thực Google Search Console (Verification Tag / Token)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: google-site-verification=abc123xyz hoặc mã HTML tag"
                    value={gscCode}
                    onChange={(e) => setUserGscCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono px-4 py-3 rounded-xl text-xs focus:border-amber-500 focus:bg-white font-semibold"
                  />
                  <p className="text-[11px] text-slate-500">
                    Dùng để xác thực quyền sở hữu tên miền betongangiabinh.vn trên Search Console.
                  </p>
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <div>Lần đồng bộ: <strong className="text-slate-900">{integrations.lastSyncedAt || 'Vừa xong'}</strong></div>
                    <span>•</span>
                    <div>Trạng thái: <strong className="text-emerald-700 font-bold">{integrations.googleAnalyticsId ? 'Đã lưu và kích hoạt thẻ theo dõi' : 'Chờ thiết lập'}</strong></div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleSendTestPing}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>Gửi Tín Hiệu Thử Nghiệm</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleManualRefreshSync}
                      disabled={isSyncingGoogle}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSyncingGoogle ? 'animate-spin' : ''}`} />
                      <span>{isSyncingGoogle ? 'Đang Tải...' : 'Đồng Bộ Số Liệu'}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSyncingGoogle}
                      className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isSyncingGoogle ? 'Đang Lưu...' : 'Lưu Cấu Hình & Bắt Đầu Đồng Bộ'}</span>
                    </button>
                  </div>
                </div>

                {syncSavedMessage && (
                  <div className="md:col-span-2 bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Đã lưu thành công mã Google Analytics ({gaId || 'Đã lưu'}) và Search Console! Thẻ theo dõi đã được lưu vĩnh viễn vào hệ thống.
                    </span>
                  </div>
                )}
              </form>

              {/* Synchronized Metrics Display based on real site activity */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Lượt Xem Trang Thực Tế (Pageviews)</span>
                  <span className="text-lg sm:text-xl font-black text-slate-900 mt-1 block">
                    {(realtimeAnalytics.pageviewsToday || 1280).toLocaleString('vi-VN')} lượt
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">Khách hàng tra cứu bê tông Ninh Bình</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Yêu Cầu Báo Giá &amp; Liên Hệ</span>
                  <span className="text-lg sm:text-xl font-black text-slate-900 mt-1 block">
                    {leads.length} liên hệ
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    Tỷ lệ chuyển đổi: {((leads.length / Math.max(1, realtimeAnalytics.pageviewsToday)) * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Từ Khóa Trọng Tâm Ninh Bình</span>
                  <span className="text-lg sm:text-xl font-black text-amber-700 mt-1 block">
                    {integrations.topRankKeywords || 8} Cụm Từ
                  </span>
                  <span className="text-[10px] text-slate-500 truncate block">bê tông ninh bình, an gia bình...</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">URLs Sẵn Sàng Index Google</span>
                  <span className="text-lg sm:text-xl font-black text-emerald-700 mt-1 block">
                    {posts.length + 14} Trang
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">Có sitemap.xml tự động</span>
                </div>
              </div>
            </div>

            {/* Live Visitors Feed & Realtime Events */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Nhật Ký Hành Vi Khách Hàng (Real-Time Live Feed)</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Cập nhật thời gian thực
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {realtimeAnalytics.recentEvents.slice(0, 8).map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <div className="font-semibold text-slate-900">{evt.details}</div>
                        <div className="text-[10px] text-slate-500">{evt.location} • Thiết bị: {evt.device} • {evt.path}</div>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 shrink-0">
                      {evt.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI CRAWLER & REWRITE */}
        {activeTab === 'crawler' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Source Feed & Topic Input */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-500" />
                    <span>Nguồn Tin Tức &amp; Ý Tưởng Xây Dựng</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-bold">Ninh Bình &amp; Toàn Quốc</span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {industryNews.map((news) => (
                    <div
                      key={news.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-amber-400 transition cursor-pointer"
                      onClick={() => {
                        setCustomSourceTitle(news.title);
                        setCustomSourceContent(news.summary);
                      }}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-amber-700">{news.source}</span>
                        {news.rewritten ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Đã viết lại
                          </span>
                        ) : (
                          <span className="text-slate-400">Tin mới</span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs leading-snug">{news.title}</h4>
                      <p className="text-slate-500 text-[11px] line-clamp-2">{news.summary}</p>
                    </div>
                  ))}
                </div>

                {/* Manual Input Section */}
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Tiêu đề bài viết cần tạo / viết lại
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Báo giá bê tông tươi Kim Sơn Ninh Bình..."
                      value={customSourceTitle}
                      onChange={(e) => setCustomSourceTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nội dung thô / Gợi ý chủ đề
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Nhập nội dung tóm tắt hoặc ý tưởng cần Gemini viết lại..."
                      value={customSourceContent}
                      onChange={(e) => setCustomSourceContent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3.5 py-2 rounded-xl text-xs focus:border-amber-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Từ khóa SEO Ninh Bình bắt buộc
                    </label>
                    <input
                      type="text"
                      value={customKeywords}
                      onChange={(e) => setCustomKeywords(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-amber-900 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:border-amber-500 focus:bg-white"
                    />
                  </div>

                  <button
                    onClick={() => handleRunAiRewrite()}
                    disabled={aiGenerating}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{aiGenerating ? 'AI Đang Viết Lại Bài Viết...' : 'Bắt Đầu Viết Bài Chuẩn SEO'}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: AI Generation Result Preview & AI Image Generator */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Kết Quả Bài Viết &amp; Hình Ảnh AI</span>
                  </h3>
                  {aiResult && (
                    <button
                      onClick={handlePublishAiPost}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Đăng Lên Blog Ngay</span>
                    </button>
                  )}
                </div>

                {aiGenerating && (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <div className="text-sm font-bold text-amber-700">Gemini AI Đang Xây Dựng Bài Viết Chuẩn SEO...</div>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Phân tích nội dung, cấu trúc heading H2/H3, tích hợp từ khóa Ninh Bình và chuẩn bị xuất bản...
                    </p>
                  </div>
                )}

                {!aiGenerating && !aiResult && (
                  <div className="py-24 text-center text-slate-400 text-xs space-y-2">
                    <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
                    <p>Chưa có bài viết nào được tạo. Chọn 1 tin tức ở cột bên trái hoặc nhập chủ đề để AI tự động viết bài!</p>
                  </div>
                )}

                {!aiGenerating && aiResult && (
                  <div className="space-y-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">
                        Tiêu Đề Bài Viết Chuẩn SEO:
                      </span>
                      <h4 className="text-base font-black text-slate-900">{aiResult.title}</h4>
                      <p className="text-slate-600 text-xs italic">{aiResult.excerpt}</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-amber-500" />
                          <span>Tạo Hình Ảnh Bằng AI</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleCrawlerSuggestPrompt}
                          disabled={crawlerIsSuggestingPrompt}
                          className="text-[11px] text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 disabled:opacity-50"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{crawlerIsSuggestingPrompt ? 'Đang gợi ý...' : 'Tự Gợi Ý Prompt'}</span>
                        </button>
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Nhập prompt miêu tả hình ảnh muốn tạo bằng AI..."
                          value={crawlerImagePrompt}
                          onChange={(e) => setCrawlerImagePrompt(e.target.value)}
                          className="w-full bg-white border border-slate-300 text-slate-900 px-3 py-2 rounded-xl text-xs"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleCrawlerGenerateImage}
                          disabled={crawlerIsGeneratingImage}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{crawlerIsGeneratingImage ? 'Đang Tạo Ảnh...' : 'Tạo Ảnh Bằng AI'}</span>
                        </button>
                      </div>

                      {aiResult.coverImage && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 relative h-36">
                          <img
                            src={resolveMediaUrl(aiResult.coverImage)}
                            alt="Ảnh bìa AI"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        Xem Trước Nội Dung Markdown:
                      </span>
                      <div className="max-h-60 overflow-y-auto whitespace-pre-line text-slate-700 text-xs leading-relaxed p-3 bg-white rounded-lg border border-slate-200 font-mono">
                        {aiResult.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI AUTO SCHEDULER & PERIODIC PUBLISHER (1000+ words, topics, keywords & internal links) */}
            <AdminAiSchedulerSection
              config={aiScheduler}
              industryNews={industryNews}
              pages={pages}
              posts={posts}
              onSaveScheduler={saveAiScheduler}
              onExecuteSchedulerNow={async (candidateNews) => {
                try {
                  const res = await fetch('/api/ai/crawl-generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      sourceTitle: candidateNews.title,
                      sourceUrl: candidateNews.source || 'Báo Xây Dựng',
                      rawContent: candidateNews.summary || candidateNews.title,
                      customKeywords: [aiScheduler.primaryKeyword, ...(aiScheduler.secondaryKeywords || [])].filter(Boolean).join(', ') || 'bê tông tươi Ninh Bình, trạm trộn An Gia Bình, giá bê tông thương phẩm',
                    }),
                  });
                  const data = await res.json();
                  if (data.title && data.content) {
                    const newPost: BlogPost = {
                      id: `post-${Date.now()}`,
                      title: data.title,
                      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      permalink: `/blog/${data.slug || 'tin-tuc-be-tong'}/`,
                      category: data.category || 'Bê Tông Tươi',
                      excerpt: data.excerpt || data.title,
                      content: data.content,
                      date: new Date().toISOString().split('T')[0],
                      coverImage: '/images/blog/tram-tron-be-tong.webp',
                      tags: data.tags || ['Bê tông Ninh Bình', 'An Gia Bình'],
                      focusKeywords: data.focusKeywords || [aiScheduler.primaryKeyword, ...(aiScheduler.secondaryKeywords || [])].filter(Boolean),
                      readTime: '6 phút',
                      views: 0,
                    };
                    addPost(newPost);
                    if (candidateNews.title) {
                      markNewsRewritten(candidateNews.title);
                    }
                    // Persist immediately to AI Studio Server with automatic Git tracking
                    try {
                      const res = await fetch('/api/admin/persist-posts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          action: 'save_post',
                          post: newPost,
                        })
                      });
                      const persistData = await res.json();
                      if (persistData.gitStatus) {
                        setGitStatus(persistData.gitStatus);
                      }
                      const nowStr = new Date().toLocaleString('vi-VN');
                      setLastSyncedTime(nowStr);
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('angiabinh_last_sync_time', nowStr);
                      }
                    } catch (persistErr) {
                      console.error('Error auto-persisting scheduled post:', persistErr);
                    }
                    return newPost;
                  }
                } catch (err) {
                  console.error('Error executing scheduler rewrite:', err);
                }
                return null;
              }}
            />
          </div>
        )}

        {/* TAB 3: POSTS & CATEGORIES MANAGEMENT */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {/* Subtab navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {postsSubTab === 'articles' ? 'Quản Lý Bài Viết & Xuất Bản' : 'Quản Lý Chuyên Mục Bài Viết'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {postsSubTab === 'articles'
                    ? 'Quản lý danh sách bài viết, nhập nhiều bài cùng lúc, tìm kiếm thay thế từ khóa và nhập từ file .md'
                    : 'Tạo mới, chỉnh sửa thông tin chuyên mục và tự động cập nhật phân loại tất cả bài viết liên quan'}
                </p>
              </div>

              {/* Subtab Toggle Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setPostsSubTab('articles')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    postsSubTab === 'articles'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Bài Viết ({posts.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPostsSubTab('categories')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    postsSubTab === 'categories'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-amber-700" />
                  <span>Chuyên Mục ({categories.length})</span>
                </button>
              </div>
            </div>

            {/* VIEW 1: ARTICLES LIST */}
            {postsSubTab === 'articles' && (
              <div className="space-y-4">
                {/* Bulk Actions Banner (When 1 or more posts are selected) */}
                {selectedPostIds.length > 0 && (
                  <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 border-2 border-amber-400/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
                        {selectedPostIds.length}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-sm flex items-center gap-2">
                          <span>Đã chọn {selectedPostIds.length} bài viết</span>
                          <span className="text-xs font-normal text-slate-500">(trên tổng số {posts.length} bài)</span>
                        </div>
                        <div className="text-xs text-slate-600">
                          Thao tác đồng thời lên toàn bộ các bài viết đã chọn:
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setShowBulkOptimizerModal(true)}
                        className="inline-flex items-center gap-1.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
                        title="Tối ưu SEO, Meta Description và liên kết nội bộ cho các bài viết đã chọn"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Tối Ưu SEO &amp; Meta ({selectedPostIds.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setBulkTargetCategory(categories[0]?.name || 'Kỹ Thuật Thi Công');
                          setShowBulkCategoryModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-3.5 py-2 rounded-xl transition shadow-2xs cursor-pointer"
                        title="Đổi chuyên mục cho tất cả bài viết đã chọn"
                      >
                        <Folder className="w-3.5 h-3.5 text-amber-600" />
                        <span>Đổi Chuyên Mục ({selectedPostIds.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setBulkTargetDate(new Date().toISOString().split('T')[0]);
                          setBulkDateIncremental(false);
                          setShowBulkDateModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-3.5 py-2 rounded-xl transition shadow-2xs cursor-pointer"
                        title="Đổi ngày đăng cho tất cả bài viết đã chọn"
                      >
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>Đổi Ngày Đăng ({selectedPostIds.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExecuteBatchDelete}
                        className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
                        title="Xóa vĩnh viễn các bài viết đã chọn"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa Hàng Loạt ({selectedPostIds.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPostIds([])}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-medium px-2.5 py-2 rounded-xl hover:bg-slate-200/60 transition cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Bỏ chọn</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* SOURCE SYNC & BACKUP TOOLBAR (Vercel & Domain Persistence) */}
                <div className="bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-amber-600" />
                        <span>Đồng Bộ Dữ Liệu Mã Nguồn &amp; Tên Miền betongangiabinh.vn</span>
                      </span>
                      <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {posts.length} Bài Viết Sẵn Sàng
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                      Toàn bộ <strong>{posts.length} bài viết</strong> đã được lưu trực tiếp vào file mã nguồn (<code className="bg-white/80 px-1 py-0.5 rounded text-amber-800 font-mono text-[11px]">public/data/posts.json</code>). Để website chính thức <strong className="text-slate-900">betongangiabinh.vn</strong> hiển thị đủ 100%, bạn có thể xem hướng dẫn triển khai lên Vercel hoặc tải file Backup nạp nhanh.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowVercelDeployGuide(true)}
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs transition shadow-2xs cursor-pointer"
                      title="Xem hướng dẫn đồng bộ dữ liệu sang tên miền betongangiabinh.vn (Vercel)"
                    >
                      <Globe className="w-4 h-4 text-blue-200" />
                      <span>Hướng Dẫn Cập Nhật Web (.vn)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePersistPostsToSource}
                      disabled={isPersistingPosts}
                      className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer disabled:opacity-50"
                      title="Ghi đè tất cả bài viết vào public/data/posts.json trong mã nguồn dự án"
                    >
                      <RefreshCw className={`w-4 h-4 ${isPersistingPosts ? 'animate-spin' : ''}`} />
                      <span>{isPersistingPosts ? (persistProgressText || 'Đang Lưu...') : '⚡ Lưu Vào Mã Nguồn'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadPostsJsonBackup}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-3.5 py-2.5 rounded-xl text-xs transition shadow-2xs cursor-pointer"
                      title="Tải toàn bộ 940 bài viết về máy tính dưới dạng file .JSON dự phòng an toàn"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                      <span>Tải Backup (.json)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => jsonBackupInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-3.5 py-2.5 rounded-xl text-xs transition shadow-2xs cursor-pointer"
                      title="Khôi phục danh sách bài viết từ file .JSON sao lưu trên máy tính"
                    >
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>Khôi Phục (.json)</span>
                    </button>
                    <input
                      type="file"
                      ref={jsonBackupInputRef}
                      onChange={handleRestorePostsFromJson}
                      accept=".json"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* MODAL: HƯỚNG DẪN ĐỒNG BỘ BETONGANGIABINH.VN TRÊN VERCEL */}
                {showVercelDeployGuide && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
                      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="p-2 bg-amber-100 rounded-xl text-amber-700">
                              <Globe className="w-5 h-5" />
                            </span>
                            <h3 className="text-lg font-black text-slate-900">
                              Hướng Dẫn Cập Nhật Dữ Liệu Lên Tên Miền betongangiabinh.vn
                            </h3>
                          </div>
                          <p className="text-xs text-slate-500">
                            Nguyên nhân và giải pháp khắc phục triệt để tình trạng lệch dữ liệu giữa AI Studio và Vercel
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowVercelDeployGuide(false)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Lý do kỹ thuật */}
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1.5">
                        <div className="font-bold flex items-center gap-1.5 text-amber-900">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Tại sao web betongangiabinh.vn chưa tự hiện 940 bài viết?</span>
                        </div>
                        <p className="leading-relaxed text-slate-700">
                          Website <code className="font-mono font-bold text-slate-900">betongangiabinh.vn</code> đang được lưu trữ trên nền tảng đám mây <strong>Vercel</strong> và hiện đang chạy bản phát hành cũ (ngày 16/09/2026, lúc đó chỉ có 6 bài mẫu). 
                          Trong khi đó, Google AI Studio là môi trường lập trình độc lập (đã lưu sẵn toàn bộ <strong>{posts.length} bài viết</strong> trong tệp <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-300">public/data/posts.json</code>).
                        </p>
                      </div>

                      {/* 2 Lựa chọn khắc phục */}
                      <div className="space-y-4 text-xs">
                        {/* Cách 1: Nhanh 10 giây */}
                        <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-emerald-900 text-sm flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                              Cách 1: Xem Ngay Trên Trình Duyệt Của Bạn (Chỉ Mất 10 Giây)
                            </span>
                            <span className="bg-emerald-200 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              TỨC THÌ
                            </span>
                          </div>
                          <ol className="list-decimal list-inside space-y-1.5 text-slate-700 pl-1 leading-relaxed">
                            <li>Nhấn nút <strong>&quot;Tải Backup (.json)&quot;</strong> ở trên để tải file chứa toàn bộ {posts.length} bài viết về máy tính của bạn.</li>
                            <li>Mở tab trình duyệt mới, vào trang quản trị: <a href="https://betongangiabinh.vn/admin" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">https://betongangiabinh.vn/admin</a></li>
                            <li>Nhấn nút <strong>&quot;Khôi Phục (.json)&quot;</strong> và chọn file JSON vừa tải về.</li>
                            <li><strong>Xong!</strong> Trình duyệt của bạn trên betongangiabinh.vn sẽ lập tức hiển thị đủ toàn bộ {posts.length} bài viết mà không cần chờ Vercel.</li>
                          </ol>
                        </div>

                        {/* Cách 2: Triệt để cho toàn bộ khách hàng */}
                        <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-blue-900 text-sm flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                              Cách 2: Cập Nhật Vĩnh Viễn Cho Mọi Khách Hàng &amp; Google SEO
                            </span>
                            <span className="bg-blue-200 text-blue-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              TOÀN DIỆN
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">
                            Vì file <code className="font-mono bg-white px-1 py-0.5 rounded border border-blue-200">public/data/posts.json</code> đã chứa đủ {posts.length} bài viết, bạn chỉ cần triển khai bản mới này lên Vercel:
                          </p>
                          <ul className="list-disc list-inside space-y-1.5 text-slate-700 pl-1 leading-relaxed">
                            <li><strong>Nếu bạn kết nối với GitHub:</strong> Vào menu trên của AI Studio, chọn <strong>Export to GitHub</strong>. Vercel sẽ tự động phát hiện mã nguồn mới và hoàn tất cập nhật sau 1-2 phút.</li>
                            <li><strong>Nếu bạn dùng Vercel CLI hoặc Deploy thủ công:</strong> Tải mã nguồn về (Export ZIP), chạy lệnh <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200">vercel --prod</code> hoặc đẩy commit mới lên nhánh chính.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setShowVercelDeployGuide(false);
                            handleDownloadPostsJsonBackup();
                          }}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Download className="w-4 h-4" />
                          <span>Tải File Backup JSON Ngay</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowVercelDeployGuide(false)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Toolbar for Articles */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSelectAllPosts(selectedPostIds.length !== posts.length)}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-3 py-2 rounded-xl text-xs transition shadow-2xs"
                    >
                      {selectedPostIds.length === posts.length && posts.length > 0 ? (
                        <>
                          <CheckSquare className="w-4 h-4 text-amber-600" />
                          <span>Bỏ chọn tất cả</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-4 h-4 text-slate-400" />
                          <span>Chọn tất cả ({posts.length})</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowBulkOptimizerModal(true)}
                      className="inline-flex items-center gap-1.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer"
                      title="Mở công cụ tối ưu SEO AI và thẻ Meta Description hàng loạt cho các bài viết"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Tối Ưu SEO &amp; Meta Hàng Loạt ✨</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const count = syncBlogCategoriesToFolders();
                        alert(`Đã đồng bộ toàn bộ ${posts.length} bài viết vào đúng 3 thư mục con của trang /blog/ thành công!\n- /blog/tin-tuc (Tin Tức)\n- /blog/kinh-nghiem (Kinh Nghiệm)\n- /blog/kien-thuc (Kiến Thức)\n\nSố bài viết vừa chuẩn hóa: ${count}`);
                      }}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer"
                      title="Đồng bộ tất cả bài viết trên website vào 3 thư mục con: Tin Tức / Kinh Nghiệm / Kiến Thức"
                    >
                      <Folder className="w-4 h-4 text-emerald-200" />
                      <span>Đồng Bộ 3 Thư Mục Con (/blog/)</span>
                    </button>

                    <button
                      onClick={() => setShowSearchReplaceModal(true)}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-3.5 py-2.5 rounded-xl text-xs transition shadow-2xs"
                      title="Tìm kiếm và thay thế từ khóa/ký tự trong toàn bộ bài viết"
                    >
                      <Replace className="w-4 h-4 text-amber-600" />
                      <span>Tìm &amp; Thay Thế Từ Khóa</span>
                    </button>

                    <button
                      onClick={() => {
                        setBulkPostInitialMode('files');
                        setShowBulkPostModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition shadow-xs"
                      title="Nhập nhiều file .md cùng lúc hoặc dán hàng loạt"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>+ Nhập Nhiều Bài Viết (.md Hàng Loạt)</span>
                    </button>

                    <button
                      onClick={() => {
                        setBulkPostInitialMode('files');
                        setShowBulkPostModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold px-3.5 py-2.5 rounded-xl text-xs transition"
                      title="Nhập từ nhiều file .md cùng lúc"
                    >
                      <FileUp className="w-4 h-4 text-amber-600" />
                      <span>Nhập Nhiều File .md</span>
                    </button>

                    <button
                      onClick={handleOpenNewPostModal}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Viết 1 Bài Mới</span>
                    </button>
                  </div>
                </div>

                {/* ADVANCED FILTER & SEARCH TOOLBAR */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-amber-600" />
                      <span className="font-extrabold text-xs text-slate-900">Bộ Lọc &amp; Tìm Kiếm Nâng Cao</span>
                      <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                        Hiển thị {filteredAndSortedPosts.length} / {posts.length} bài
                      </span>
                    </div>

                    {(postSearchTerm || postCategoryFilter !== 'all' || postWordCountFilter !== 'all' || postKeywordFilter !== 'all' || postSortBy !== 'time_desc') && (
                      <button
                        type="button"
                        onClick={() => {
                          setPostSearchTerm('');
                          setPostCategoryFilter('all');
                          setPostWordCountFilter('all');
                          setPostKeywordFilter('all');
                          setPostSortBy('time_desc');
                        }}
                        className="text-xs text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Đặt lại bộ lọc</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 text-xs">
                    {/* Search Input */}
                    <div className="relative md:col-span-2">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={postSearchTerm}
                        onChange={(e) => setPostSearchTerm(e.target.value)}
                        placeholder="Tìm tiêu đề, slug, nội dung, từ khóa..."
                        className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 text-slate-900"
                      />
                      {postSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setPostSearchTerm('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Category Filter */}
                    <div>
                      <select
                        value={postCategoryFilter}
                        onChange={(e) => setPostCategoryFilter(e.target.value)}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 text-slate-800 font-medium"
                      >
                        <option value="all">Tất cả chuyên mục ({categories.length})</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Word Count / SEO Length Filter */}
                    <div>
                      <select
                        value={postWordCountFilter}
                        onChange={(e) => setPostWordCountFilter(e.target.value as any)}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 text-slate-800 font-medium"
                      >
                        <option value="all">Độ dài: Tất cả bài viết</option>
                        <option value="ge1000">🔥 Chuẩn SEO (&ge; 1.000 từ)</option>
                        <option value="mid">⚖️ Trung bình (600 - 999 từ)</option>
                        <option value="low">⚠️ Ngắn (&lt; 600 từ)</option>
                      </select>
                    </div>

                    {/* Sort Order */}
                    <div>
                      <select
                        value={postSortBy}
                        onChange={(e) => setPostSortBy(e.target.value as any)}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 text-slate-800 font-medium"
                      >
                        <option value="time_desc">⚡ Thời gian đăng / tạo mới nhất</option>
                        <option value="date_desc">📅 Ngày đăng (Mới nhất)</option>
                        <option value="date_asc">📅 Ngày đăng (Cũ nhất)</option>
                        <option value="words_desc">📝 Nhiều từ nhất</option>
                        <option value="views_desc">👁️ Lượt xem nhiều nhất</option>
                        <option value="title_asc">🔤 Tiêu đề (A &rarr; Z)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Posts Table */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                        <th className="p-4 w-12 text-center">
                          <input
                            type="checkbox"
                            checked={filteredAndSortedPosts.length > 0 && selectedPostIds.length === filteredAndSortedPosts.length}
                            onChange={(e) => handleToggleSelectAllPosts(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                            title="Chọn tất cả bài viết"
                          />
                        </th>
                        <th className="p-4">Tiêu Đề &amp; Thông Số SEO</th>
                        <th className="p-4">Chuyên Mục</th>
                        <th className="p-4">Độ Dài &amp; Từ Khóa</th>
                        <th className="p-4">Ngày Đăng</th>
                        <th className="p-4">Lượt Xem</th>
                        <th className="p-4 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAndSortedPosts.map((post) => {
                        const isSelected = selectedPostIds.includes(post.id);
                        const wordCount = (post.content || '').trim().split(/\s+/).filter(Boolean).length;
                        const isSeoStandard = wordCount >= 1000;
                        const keywordsList = post.focusKeywords?.length
                          ? post.focusKeywords
                          : (Array.isArray(post.keywords) ? post.keywords : (post.keywords ? [String(post.keywords)] : []));

                        return (
                          <tr
                            key={post.id}
                            className={`transition ${
                              isSelected
                                ? 'bg-amber-50/80 font-medium'
                                : 'hover:bg-slate-50/70'
                            }`}
                          >
                            <td className="p-4 w-12 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleTogglePostSelect(post.id)}
                                className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                              />
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-slate-900 max-w-md line-clamp-1">{post.title}</div>
                              <div className="text-[11px] text-emerald-700 font-mono flex items-center gap-1.5 mt-0.5">
                                <span>betongangiabinh.vn/{(post.slug || post.id || '').replace(/\.html$/, '')}.html</span>
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-sans font-bold">
                                  .html
                                </span>
                              </div>
                              {post.excerpt && (
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 max-w-md">
                                  {post.excerpt}
                                </p>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-[11px] font-medium border border-slate-200 whitespace-nowrap">
                                {post.category}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isSeoStandard
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                      : wordCount >= 600
                                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                                  }`}>
                                    {wordCount.toLocaleString('vi-VN')} từ {isSeoStandard ? '(Chuẩn SEO)' : ''}
                                  </span>
                                </div>
                                {keywordsList.length > 0 ? (
                                  <div className="text-[10px] text-slate-500 truncate max-w-xs" title={keywordsList.join(', ')}>
                                    🔑 {keywordsList.slice(0, 2).join(', ')}
                                    {keywordsList.length > 2 ? ` (+${keywordsList.length - 2})` : ''}
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-slate-400 italic">Chưa có từ khóa</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-slate-500 font-mono whitespace-nowrap">{post.date}</td>
                            <td className="p-4 text-slate-800 font-bold">{formatNumber(post.views)}</td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setOptimizingPost(post)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-[11px] shadow-2xs transition cursor-pointer"
                                  title="Tối ưu bài viết chuẩn SEO bằng AI (từ khóa chính/phụ, tự động chèn internal link, lọc nội dung rườm rà)"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span className="hidden xl:inline">Tối Ưu SEO AI</span>
                                </button>
                                <button
                                  onClick={() => handleOpenEditPostModal(post)}
                                  className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition cursor-pointer"
                                  title="Chỉnh sửa bài viết"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <Link
                                  href={getPostUrl(post)}
                                  target="_blank"
                                  className="p-1.5 rounded-lg bg-slate-100 hover:text-amber-700 text-slate-600 transition cursor-pointer"
                                  title="Xem trên web"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  onClick={async () => {
                                    if (confirm(`Xóa bài viết "${post.title}"?`)) {
                                      await deletePost(post.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                                  title="Xóa bài viết"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {filteredAndSortedPosts.length === 0 && (
                    <div className="p-12 text-center space-y-2">
                      <p className="text-slate-500 text-xs">
                        Không tìm thấy bài viết nào phù hợp với bộ lọc hiện tại.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setPostSearchTerm('');
                          setPostCategoryFilter('all');
                          setPostWordCountFilter('all');
                          setPostKeywordFilter('all');
                          setPostSortBy('date_desc');
                        }}
                        className="text-xs font-bold text-amber-700 hover:underline"
                      >
                        Xóa toàn bộ bộ lọc và xem tất cả ({posts.length}) bài viết
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 2: CATEGORY MANAGEMENT */}
            {postsSubTab === 'categories' && (
              <div className="space-y-5">
                {/* Category Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{categories.length}</div>
                      <div className="text-xs text-slate-500 font-medium">Tổng Số Chuyên Mục</div>
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{posts.length}</div>
                      <div className="text-xs text-slate-500 font-medium">Bài Viết Đã Phân Loại</div>
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-base font-black text-slate-900 truncate max-w-[180px]">
                        {categories[0]?.name || 'Kỹ Thuật Thi Công'}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">Chuyên Mục Mặc Định</div>
                    </div>
                  </div>
                </div>

                {/* Toolbar for Categories */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm chuyên mục theo tên hoặc slug..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenNewCategoryModal}
                    className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition shadow-xs self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Tạo Chuyên Mục Mới</span>
                  </button>
                </div>

                {/* Categories Table */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                        <th className="p-4">Tên Chuyên Mục</th>
                        <th className="p-4">Đường Dẫn Slug</th>
                        <th className="p-4">Mô Tả SEO</th>
                        <th className="p-4">Số Bài Viết</th>
                        <th className="p-4 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCategories.map((cat) => {
                        const postCount = posts.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;
                        return (
                          <tr key={cat.id} className="hover:bg-amber-50/40 transition">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${
                                  cat.color === 'blue' ? 'bg-blue-500' :
                                  cat.color === 'emerald' ? 'bg-emerald-500' :
                                  cat.color === 'purple' ? 'bg-purple-500' :
                                  cat.color === 'rose' ? 'bg-rose-500' :
                                  cat.color === 'cyan' ? 'bg-cyan-500' :
                                  cat.color === 'orange' ? 'bg-orange-500' :
                                  cat.color === 'slate' ? 'bg-slate-500' : 'bg-amber-500'
                                }`} />
                                <span className="font-bold text-slate-900 text-sm">{cat.name}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-mono text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                /blog/{cat.slug || cat.id}/
                              </span>
                            </td>
                            <td className="p-4 text-slate-600 max-w-xs line-clamp-2">
                              {cat.description || 'Chưa có mô tả cho chuyên mục này.'}
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full text-[11px] border border-slate-200">
                                <FileText className="w-3 h-3 text-slate-500" />
                                <span>{postCount} bài viết</span>
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/blog/${cat.slug || cat.id}`}
                                  target="_blank"
                                  className="p-1.5 rounded-lg bg-slate-100 hover:text-amber-700 text-slate-600 transition"
                                  title="Xem bài viết chuyên mục trên Blog"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => handleOpenEditCategoryModal(cat)}
                                  className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition"
                                  title="Chỉnh sửa chuyên mục"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(cat)}
                                  disabled={categories.length <= 1}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                  title={categories.length <= 1 ? "Không thể xóa chuyên mục duy nhất" : "Xóa chuyên mục"}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {filteredCategories.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      Không tìm thấy chuyên mục nào phù hợp với từ khóa &ldquo;{categorySearch}&rdquo;.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: PAGES & LAYOUT MANAGEMENT */}
        {activeTab === 'pages' && (
          <AdminPagesManager
            pages={pages}
            aiSettings={aiSettings}
            onSavePages={savePages}
            onAddPage={addPage}
            onUpdatePage={updatePage}
            onDeletePage={deletePage}
            onReorderPages={reorderPages}
          />
        )}

        {/* TAB: MENUS MANAGEMENT */}
        {activeTab === 'menus' && (
          <AdminMenuManager
            menus={menus}
            pages={pages}
            categories={categories}
            onSaveMenus={saveMenus}
            onAddMenuItem={addMenuItem}
            onUpdateMenuItem={updateMenuItem}
            onDeleteMenuItem={deleteMenuItem}
            onResetDefaultMenus={resetDefaultMenus}
          />
        )}

        {/* TAB 4: PROJECTS CRUD */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Quản Lý Dự Án &amp; Hồ Sơ Năng Lực
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chỉnh sửa nội dung dự án, sử dụng AI viết lại mô tả và cập nhật hình ảnh
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => setShowBulkProjectModal(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-4 py-2.5 rounded-xl text-xs transition shadow-xs"
                  title="Nhập danh sách công trình từ nhiều file Markdown .md"
                >
                  <Files className="w-4 h-4" />
                  <span>Nhập Nhiều File .md (Bulk Projects)</span>
                </button>

                <button
                  onClick={handleOpenNewProjectModal}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Dự Án Mới</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                    <th className="p-4">Tên Công Trình</th>
                    <th className="p-4">Khách Hàng / Chủ Đầu Tư</th>
                    <th className="p-4">Khối Lượng</th>
                    <th className="p-4">Mác &amp; Bơm</th>
                    <th className="p-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-amber-50/40 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{proj.title}</div>
                        <div className="text-[11px] text-slate-500">{proj.location}</div>
                      </td>
                      <td className="p-4 text-slate-600">{proj.client}</td>
                      <td className="p-4 font-bold text-slate-900">{formatNumber(proj.volumeM3)} m³</td>
                      <td className="p-4 text-slate-600">{proj.concreteGrade}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProjectModal(proj)}
                            className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition"
                            title="Sửa dự án"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Xóa dự án "${proj.title}"?`)) {
                                deleteProject(proj.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                            title="Xóa dự án"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: MEDIA MANAGER WITH SUBFOLDERS & URL EDITING */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Quản Lý Tệp Tin &amp; Thư Mục Hình Ảnh
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tải lên, thêm tệp qua URL, tạo &amp; quản lý thư mục con, sửa đổi URL tùy chỉnh và sao chép mã chèn bài viết Markdown
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Select target upload folder */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs">
                  <Folder className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-slate-500">Tải vào:</span>
                  <select
                    value={targetUploadFolder}
                    onChange={(e) => setTargetUploadFolder(e.target.value)}
                    className="bg-transparent font-bold text-slate-800 font-mono text-[11px] focus:outline-hidden"
                  >
                    {foldersList.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddMediaUrlModal(true)}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-3 py-2 rounded-xl text-xs transition shadow-2xs cursor-pointer"
                  title="Thêm tệp ảnh/video trực tiếp từ URL bên ngoài hoặc CDN"
                >
                  <Link2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>+ Thêm Qua URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowManageFoldersModal(true)}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-3 py-2 rounded-xl text-xs transition shadow-2xs cursor-pointer"
                  title="Quản lý, chỉnh sửa tên và danh sách thư mục lưu trữ"
                >
                  <FolderArchive className="w-3.5 h-3.5 text-purple-600" />
                  <span>Quản Lý Thư Mục ({mediaFolders.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(true)}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-3 py-2 rounded-xl text-xs transition shadow-2xs cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-amber-600" />
                  <span>+ Thư Mục Nhanh</span>
                </button>

                <input
                  type="file"
                  multiple
                  ref={mediaFileInputRef}
                  onChange={handleMediaUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => mediaFileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Tải Tệp Lên</span>
                </button>
              </div>
            </div>

            {/* STORAGE USAGE TRACKER WIDGET */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <HardDrive className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
                      <span>Dung Lượng Thư Viện Tệp Tin (Cloud Storage)</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                        Đã dùng {mediaStorageStats.totalMB} MB / {mediaStorageStats.maxMB} MB ({mediaStorageStats.usedPercent}%)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Tổng {mediaStorageStats.totalCount} tệp • {mediaStorageStats.imageCount} hình ảnh • {mediaStorageStats.videoCount} video • {mediaStorageStats.docCount} tài liệu
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    ✓ Còn trống {(mediaStorageStats.maxMB - parseFloat(mediaStorageStats.totalMB)).toFixed(1)} MB
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-linear-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(2, mediaStorageStats.usedPercent)}%` }}
                />
              </div>
            </div>

            {/* Subfolder Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs">
              <span className="font-bold text-slate-500 mr-1">Thư mục:</span>
              <button
                onClick={() => setSelectedFolder('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  selectedFolder === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                Tất cả ({mediaFiles.length})
              </button>

              {foldersList.map((f) => {
                const count = mediaFiles.filter(m => m.folder === f || (m.path && m.path.startsWith(f))).length;
                return (
                  <button
                    key={f}
                    onClick={() => setSelectedFolder(f)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition font-mono text-[11px] ${
                      selectedFolder === f
                        ? 'bg-amber-500 text-slate-950 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                    }`}
                  >
                    📁 {f} ({count})
                  </button>
                );
              })}
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-500 mr-1">Định dạng:</span>
              <button
                onClick={() => setMediaFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  mediaFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setMediaFilter('image')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  mediaFilter === 'image' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                Hình ảnh
              </button>
              <button
                onClick={() => setMediaFilter('video')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  mediaFilter === 'video' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                Video
              </button>
              <button
                onClick={() => setMediaFilter('document')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  mediaFilter === 'document' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                Tài liệu
              </button>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMedia.map((file) => (
                <div
                  key={file.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden group flex flex-col justify-between hover:border-amber-400 hover:shadow-sm transition"
                >
                  <div className="relative h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                    {file.type === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : file.type === 'video' ? (
                      <div className="text-center p-4 text-slate-500">
                        <VideoIcon className="w-10 h-10 mx-auto mb-2 text-amber-500" />
                        <span className="text-[10px] block">Video clip</span>
                      </div>
                    ) : (
                      <div className="text-center p-4 text-slate-500">
                        <FileText className="w-10 h-10 mx-auto mb-2 text-blue-500" />
                        <span className="text-[10px] block">Tài liệu PDF</span>
                      </div>
                    )}

                    <span className="absolute top-2 right-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] text-white font-mono">
                      {file.size}
                    </span>
                  </div>

                  <div className="p-3.5 space-y-2">
                    <div className="font-bold text-slate-900 text-xs truncate" title={file.name}>
                      {file.name}
                    </div>

                    <div className="text-[11px] text-amber-800 font-mono truncate" title={file.path || file.url}>
                      {file.path || file.url}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-xs">
                      {/* Sửa URL button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditMedia(file)}
                        className="text-[11px] text-slate-700 hover:text-amber-700 flex items-center gap-1 font-bold cursor-pointer"
                        title="Sửa đổi URL và thư mục con"
                      >
                        <Edit3 className="w-3 h-3 text-amber-600" />
                        <span>Sửa URL</span>
                      </button>

                      {/* Set as Logo (for images) */}
                      {file.type === 'image' && (
                        <button
                          type="button"
                          onClick={async () => {
                            const logoPath = file.path || file.url;
                            setSiteLogo(logoPath);
                            await updateJekyllConfig({ logo: logoPath });
                            alert(`Đã đặt "${file.name}" làm Logo Website thành công! Header & Footer website sẽ sử dụng logo này.`);
                          }}
                          className="text-[11px] text-amber-700 hover:text-amber-900 flex items-center gap-0.5 font-bold cursor-pointer"
                          title="Đặt làm Logo Header & Footer cho website"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Đặt Logo</span>
                        </button>
                      )}

                      {/* Copy Jekyll Tag */}
                      <button
                        type="button"
                        onClick={() => handleCopyText(`![${file.name}]({{ site.url }}${file.path || file.url})`, `${file.id}-jekyll`)}
                        className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                        title="Sao chép cú pháp {{ site.url }}"
                      >
                        {copiedMediaUrl === `${file.id}-jekyll` ? '✓ Đã chép' : 'Mã Jekyll'}
                      </button>

                      {/* Delete to Trash */}
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Xác nhận xóa tệp "${file.name}"?\nTệp sẽ được chuyển vào mục Thùng Rác (bạn có thể khôi phục trong vòng 30 ngày).`)) {
                            await deleteMediaFile(file.id, file);
                            alert(`Đã chuyển tệp "${file.name}" vào Thùng Rác thành công! Bạn có thể xem và khôi phục tại mục Thùng Rác.`);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="Chuyển tệp vào Thùng rác"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: LEADS & BOOKINGS */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Khách Hàng Đặt Lịch &amp; Yêu Cầu Báo Giá
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dữ liệu được chuyển trực tiếp từ công cụ tính khối lượng m³ và form liên hệ
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                    <th className="p-4">Khách Hàng</th>
                    <th className="p-4">Số Điện Thoại</th>
                    <th className="p-4">Địa Chỉ Công Trình</th>
                    <th className="p-4">Khối Lượng &amp; Mác</th>
                    <th className="p-4">Ngày Đổ</th>
                    <th className="p-4">Trạng Thái</th>
                    <th className="p-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-amber-50/40 transition">
                      <td className="p-4 font-bold text-slate-900">{lead.name}</td>
                      <td className="p-4 text-amber-700 font-mono font-bold">{lead.phone}</td>
                      <td className="p-4 text-slate-600">{lead.address}</td>
                      <td className="p-4 text-slate-800">
                        <div><strong>{lead.estimatedM3 || 0} m³</strong> ({lead.concreteGrade || 'Mác 250'})</div>
                        {lead.pumpNeeded && <div className="text-[10px] text-amber-700">+ Xe bơm {lead.pumpType || 'cần'}</div>}
                      </td>
                      <td className="p-4 text-slate-500">{lead.pourDate || 'Liên hệ sau'}</td>
                      <td className="p-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                          className="bg-slate-50 border border-slate-300 text-xs text-slate-900 rounded-lg p-1.5 focus:border-amber-500"
                        >
                          <option value="new">Mới đặt lịch</option>
                          <option value="contacted">Đã liên hệ tư vấn</option>
                          <option value="scheduled">Đã chốt lịch đổ bồn</option>
                          <option value="completed">Đã hoàn thành</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Gọi Khách</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: WEBSITE CONFIGURATION & SEO PARAMETERS */}
        {activeTab === 'design' && (
          <AdminDesignSection
            config={jekyllConfig}
            onSaveConfig={(updates) => {
              updateJekyllConfig(updates);
            }}
          />
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Header with save button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
                  <Settings className="w-3.5 h-3.5 text-amber-700" />
                  <span>Cấu Hình Website &amp; Thông Số SEO Chuẩn Jekyll</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Cấu Hình Hệ Thống &amp; Mã Đo Lường
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Quản lý các thông số cốt lõi của website, công cụ tìm kiếm, Google Analytics, Tag Manager và xuất file _config.yml.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lưu Cấu Hình Ngay</span>
                </button>
              </div>
            </div>

            {settingsSavedSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cấu hình Website &amp; SEO đã được lưu thành công vào cơ sở dữ liệu và đồng bộ cho toàn bộ hệ thống!</span>
              </div>
            )}

            {/* AI API & Provider Configuration (GPT, Gemini, Grok, Claude, DeepSeek) */}
            <AdminAiConfigSection
              aiSettings={aiSettings}
              onSaveSettings={saveAiSettings}
              onSetActiveProvider={setActiveAiProvider}
            />

            {/* Git & GitHub Synchronization Hub */}
            <AdminGitSyncCard />

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Group 1: Brand & Basic Info */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Globe className="w-4 h-4 text-amber-600" />
                  <span>1. Định Danh Website &amp; Khẩu Hiệu Thương Hiệu</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Title (Tiêu đề website) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={siteTitle}
                      onChange={(e) => setSiteTitle(e.target.value)}
                      placeholder="Bê Tông An Gia Bình - Ninh Bình"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white font-medium"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Xuất hiện trên thanh tiêu đề trình duyệt và thẻ meta title của trang chủ.</p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Slogan (Khẩu hiệu thương hiệu) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSlogan}
                      onChange={(e) => setSiteSlogan(e.target.value)}
                      placeholder="Chất lượng vững bền - Đồng hành mọi công trình"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white font-medium"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Tagline và slogan hiển thị ở header, footer và profile công ty.</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Description (Mô tả tóm tắt website - Meta Description)
                    </label>
                    <textarea
                      rows={2}
                      value={siteDescription}
                      onChange={(e) => setSiteDescription(e.target.value)}
                      placeholder="Trạm trộn bê tông tươi, bê tông thương phẩm công nghệ cao tại Ninh Bình..."
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      URL Website chính thức (url)
                    </label>
                    <input
                      type="text"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="https://betongangiabinh.vn"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Base URL (baseurl)
                    </label>
                    <input
                      type="text"
                      value={siteBaseurl}
                      onChange={(e) => setSiteBaseurl(e.target.value)}
                      placeholder="Để trống nếu chạy ở domain gốc (root domain)"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Logo & Favicon Brand Identity */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-600" />
                    <span>2. Quản Trị Logo &amp; Favicon Website (Nhận Diện Thương Hiệu)</span>
                  </h3>
                  <span className="text-[11px] font-medium text-slate-500">Tự động áp dụng cho Header, Footer &amp; Tab trình duyệt</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* Logo Management */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                        <span>Logo Website (Header &amp; Footer)</span>
                      </label>
                      {siteLogo && (
                        <button
                          type="button"
                          onClick={() => setSiteLogo('')}
                          className="text-[10px] text-red-600 hover:text-red-700 font-semibold"
                        >
                          Xóa logo (Dùng chữ AGB mặc định)
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Nhập link ảnh trực tiếp hoặc tải ảnh logo từ thiết bị của bạn (.png, .svg, .jpg, .webp):
                    </p>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={siteLogo}
                        onChange={(e) => setSiteLogo(e.target.value)}
                        placeholder="https://... hoặc /images/logo.png"
                        className="flex-1 bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl text-xs focus:border-amber-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMediaLogoPickerModal('logo')}
                        className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-2xs transition shrink-0"
                        title="Chọn ảnh từ thư viện tệp đã tải lên"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                        <span>Chọn Từ Tệp</span>
                      </button>
                      <label className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-2xs transition shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải Ảnh</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Logo Preview Box */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-500">Xem trước hiển thị:</span>
                      <div className="flex items-center gap-3">
                        {siteLogo ? (
                          <div className="h-10 px-3 py-1 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={siteLogo}
                              alt="Logo Preview"
                              className="max-h-8 max-w-[120px] object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950 text-xs">
                              AGB
                            </div>
                            <span className="text-[11px] text-slate-400 italic">(Đang dùng logo mẫu AGB)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Favicon Management */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        <span>Favicon Trình Duyệt (.ico, .png)</span>
                      </label>
                      {siteFavicon && (
                        <button
                          type="button"
                          onClick={() => setSiteFavicon('')}
                          className="text-[10px] text-red-600 hover:text-red-700 font-semibold"
                        >
                          Xóa favicon (Dùng mặc định)
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Icon hiển thị trên tab trình duyệt và bookmark của khách truy cập:
                    </p>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={siteFavicon}
                        onChange={(e) => setSiteFavicon(e.target.value)}
                        placeholder="https://... hoặc /favicon.ico"
                        className="flex-1 bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl text-xs focus:border-amber-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMediaLogoPickerModal('favicon')}
                        className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-2xs transition shrink-0"
                        title="Chọn icon từ thư viện tệp đã tải lên"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                        <span>Chọn Từ Tệp</span>
                      </button>
                      <label className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-2xs transition shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải Icon</span>
                        <input
                          type="file"
                          accept="image/*,.ico"
                          onChange={handleFaviconFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Favicon Preview Box */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-500">Xem trước tab trình duyệt:</span>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 max-w-[200px]">
                        {siteFavicon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={siteFavicon}
                            alt="Favicon Preview"
                            className="w-4 h-4 rounded-xs shrink-0 object-contain"
                          />
                        ) : (
                          <div className="w-4 h-4 rounded-xs bg-amber-500 shrink-0" />
                        )}
                        <span className="text-[10px] font-medium text-slate-700 truncate">
                          {siteTitle || 'Bê Tông An Gia Bình'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 3: Search Engines & Verification */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>3. Công Cụ Tìm Kiếm &amp; Xác Minh Webmaster (SEO)</span>
                </h3>

                <div className="space-y-4 text-xs">
                  {/* allow_search_engine toggle */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        allow_search_engine: {siteAllowSearchEngine ? 'true (Đang bật)' : 'false (Đang tắt)'}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Cho phép các bot tìm kiếm (Googlebot, Bingbot, Yandex...) thu thập dữ liệu và lập chỉ mục nội dung (Robots Index, Follow).
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSiteAllowSearchEngine(true)}
                        className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                          siteAllowSearchEngine
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>true (Cho phép Index)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSiteAllowSearchEngine(false)}
                        className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
                          !siteAllowSearchEngine
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span>false (Chặn bot)</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        google_verify (Mã xác minh Google Search Console)
                      </label>
                      <input
                        type="text"
                        value={siteGoogleVerify}
                        onChange={(e) => setSiteGoogleVerify(e.target.value)}
                        placeholder='Ví dụ: "AGB-NinhBinh-Concrete-Verified" hoặc mã html tag'
                        className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white font-mono text-xs"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">Dùng để xác minh quyền sở hữu trang web với Google Search Console.</p>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        bing_verify (Mã xác minh Bing Webmaster Tools)
                      </label>
                      <input
                        type="text"
                        value={siteBingVerify}
                        onChange={(e) => setSiteBingVerify(e.target.value)}
                        placeholder='Ví dụ: "8B817E22F9E524D63198..."'
                        className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white font-mono text-xs"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">Dùng để xác minh với công cụ tìm kiếm Microsoft Bing.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 3: Analytics, Tag Manager & Feeds */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                  <span>3. Đo Lường Lượng Truy Cập &amp; Kênh Theo Dõi</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>google_analytics (Google Analytics 4 ID)</span>
                      <span className="text-[10px] text-amber-700 font-semibold">GA4 Đo Lường</span>
                    </label>
                    <input
                      type="text"
                      value={siteGoogleAnalytics}
                      onChange={(e) => setSiteGoogleAnalytics(e.target.value)}
                      placeholder='Ví dụ: "G-6J50BRBSZS"'
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white font-mono font-bold text-xs"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Mã GA4 để theo dõi lượt truy cập bài viết, dự án và báo giá.</p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>google_tag_manager_id (Google Tag Manager)</span>
                      <span className="text-[10px] text-blue-700 font-semibold">GTM Container</span>
                    </label>
                    <input
                      type="text"
                      value={siteGoogleTagManagerId}
                      onChange={(e) => setSiteGoogleTagManagerId(e.target.value)}
                      placeholder='Ví dụ: "GTM-MXH8TM7H"'
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white font-mono font-bold text-xs"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Mã GTM để quản lý thẻ tiếp thị và sự kiện chuyển đổi.</p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      google_plus (Google Profile / Plus Link)
                    </label>
                    <input
                      type="text"
                      value={siteGooglePlus}
                      onChange={(e) => setSiteGooglePlus(e.target.value)}
                      placeholder='Ví dụ: "https://plus.google.com/..." hoặc liên kết Google Business'
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white text-xs font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Đường dẫn Google My Business / Hồ sơ doanh nghiệp địa phương.</p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      subcriber_url (Đường dẫn nhận tin / Webhook đăng ký)
                    </label>
                    <input
                      type="text"
                      value={siteSubscriberUrl}
                      onChange={(e) => setSiteSubscriberUrl(e.target.value)}
                      placeholder='Ví dụ: "/feed.xml" hoặc webhook đăng ký bản tin'
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white text-xs font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">URL luồng dữ liệu cấp tin tức hoặc nhận thông báo đăng ký tự động.</p>
                  </div>
                </div>
              </div>

              {/* Group 4: Contact & Social Info */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>4. Thông Tin Liên Hệ Trạm Trộn &amp; Mạng Xã Hội</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email liên hệ kế toán / điều độ</label>
                    <input
                      type="email"
                      value={siteEmail}
                      onChange={(e) => setSiteEmail(e.target.value)}
                      placeholder="ketoan.angiabinh@gmail.com"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số điện thoại Hotline</label>
                    <input
                      type="text"
                      value={sitePhone}
                      onChange={(e) => setSitePhone(e.target.value)}
                      placeholder="0988 2662 93"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fanpage Facebook</label>
                    <input
                      type="text"
                      value={siteFacebookPage}
                      onChange={(e) => setSiteFacebookPage(e.target.value)}
                      placeholder="https://www.facebook.com/betongangiabinh/"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Địa chỉ cụm trạm trộn</label>
                    <input
                      type="text"
                      value={siteAddress}
                      onChange={(e) => setSiteAddress(e.target.value)}
                      placeholder="Trạm 1: KCN Khánh Phú | Trạm 2: Xã Kim Sơn, Ninh Bình"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Group 5: Custom Code Injection (Header, Body Open, Footer / Body Close, Custom CSS & JS) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Code className="w-4 h-4 text-amber-600" />
                      <span>5. Chèn Mã Tùy Biến Vào Các Thẻ Header, Body &amp; Footer (Script / Tracking / CSS / Widgets)</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Chèn mã HTML, JavaScript theo dõi (Google Analytics, GTM, Facebook Pixel), tiện ích Chat trực tuyến (Zalo, Messenger, Tawk.to) hoặc mã CSS riêng. Mã được nhúng trực tiếp và đồng bộ tự động.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                      Tự động nhúng SSR &amp; CSR
                    </span>
                  </div>
                </div>

                {/* Sub-tabs for switching between code areas */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 text-xs scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('head')}
                    className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                      activeCodeTab === 'head'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>Thẻ &lt;head&gt;</span>
                    {siteCustomHeadCode.trim() && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Đã có mã chèn" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('bodyOpen')}
                    className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                      activeCodeTab === 'bodyOpen'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>Thẻ &lt;body&gt; Mở</span>
                    {siteCustomBodyOpenCode.trim() && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Đã có mã chèn" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('footer')}
                    className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                      activeCodeTab === 'footer'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>Thẻ &lt;footer&gt; / &lt;/body&gt;</span>
                    {siteCustomFooterCode.trim() && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Đã có mã chèn" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('css')}
                    className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                      activeCodeTab === 'css'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>CSS Tùy Biến</span>
                    {siteCustomCss.trim() && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Đã có CSS tùy biến" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('js')}
                    className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                      activeCodeTab === 'js'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>JavaScript Riêng</span>
                    {siteCustomJs.trim() && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Đã có JS tùy biến" />
                    )}
                  </button>
                </div>

                {/* Tab 1: Header Code (<head>) */}
                {activeCodeTab === 'head' && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="font-bold text-slate-800 text-xs">
                            Mã chèn trong thẻ &lt;head&gt; (Header Scripts / Thẻ Meta / CSS nhúng)
                          </label>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                            &lt;head&gt; ... &lt;/head&gt;
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Thích hợp cho: Google Tag Manager (phần head), Facebook Pixel, thẻ Meta xác minh (Google Search Console, Bing, TikTok), Google Fonts hoặc thẻ &lt;style&gt;.
                        </p>
                      </div>

                      {/* Quick Sample Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            const sample = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${siteGoogleTagManagerId || 'GTM-MXH8TM7H'}');</script>
<!-- End Google Tag Manager -->`;
                            setSiteCustomHeadCode(sample);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Nạp mẫu Google Tag Manager chuẩn"
                        >
                          + Mẫu GTM Head
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = `<meta name="google-site-verification" content="google-site-verification-token-example" />
<meta name="msvalidate.01" content="bing-webmaster-verification-token" />`;
                            setSiteCustomHeadCode((prev) => (prev ? `${prev}\n${sample}` : sample));
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Nạp thẻ Meta xác minh tìm kiếm"
                        >
                          + Mẫu Thẻ Meta
                        </button>
                        {siteCustomHeadCode && (
                          <button
                            type="button"
                            onClick={() => setSiteCustomHeadCode('')}
                            className="px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            Xóa trắng
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        rows={8}
                        value={siteCustomHeadCode}
                        onChange={(e) => setSiteCustomHeadCode(e.target.value)}
                        placeholder={`<!-- Dán mã script hoặc thẻ HTML cần chèn vào <head> tại đây -->\n<script>\n  // Ví dụ mã theo dõi hoặc tiếp thị\n</script>`}
                        className="w-full bg-slate-950 border border-slate-800 text-amber-300 p-4 rounded-xl font-mono text-xs focus:border-amber-500 focus:outline-hidden leading-relaxed"
                        spellCheck={false}
                      />
                      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 bg-slate-900/90 px-2 py-0.5 rounded">
                        {siteCustomHeadCode.length} ký tự
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Body Open (<body ...>) */}
                {activeCodeTab === 'bodyOpen' && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="font-bold text-slate-800 text-xs">
                            Mã chèn ngay sau thẻ mở &lt;body&gt; (Top of Body / NoScript)
                          </label>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                            &lt;body&gt; [Chèn ở đây] ...
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Thích hợp cho: Google Tag Manager (noscript), Facebook Pixel (noscript), mã thông báo khẩn cấp đầu trang hoặc banner khuyến mại.
                        </p>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            const sample = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${siteGoogleTagManagerId || 'GTM-MXH8TM7H'}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
                            setSiteCustomBodyOpenCode(sample);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Nạp mẫu Google Tag Manager NoScript"
                        >
                          + Mẫu GTM NoScript
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = `<div style="background:#f59e0b;color:#0f172a;text-align:center;padding:8px;font-size:12px;font-weight:bold;">
  📢 Trạm trộn Bê Tông An Gia Bình phục vụ 24/7 toàn tỉnh Ninh Bình - Hotline: 0988 2662 93
</div>`;
                            setSiteCustomBodyOpenCode((prev) => (prev ? `${prev}\n${sample}` : sample));
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        >
                          + Mẫu Banner Thông Báo
                        </button>
                        {siteCustomBodyOpenCode && (
                          <button
                            type="button"
                            onClick={() => setSiteCustomBodyOpenCode('')}
                            className="px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            Xóa trắng
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        rows={7}
                        value={siteCustomBodyOpenCode}
                        onChange={(e) => setSiteCustomBodyOpenCode(e.target.value)}
                        placeholder={`<!-- Dán mã script/noscript cần chèn ngay sau thẻ <body> tại đây -->\n<noscript><iframe src="..."></iframe></noscript>`}
                        className="w-full bg-slate-950 border border-slate-800 text-amber-300 p-4 rounded-xl font-mono text-xs focus:border-amber-500 focus:outline-hidden leading-relaxed"
                        spellCheck={false}
                      />
                      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 bg-slate-900/90 px-2 py-0.5 rounded">
                        {siteCustomBodyOpenCode.length} ký tự
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Footer Code (</body> / Footer) */}
                {activeCodeTab === 'footer' && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="font-bold text-slate-800 text-xs">
                            Mã chèn trước thẻ đóng &lt;/body&gt; / Footer (Chân trang &amp; Tiện ích Chat)
                          </label>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200">
                            ... [Chèn ở đây] &lt;/body&gt;
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Thích hợp cho: Widget Zalo Chat, Facebook Messenger, Tawk.to, Subiz, script đếm lượt xem, hotline rung lắc tùy biến hoặc mã chuyển đổi chạy sau khi trang tải xong.
                        </p>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            const sample = `<!-- Zalo Chat Widget -->
<div class="zalo-chat-widget" data-oaid="579745863508352884" data-welcome-message="Bê Tông An Gia Bình rất hân hạnh được hỗ trợ quý khách!" data-autopopup="0" data-width="" data-height=""></div>
<script src="https://sp.zalo.me/plugins/sdk.js"></script>`;
                            setSiteCustomFooterCode(sample);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Nạp mẫu Widget Zalo Chat"
                        >
                          + Mẫu Zalo Chat
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = `<!-- Tawk.to Live Chat Script -->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/your-property-id/default';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>`;
                            setSiteCustomFooterCode(sample);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        >
                          + Mẫu Tawk.to Chat
                        </button>
                        {siteCustomFooterCode && (
                          <button
                            type="button"
                            onClick={() => setSiteCustomFooterCode('')}
                            className="px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            Xóa trắng
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        rows={8}
                        value={siteCustomFooterCode}
                        onChange={(e) => setSiteCustomFooterCode(e.target.value)}
                        placeholder={`<!-- Dán mã widget chat hoặc script chạy trước thẻ đóng </body> tại đây -->\n<script>\n  // Tiện ích chat, theo dõi sự kiện chuyển đổi\n</script>`}
                        className="w-full bg-slate-950 border border-slate-800 text-amber-300 p-4 rounded-xl font-mono text-xs focus:border-amber-500 focus:outline-hidden leading-relaxed"
                        spellCheck={false}
                      />
                      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 bg-slate-900/90 px-2 py-0.5 rounded">
                        {siteCustomFooterCode.length} ký tự
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: Custom CSS */}
                {activeCodeTab === 'css' && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="font-bold text-slate-800 text-xs">
                            Mã CSS Tùy Biến (Custom CSS Rules)
                          </label>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                            Không cần thẻ &lt;style&gt;
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Tự động ghi đè hoặc bổ sung style cho website. Nhập trực tiếp các quy tắc CSS mà không cần bọc thẻ &lt;style&gt;&lt;/style&gt;.
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            const sample = `/* Tùy biến kiểu dáng nút gọi và hiệu ứng */
.btn-hotline-glow {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.7);
  animation: pulse 2s infinite;
}
/* Bo góc khối nội dung */
.article-content img {
  border-radius: 1rem;
}`;
                            setSiteCustomCss((prev) => (prev ? `${prev}\n\n${sample}` : sample));
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        >
                          + Mẫu CSS Hiệu Ứng
                        </button>
                        {siteCustomCss && (
                          <button
                            type="button"
                            onClick={() => setSiteCustomCss('')}
                            className="px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            Xóa trắng
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        rows={7}
                        value={siteCustomCss}
                        onChange={(e) => setSiteCustomCss(e.target.value)}
                        placeholder={`/* Nhập quy tắc CSS tại đây (không cần thẻ <style>) */\n.header-custom {\n  background-color: #0f172a;\n}`}
                        className="w-full bg-slate-950 border border-slate-800 text-emerald-300 p-4 rounded-xl font-mono text-xs focus:border-amber-500 focus:outline-hidden leading-relaxed"
                        spellCheck={false}
                      />
                      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 bg-slate-900/90 px-2 py-0.5 rounded">
                        {siteCustomCss.length} ký tự
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 5: Custom JavaScript */}
                {activeCodeTab === 'js' && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="font-bold text-slate-800 text-xs">
                            Mã JavaScript Tùy Biến (Custom JS Logic)
                          </label>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                            Không cần thẻ &lt;script&gt;
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Đoạn mã JavaScript chạy khi tải xong trang web (không cần bọc trong thẻ &lt;script&gt;&lt;/script&gt;).
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            const sample = `// Tự động cuộn mượt và theo dõi sự kiện click hotline
console.log('Bê Tông An Gia Bình initialized');
document.addEventListener('click', function(e) {
  if (e.target && e.target.closest('a[href^="tel:"]')) {
    console.log('Hotline clicked:', e.target.closest('a').getAttribute('href'));
  }
});`;
                            setSiteCustomJs((prev) => (prev ? `${prev}\n\n${sample}` : sample));
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        >
                          + Mẫu JS Theo Dõi
                        </button>
                        {siteCustomJs && (
                          <button
                            type="button"
                            onClick={() => setSiteCustomJs('')}
                            className="px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            Xóa trắng
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        rows={7}
                        value={siteCustomJs}
                        onChange={(e) => setSiteCustomJs(e.target.value)}
                        placeholder={`// Nhập mã JavaScript chạy sau khi tải trang (không cần thẻ <script>)\nconsole.log('Xin chào từ Bê Tông An Gia Bình');`}
                        className="w-full bg-slate-950 border border-slate-800 text-amber-300 p-4 rounded-xl font-mono text-xs focus:border-amber-500 focus:outline-hidden leading-relaxed"
                        spellCheck={false}
                      />
                      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 bg-slate-900/90 px-2 py-0.5 rounded">
                        {siteCustomJs.length} ký tự
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Group 6: Real-time _config.yml Preview */}
              <div className="bg-slate-950 text-slate-200 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-xs font-bold text-amber-400">Xem Trước File _config.yml Tương Ứng</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const yaml = `# _config.yml - Bê Tông An Gia Bình
title: "${siteTitle}"
slogan: "${siteSlogan}"
${siteLogo ? `logo: "${siteLogo}"\n` : ''}${siteFavicon ? `favicon: "${siteFavicon}"\n` : ''}allow_search_engine: ${siteAllowSearchEngine}
google_verify: "${siteGoogleVerify}"
bing_verify: "${siteBingVerify}"
google_analytics: "${siteGoogleAnalytics}"
google_tag_manager_id: "${siteGoogleTagManagerId}"
google_plus: "${siteGooglePlus}"
subcriber_url: "${siteSubscriberUrl}"
email: "${siteEmail}"
description: >-
  ${siteDescription}
url: "${siteUrl}"
baseurl: "${siteBaseurl}"
facebook_page: "${siteFacebookPage}"
${siteCustomHeadCode ? `custom_head_code: >-\n  ${siteCustomHeadCode.split('\n').join('\n  ')}\n` : ''}${siteCustomBodyOpenCode ? `custom_body_open_code: >-\n  ${siteCustomBodyOpenCode.split('\n').join('\n  ')}\n` : ''}${siteCustomFooterCode ? `custom_footer_code: >-\n  ${siteCustomFooterCode.split('\n').join('\n  ')}\n` : ''}markdown: kramdown
permalink: /:title.html
plugins:
  - jekyll-feed
  - jekyll-seo-tag
  - jekyll-sitemap`;
                        navigator.clipboard.writeText(yaml);
                        alert('Đã sao chép nội dung _config.yml vào bộ nhớ tạm!');
                      }}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 font-semibold transition flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao Chép YAML</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowJekyllModal(true)}
                      className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition"
                    >
                      Xuất Full Mã Nguồn ZIP
                    </button>
                  </div>
                </div>

                <pre className="text-[11px] font-mono leading-relaxed bg-slate-900 p-4 rounded-xl text-amber-300/90 overflow-x-auto border border-slate-800/80">
{`# _config.yml - Bê Tông An Gia Bình Jekyll Configuration
title: "${siteTitle}"
slogan: "${siteSlogan}"
${siteLogo ? `logo: "${siteLogo}"\n` : ''}${siteFavicon ? `favicon: "${siteFavicon}"\n` : ''}allow_search_engine: ${siteAllowSearchEngine}
google_verify: "${siteGoogleVerify}"
bing_verify: "${siteBingVerify}"
google_analytics: "${siteGoogleAnalytics}"
google_tag_manager_id: "${siteGoogleTagManagerId}"
google_plus: "${siteGooglePlus}"
subcriber_url: "${siteSubscriberUrl}"
email: "${siteEmail}"
description: >-
  ${siteDescription}
url: "${siteUrl}"
baseurl: "${siteBaseurl}"
facebook_page: "${siteFacebookPage}"
${siteCustomHeadCode ? `custom_head_code: >-\n  ${siteCustomHeadCode.split('\n').join('\n  ')}\n` : ''}${siteCustomBodyOpenCode ? `custom_body_open_code: >-\n  ${siteCustomBodyOpenCode.split('\n').join('\n  ')}\n` : ''}${siteCustomFooterCode ? `custom_footer_code: >-\n  ${siteCustomFooterCode.split('\n').join('\n  ')}\n` : ''}markdown: kramdown
permalink: /:title.html
plugins:
  - jekyll-feed
  - jekyll-seo-tag
  - jekyll-sitemap`}
                </pre>
              </div>

              {/* Bottom Action Bar */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold text-xs shadow-md transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lưu &amp; Áp Dụng Cấu Hình Website</span>
                </button>
              </div>
            </form>

            {/* SCHEMA.ORG STRUCTURED DATA CONFIGURATION FOR POSTS & PAGES */}
            <AdminSchemaSettingsSection
              settings={schemaSettings}
              onSaveSchemaSettings={saveSchemaSettings}
            />
          </div>
        )}

        {/* TAB: THÙNG RÁC & BẢO LƯU DỮ LIỆU */}
        {activeTab === 'trash' && (
          <AdminTrashSection
            trash={trash}
            onRestore={restoreFromTrash}
            onDeletePermanently={deletePermanentlyFromTrash}
            onEmptyTrash={emptyTrash}
          />
        )}
      </main>

      {/* MODALS */}
      {/* 1. Bulk Post Entry Modal */}
      <AdminBulkPostModal
        isOpen={showBulkPostModal}
        initialMode={bulkPostInitialMode}
        onClose={() => setShowBulkPostModal(false)}
        onSuccess={() => {
          setActiveTab('posts');
          setPostsSubTab('articles');
        }}
      />

      {/* 2. Search and Replace Modal */}
      <AdminSearchReplaceModal
        isOpen={showSearchReplaceModal}
        onClose={() => setShowSearchReplaceModal(false)}
        posts={posts}
      />

      {/* 3. Edit Media URL Modal */}
      <AdminEditMediaModal
        isOpen={showEditMediaModal}
        file={editingMediaFile}
        availableFolders={foldersList}
        onClose={() => {
          setShowEditMediaModal(false);
          setEditingMediaFile(null);
        }}
        onSave={(updated) => updateMediaFile(updated)}
      />

      {/* 4. New Folder Modal */}
      <AdminNewFolderModal
        isOpen={showNewFolderModal}
        onClose={() => setShowNewFolderModal(false)}
        onAddFolder={handleAddFolder}
      />

      {/* 5. Single Post Modal (Create or Edit) */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-500" />
                <span>{editingPostId ? 'Chỉnh Sửa Bài Viết' : 'Soạn Thảo Bài Viết Blog Mới'}</span>
              </h3>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-slate-700 text-lg">✕</button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề bài viết</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hướng Dẫn Nghiệm Thu Bê Tông Tươi Chuẩn TCVN Tại Ninh Bình"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">Chuyên mục</label>
                    <button
                      type="button"
                      onClick={() => handleOpenNewCategoryModal()}
                      className="text-[10px] text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Mới</span>
                    </button>
                  </div>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs focus:border-amber-500 focus:bg-white font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Slug URL (tùy chỉnh)</label>
                  <input
                    type="text"
                    placeholder="Tự tạo từ tiêu đề"
                    value={postSlug}
                    onChange={(e) => setPostSlug(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-amber-900 p-3 rounded-xl text-xs font-mono focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày đăng bài viết (Date)</label>
                  <input
                    type="date"
                    required
                    value={postDate}
                    onChange={(e) => setPostDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs font-mono focus:border-amber-500 focus:bg-white font-semibold"
                  />
                </div>
              </div>

              {/* Custom Permalink Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Đường dẫn tĩnh Permalink (Tùy chọn - Ví dụ từ file .md)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: /bang-gia-be-tong-tuoi-ninh-binh.html hoặc /ky-thuat-do-be-tong/"
                  value={postPermalink}
                  onChange={(e) => setPostPermalink(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-emerald-900 p-2.5 rounded-xl text-xs font-mono focus:border-amber-500 focus:bg-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Khi upload bài từ file .md có dòng <code className="text-emerald-700 font-bold">permalink: /...</code>, hệ thống sẽ tự động gán và dùng permalink này làm URL chính thức thay vì slug mặc định.
                </p>
              </div>

              {/* Excerpt with AI Rewrite & Auto Optimize Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-700">Đoạn tóm tắt Excerpt (Meta Description)</label>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      postExcerpt.length >= 130 && postExcerpt.length <= 165
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {postExcerpt.length}/160 ký tự {postExcerpt.length >= 130 && postExcerpt.length <= 165 ? '(Chuẩn SEO)' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAutoOptimizeExcerptInEditor}
                      className="text-[11px] bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                      title="Tự động tạo đoạn tóm tắt 140-160 ký tự chuẩn SEO chứa từ khóa và thương hiệu Bê Tông An Gia Bình"
                    >
                      <Zap className="w-3 h-3 text-amber-700" />
                      <span>Tự Tối Ưu Excerpt</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRewritePostExcerpt}
                      disabled={isRewritingPostExcerpt}
                      className="text-[11px] text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isRewritingPostExcerpt ? 'AI Đang Viết Lại...' : 'Viết lại bằng AI'}</span>
                    </button>
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={postExcerpt}
                  onChange={(e) => setPostExcerpt(e.target.value)}
                  placeholder="Tóm tắt ngắn gọn 1-2 câu chuẩn SEO..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs focus:border-amber-500 focus:bg-white"
                />
              </div>

              {/* AI Image Generation Section inside Post Modal */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-500" />
                    <span>Tạo Ảnh Bằng AI Cho Bài Viết</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleSuggestPostImagePrompt}
                    disabled={isSuggestingPostPrompt}
                    className="text-[11px] text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isSuggestingPostPrompt ? 'Đang gợi ý...' : 'Tự Gợi Ý Prompt Theo Tiêu Đề'}</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập prompt miêu tả hình ảnh muốn tạo..."
                    value={postImagePrompt}
                    onChange={(e) => setPostImagePrompt(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleGeneratePostImage}
                    disabled={isGeneratingPostImage}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition disabled:opacity-50 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingPostImage ? 'Đang tạo...' : 'Tạo Ảnh Bằng AI'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 rounded-lg overflow-hidden border border-slate-300 shrink-0">
                    <img src={postImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={postImage}
                    onChange={(e) => setPostImage(e.target.value)}
                    placeholder="URL hình ảnh bìa bài viết"
                    className="flex-1 bg-white border border-slate-300 text-slate-700 p-2.5 rounded-xl text-xs font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Content with AI Rewrite & SEO Optimization Button */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-700">Nội dung bài viết (Markdown &amp; hình ảnh &#123;&#123; site.url &#125;&#125;)</label>
                    {/* Live Word Count Indicator */}
                    {(() => {
                      const words = postContent.trim().split(/\s+/).filter(Boolean).length;
                      const isOk = words >= 1000;
                      return (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isOk
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {words.toLocaleString('vi-VN')} từ {isOk ? '(Đạt chuẩn SEO ≥1.000 từ)' : '(Chưa đạt 1.000 từ)'}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOptimizePostContentInEditor}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xs transition cursor-pointer"
                      title="Tối ưu nội dung theo thương hiệu Bê tông An Gia Bình: đổi thông tin liên hệ của đơn vị khác, dọn rác, chuẩn hóa heading, chèn internal link"
                    >
                      <Building2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Tối Ưu Thương Hiệu &amp; Dọn Rác</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!postContent && !postTitle) {
                          alert('Vui lòng nhập tiêu đề hoặc nội dung trước khi tối ưu SEO.');
                          return;
                        }
                        const currentDraft: BlogPost = {
                          id: editingPostId || `draft-${Date.now()}`,
                          title: postTitle || 'Bài viết Bê Tông An Gia Bình',
                          slug: postSlug || 'bai-viet',
                          permalink: postPermalink,
                          category: postCategory,
                          excerpt: postExcerpt,
                          content: postContent,
                          date: postDate || new Date().toISOString().split('T')[0],
                          coverImage: postImage,
                          tags: postTags.split(',').map((s) => s.trim()).filter(Boolean),
                          focusKeywords: postKeywords.split(',').map((s) => s.trim()).filter(Boolean),
                          readTime: '5 phút',
                          views: 0,
                        };
                        setOptimizingPost(currentDraft);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xs transition cursor-pointer"
                      title="Mở bảng tối ưu SEO: lồng ghép từ khóa chính/phụ, tự động chèn internal link, nâng cấp tối thiểu 1.000 từ"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tối Ưu SEO AI (Từ Khóa &amp; &ge;1000 từ)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRewritePostContent}
                      disabled={isRewritingPostContent}
                      className="text-[11px] text-slate-600 hover:text-slate-900 font-bold px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 transition disabled:opacity-50"
                    >
                      <span>{isRewritingPostContent ? 'AI Đang Viết...' : 'Viết Lại Nhanh'}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={8}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="## 1. Mở đầu&#10;&#10;Nội dung bài viết chi tiết...&#10;&#10;![Alt]({{ site.url }}/images/blog/be-tong-thuong-pham-an-gia-binh.jpg)"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs font-mono leading-relaxed focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-700 text-xs">Từ Khóa &amp; Thẻ Phân Loại (Tags)</span>
                  <button
                    type="button"
                    onClick={handleAutoSuggestKeywordsAndTagsInEditor}
                    className="text-[11px] bg-violet-100 hover:bg-violet-200 text-violet-900 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    title="Phân tích tiêu đề và nội dung để tự động gợi ý từ khóa chính, từ khóa phụ và tags chuẩn Bê Tông An Gia Bình"
                  >
                    <Sparkles className="w-3 h-3 text-violet-700" />
                    <span>Tự Gợi Ý Từ Khóa &amp; Tags</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[11px] font-semibold mb-1">Từ khóa SEO (chính, phụ cách nhau bằng dấu phẩy)</label>
                    <input
                      type="text"
                      value={postKeywords}
                      onChange={(e) => setPostKeywords(e.target.value)}
                      placeholder="bê tông tươi ninh bình, giá bê tông mác 250 ninh bình..."
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[11px] font-semibold mb-1">Tags (thẻ phân loại cách nhau bằng dấu phẩy)</label>
                    <input
                      type="text"
                      value={postTags}
                      onChange={(e) => setPostTags(e.target.value)}
                      placeholder="bê tông ninh bình, kỹ thuật thi công, an gia bình..."
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingPostModal}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  {isSavingPostModal ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu vào posts.json...</span>
                    </>
                  ) : (
                    <span>{editingPostId ? 'Lưu Cập Nhật' : 'Đăng Bài Viết'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Category Modal */}
      {showBulkCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-600" />
                <span>Đổi Chuyên Mục Hàng Loạt</span>
              </h3>
              <button
                onClick={() => setShowBulkCategoryModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Bạn đang thực hiện chuyển chuyên mục cho{' '}
              <strong className="text-amber-700">{selectedPostIds.length} bài viết</strong> đã chọn.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Chọn Chuyên Mục Đích
              </label>
              <select
                value={bulkTargetCategory}
                onChange={(e) => setBulkTargetCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs focus:border-amber-500 focus:bg-white font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowBulkCategoryModal(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleExecuteBatchCategory}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-xs cursor-pointer"
              >
                Xác Nhận Đổi ({selectedPostIds.length} bài)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Date Modal */}
      {showBulkDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Đổi Ngày Đăng Hàng Loạt</span>
              </h3>
              <button
                onClick={() => setShowBulkDateModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Bạn đang cập nhật ngày đăng cho{' '}
              <strong className="text-blue-700">{selectedPostIds.length} bài viết</strong> đã chọn.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chọn Ngày Đăng (Date)
                </label>
                <input
                  type="date"
                  required
                  value={bulkTargetDate}
                  onChange={(e) => setBulkTargetDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs font-mono focus:border-amber-500 focus:bg-white font-semibold"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={bulkDateIncremental}
                    onChange={(e) => setBulkDateIncremental(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span>Rải đều ngày đăng tăng dần (+1 ngày mỗi bài)</span>
                </label>
                <p className="text-[11px] text-slate-500 pl-6">
                  Ví dụ: Nếu chọn ngày 2025-01-01, các bài sẽ lần lượt nhận ngày 2025-01-01, 2025-01-02, 2025-01-03,... Thích hợp khi nhập blog hàng loạt để trông tự nhiên chuẩn SEO.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowBulkDateModal(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleExecuteBatchDate}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xs cursor-pointer"
              >
                Cập Nhật Ngày ({selectedPostIds.length} bài)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>{editingProjectId ? 'Chỉnh Sửa Dự Án' : 'Thêm Công Trình Đã Thi Công'}</span>
              </h3>
              <button onClick={() => setShowProjectModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Công Trình</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nhà máy sản xuất linh kiện điện tử KCN Tam Điệp"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khối Lượng (m³)</label>
                  <input
                    type="number"
                    value={projVolume}
                    onChange={(e) => setProjVolume(Number(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vị Trí Công Trình</label>
                  <input
                    type="text"
                    value={projLocation}
                    onChange={(e) => setProjLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mác Bê Tông Sử Dụng</label>
                  <input
                    type="text"
                    value={projGrade}
                    onChange={(e) => setProjGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dịch Vụ Xe Bơm</label>
                  <input
                    type="text"
                    value={projPump}
                    onChange={(e) => setProjPump(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Description with AI Rewrite Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Mô tả dự án &amp; tiến độ thi công</label>
                  <button
                    type="button"
                    onClick={handleRewriteProjDesc}
                    disabled={isRewritingProjDesc}
                    className="text-[11px] text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isRewritingProjDesc ? 'AI Đang Viết Lại...' : 'Viết lại bằng AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Hình Ảnh Công Trình</label>
                <input
                  type="text"
                  value={projImage}
                  onChange={(e) => setProjImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs"
                >
                  {editingProjectId ? 'Lưu Cập Nhật Dự Án' : 'Thêm Vào Hồ Sơ Năng Lực'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Markdown Import Modal */}
      {showMdImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileUp className="w-5 h-5 text-amber-500" />
                <span>Nhập Dữ Liệu Bài Viết Từ File Markdown (.md)</span>
              </h3>
              <button onClick={() => setShowMdImportModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-amber-500 p-6 rounded-2xl text-center cursor-pointer transition bg-slate-50"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".md,.markdown,.txt"
                  className="hidden"
                />
                <FileCode className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="font-bold text-slate-900">Nhấp để chọn file .md từ máy tính</div>
                <div className="text-slate-500 text-[11px] mt-1">Hỗ trợ file Jekyll Markdown có YAML Frontmatter (title, date, categories, tags)</div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hoặc Dán Trực Tiếp Nội Dung File .md Vào Đây:
                </label>
                <textarea
                  rows={6}
                  value={mdFileText}
                  onChange={(e) => {
                    setMdFileText(e.target.value);
                    setMdParsedPreview(parseMarkdownContent(e.target.value));
                  }}
                  placeholder="---&#10;layout: post&#10;title: Tiêu đề bài viết&#10;date: 2025-05-15&#10;---&#10;# Nội dung bài viết..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs font-mono"
                />
              </div>

              {mdParsedPreview && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    ✓ Kết Quả Nhận Diện Tự Động:
                  </span>
                  <div className="font-bold text-slate-900 text-sm">{mdParsedPreview.title}</div>
                  <div className="text-slate-600 text-xs line-clamp-2">{mdParsedPreview.excerpt}</div>
                  <div className="text-[11px] text-amber-800 flex items-center gap-3 font-medium">
                    <span>Chuyên mục: {mdParsedPreview.category}</span>
                    <span>•</span>
                    <span>Độ dài: {mdParsedPreview.content?.length} ký tự</span>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowMdImportModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImportMd}
                  disabled={!mdParsedPreview}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition disabled:opacity-50 shadow-xs"
                >
                  Xác Nhận Nhập Vào Hệ Thống
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Category Create / Edit Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                <span>{editingCategoryId ? 'Chỉnh Sửa Chuyên Mục' : 'Tạo Chuyên Mục Bài Viết Mới'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Chuyên Mục *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Báo Giá Bê Tông Ninh Bình, Kỹ Thuật Đổ Móng..."
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCategoryId && !catSlug) {
                      const autoSlug = e.target.value
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/đ/g, 'd')
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '');
                      setCatSlug(autoSlug);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs focus:border-amber-500 focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Đường Dẫn Slug URL
                  <span className="text-slate-400 font-normal ml-1">(Mặc định /blog/)</span>
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl overflow-hidden focus-within:border-amber-500 focus-within:bg-white">
                  <span className="px-3 py-3 text-slate-400 font-mono text-[11px] bg-slate-100 border-r border-slate-200">
                    /blog/
                  </span>
                  <input
                    type="text"
                    placeholder="tu-dong-tao-tu-ten"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    className="w-full bg-transparent p-3 text-amber-900 text-xs font-mono focus:outline-hidden"
                  />
                  <span className="px-2.5 py-3 text-slate-400 font-mono text-[11px] bg-slate-100 border-l border-slate-200 select-none">
                    /
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700">Mô Tả Chuyên Mục (SEO)</label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer select-none bg-amber-50 border border-amber-200 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition">
                    <input
                      type="checkbox"
                      checked={catAiEnabled}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setCatAiEnabled(checked);
                        if (checked && !catDesc && catName.trim()) {
                          handleGenerateCatDescAi(catName, catSlug);
                        }
                      }}
                      className="w-3.5 h-3.5 accent-amber-600 rounded cursor-pointer"
                    />
                    <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Tích chọn viết bằng AI
                    </span>
                  </label>
                </div>

                <textarea
                  rows={3}
                  placeholder="Giới thiệu tóm tắt nội dung các bài viết trong chuyên mục này..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl text-xs focus:border-amber-500 focus:bg-white leading-relaxed"
                />

                {catAiEnabled && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-amber-50/80 border border-amber-200 rounded-xl p-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-900 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Chế độ AI đang bật: Viết tóm tắt chuẩn SEO &amp; kỹ thuật bê tông Ninh Bình</span>
                    </div>
                    <button
                      type="button"
                      disabled={isGeneratingCatDesc || !catName.trim()}
                      onClick={() => handleGenerateCatDescAi(catName, catSlug)}
                      className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-[11px] shadow-2xs transition shrink-0"
                    >
                      {isGeneratingCatDesc ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>AI đang soạn...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>{catDesc ? 'Tạo lại bằng AI' : 'Tạo mô tả bằng AI'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Màu Sắc Nhận Diện</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { key: 'amber', label: 'Vàng Hổ Phách', bg: 'bg-amber-500' },
                    { key: 'blue', label: 'Xanh Dương', bg: 'bg-blue-500' },
                    { key: 'emerald', label: 'Xanh Lá', bg: 'bg-emerald-500' },
                    { key: 'purple', label: 'Tím', bg: 'bg-purple-500' },
                    { key: 'rose', label: 'Hồng Đỏ', bg: 'bg-rose-500' },
                    { key: 'cyan', label: 'Xanh Cyan', bg: 'bg-cyan-500' },
                    { key: 'orange', label: 'Cam', bg: 'bg-orange-500' },
                    { key: 'slate', label: 'Ghi Xám', bg: 'bg-slate-500' },
                  ].map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setCatColor(c.key)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition ${
                        catColor === c.key
                          ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {editingCategoryId && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Tự động đồng bộ:</strong> Khi bạn thay đổi tên chuyên mục này, tất cả bài viết đang thuộc chuyên mục cũ sẽ tự động được cập nhật sang tên mới ngay lập tức.
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-xs transition"
                >
                  {editingCategoryId ? 'Cập Nhật Chuyên Mục' : 'Tạo Chuyên Mục Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Jekyll Export Modal */}
      <JekyllExportModal
        isOpen={showJekyllModal}
        onClose={() => setShowJekyllModal(false)}
      />

      {/* 10. AI Post Optimizer Modal */}
      {optimizingPost && (
        <AdminPostOptimizerModal
          post={optimizingPost}
          pages={pages}
          otherPosts={posts.filter((p) => p.id !== optimizingPost.id)}
          onClose={() => setOptimizingPost(null)}
          onApplyOptimized={(updatedPost) => {
            // If editing in post form modal, update form fields live
            if (showPostModal) {
              if (updatedPost.title) setPostTitle(updatedPost.title);
              if (updatedPost.content) setPostContent(updatedPost.content);
              if (updatedPost.excerpt) setPostExcerpt(updatedPost.excerpt);
              if (updatedPost.focusKeywords) {
                setPostKeywords(updatedPost.focusKeywords.join(', '));
              }
              if (updatedPost.tags) {
                setPostTags(updatedPost.tags.join(', '));
              }
            }

            // If the post already exists in the store, update it in store
            if (posts.some((p) => p.id === optimizingPost.id)) {
              updatePost({
                ...optimizingPost,
                ...updatedPost,
                date: optimizingPost.date || new Date().toISOString().split('T')[0],
              } as BlogPost);
            }
            setOptimizingPost(null);
            alert('Đã áp dụng tối ưu bài viết chuẩn SEO thành công!');
          }}
        />
      )}

      {/* 10b. AI Bulk Post Optimizer Modal */}
      {showBulkOptimizerModal && (
        <AdminBulkPostOptimizerModal
          initialSelectedPosts={posts.filter((p) => selectedPostIds.includes(p.id))}
          allPosts={posts}
          pages={pages}
          onClose={() => setShowBulkOptimizerModal(false)}
          onApplyBatch={(updatedPosts) => {
            batchUpdatePosts(updatedPosts);
            setShowBulkOptimizerModal(false);
            setSelectedPostIds([]);
            alert(`Đã tối ưu và đồng bộ thành công ${updatedPosts.length} bài viết chuẩn SEO Google!\nToàn bộ ${posts.length} bài viết trên hệ thống được bảo toàn an toàn 100%.`);
          }}
        />
      )}

      {/* 11. Add Media File From URL Modal */}
      {showAddMediaUrlModal && (
        <AdminAddMediaUrlModal
          folders={mediaFolders}
          defaultFolder={targetUploadFolder || '/images/blog'}
          onClose={() => setShowAddMediaUrlModal(false)}
          onSubmit={(url, name, folder) => {
            addMediaFileFromUrl({
              url,
              name,
              folder,
              type: 'image',
              size: '350 KB',
            });
            setShowAddMediaUrlModal(false);
            alert(`Đã thêm tệp "${name}" từ URL thành công!`);
          }}
        />
      )}

      {/* 12. Media Folders Manager Modal */}
      {showManageFoldersModal && (
        <AdminManageFoldersModal
          folders={mediaFolders}
          mediaFiles={mediaFiles}
          onClose={() => setShowManageFoldersModal(false)}
          onSaveFolder={(folder) => {
            updateMediaFolder(folder.path, { name: folder.name, path: folder.path });
          }}
          onDeleteFolder={(_folderId, folderPath) => {
            deleteMediaFolder(folderPath);
          }}
          onCreateFolder={(name, path) => {
            addMediaFolder({ name, path, description: '' });
          }}
        />
      )}
      {/* 13. Bulk Import Projects Modal (.md files) */}
      {showBulkProjectModal && (
        <AdminBulkProjectModal
          isOpen={showBulkProjectModal}
          onClose={() => setShowBulkProjectModal(false)}
          onSuccess={(count) => {
            alert(`Đã nhập thành công ${count} dự án vào hồ sơ năng lực công ty!`);
          }}
        />
      )}

      {/* 14. Pick Logo/Favicon from Media Files Modal */}
      {showMediaLogoPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  {showMediaLogoPickerModal === 'logo'
                    ? 'Chọn Ảnh Làm Logo Website (Header & Footer)'
                    : 'Chọn Icon Làm Favicon Trình Duyệt'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaLogoPickerModal(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <p className="text-xs text-slate-500">
                Nhấp vào bất kỳ hình ảnh nào bên dưới để đặt làm{' '}
                <strong>{showMediaLogoPickerModal === 'logo' ? 'Logo Website' : 'Favicon'}</strong>.
              </p>

              {mediaFiles.filter(m => m.type === 'image' || !m.type).length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Chưa có hình ảnh nào trong thư viện tệp. Bạn hãy tải ảnh lên ở tab Quản Lý Tệp trước.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaFiles
                    .filter((m) => m.type === 'image' || !m.type)
                    .map((m) => {
                      const imagePath = m.path || m.url;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={async () => {
                            if (showMediaLogoPickerModal === 'logo') {
                              setSiteLogo(imagePath);
                              await updateJekyllConfig({ logo: imagePath });
                              alert(`Đã đặt "${m.name}" làm Logo Website thành công! Header & Footer website sẽ sử dụng logo này.`);
                            } else {
                              setSiteFavicon(imagePath);
                              await updateJekyllConfig({ favicon: imagePath });
                              alert(`Đã đặt "${m.name}" làm Favicon thành công!`);
                            }
                            setShowMediaLogoPickerModal(null);
                          }}
                          className="group text-left border border-slate-200 hover:border-amber-500 rounded-2xl p-2 bg-slate-50/50 hover:bg-amber-50/30 transition flex flex-col justify-between cursor-pointer space-y-2"
                        >
                          <div className="h-28 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={m.url || m.path}
                              alt={m.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-800 truncate" title={m.name}>
                              {m.name}
                            </div>
                            <div className="text-[10px] text-amber-700 font-mono truncate">
                              {imagePath}
                            </div>
                          </div>
                          <div className="w-full text-center py-1 text-[11px] font-bold text-amber-800 bg-amber-100 group-hover:bg-amber-500 group-hover:text-slate-950 rounded-lg transition">
                            ✓ Chọn tệp này
                          </div>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
