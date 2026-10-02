export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author?: string;
  date?: string;
  category: string;
  tags: string[];
  views: number;
  readTime: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeywords: string[];
  keywords?: string[] | string;
  isPublished?: boolean;
  jekyllMarkdown?: string;
  permalink?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  volumeM3: number;
  concreteGrade: string; // e.g., 'Mác 300, Mác 350 R7'
  pumpService: string; // e.g., 'Bơm cần 52m'
  year: number;
  image: string;
  client: string;
  description: string;
  highlights: string[];
  slug?: string;
  date?: string;
  permalink?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  address: string;
  concreteGrade?: string;
  estimatedM3?: number;
  pumpNeeded?: boolean;
  pumpType?: string;
  pourDate?: string;
  notes?: string;
  createdAt: string;
  status: string;
}

export interface RealtimeEvent {
  id: string;
  timestamp: string;
  type: 'pageview' | 'call_hotline' | 'chat_inquiry' | 'quote_calculator' | 'download_profile' | 'view_project' | 'lead_submitted';
  details: string;
  device: 'mobile' | 'desktop' | 'tablet';
  location: string;
  path: string;
}

export interface RealtimeAnalytics {
  activeUsers: number;
  pageviewsToday: number;
  totalPageviews: number;
  chatInquiries: number;
  leadsCount: number;
  pageviewsPerMin: number[];
  leadsToday: number;
  callsToday: number;
  deviceBreakdown: { name: string; percentage: number; count: number }[];
  locationBreakdown: { city: string; percentage: number; count: number }[];
  sourceBreakdown: { source: string; percentage: number; count: number }[];
  topPages: { path: string; title: string; views: number }[];
  recentEvents: RealtimeEvent[];
}

export interface IndustryNews {
  id: string;
  source: string;
  sourceUrl?: string;
  title: string;
  publishedAt?: string;
  scrapedAt?: string;
  summary: string;
  rawContent?: string;
  status?: 'new' | 'processed' | 'published';
  rewritten?: boolean;
  rewrittenPostId?: string;
  targetKeywords?: string[];
}

export type IndustryNewsItem = IndustryNews;

export interface JekyllConfig {
  title: string;
  tagline?: string;
  slogan: string;
  company_name?: string;
  tax_id?: string;
  logo?: string;
  favicon?: string;
  allow_search_engine: boolean;
  google_verify: string;
  bing_verify: string;
  google_analytics: string;
  google_tag_manager_id: string;
  google_plus: string;
  subcriber_url: string;
  email: string;
  description: string;
  baseurl: string;
  url: string;
  phone?: string;
  address?: string;
  twitter_username?: string;
  github_username?: string;
  facebook_page?: string;
  markdown?: string;
  permalink?: string;
  plugins?: string[];
  theme?: string;
  // Appearance & UI Theme Customization
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: 'sans' | 'space' | 'inter' | 'roboto' | 'merriweather';
  layoutWidth?: 'contained' | 'wide' | 'full';
  headerStyle?: 'standard' | 'minimal' | 'centered';
  headerNotice?: string;
  showHeaderTopBar?: boolean;
  footerStyle?: 'columns' | 'compact' | 'simple';
  footerNotice?: string;
  footerCopyright?: string;
  sidebarPosition?: 'right' | 'left' | 'none';
  sidebarCtaTitle?: string;
  sidebarCtaPhone?: string;
  sidebarCtaDesc?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  ctaHeading?: string;
  ctaSubheading?: string;
  // Custom Injected Code (Header, Body Open, Body Close / Footer, Custom CSS & JS)
  customHeadCode?: string;
  customBodyOpenCode?: string;
  customFooterCode?: string;
  customCss?: string;
  customJs?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  path?: string; // e.g. "/images/blog/be-tong-thuong-pham-an-gia-binh.jpg"
  folder?: string; // e.g. "/images/blog" or "/images/du-an"
  type: 'image' | 'video' | 'document';
  size: string;
  uploadedAt: string;
  dimensions?: string;
  dataUrl?: string;
}

export interface IntegrationConfig {
  googleAnalyticsId: string;
  searchConsoleTag: string;
  searchConsoleCode?: string;
  isSynced: boolean;
  isAutoSyncEnabled?: boolean;
  lastSyncedAt?: string;
  syncedPageviews?: number;
  indexedUrls?: number;
  searchImpressions?: number;
  searchClicks?: number;
  averageCtr?: number;
  topRankKeywords?: number;
  realtimeVisitors?: number;
  engagementRate?: number;
  googleServiceAccountJson?: string;
  gaPropertyId?: string;
  verifiedDomain?: string;
  tagStatus?: 'active' | 'pending' | 'unverified';
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt?: string;
}

export type PageLayoutType = 'standard' | 'hero-content' | 'services-grid' | 'pricing-table' | 'contact-map' | 'fullwidth';

export interface PageSection {
  id: string;
  title: string;
  type: 'hero' | 'text' | 'rich_text' | 'features' | 'cta' | 'table' | 'faq' | 'contact_form' | (string & {});
  content: string;
  badge?: string;
  buttonText?: string;
  buttonLink?: string;
  items?: (string | { title: string; description: string; icon?: string })[];
}

export interface SitePage {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  heroImage?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  menuTitle?: string;
  showInMenu: boolean;
  inMenu?: boolean;
  menuLocation?: 'header' | 'footer' | 'both' | 'none';
  menuOrder?: number;
  layout?: PageLayoutType;
  summary?: string;
  content?: string;
  sections?: PageSection[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[] | string;
  focusKeywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  metaRobots?: string;
  noIndex?: boolean;
  isPublished?: boolean;
  status?: 'published' | 'draft';
  updatedAt?: string;
}

export type AiProviderType = 'gemini' | 'openai' | 'grok' | 'claude' | 'deepseek';

export interface ProviderDetail {
  apiKey?: string;
  model: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AiSettingsConfig {
  activeProvider: AiProviderType;
  gemini: ProviderDetail;
  openai: ProviderDetail;
  grok: ProviderDetail;
  claude: ProviderDetail;
  deepseek: ProviderDetail;
  systemPrompt?: string;
  lastTestedAt?: string;
  testStatus?: 'idle' | 'success' | 'failed';
  testMessage?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  title?: string;
  url: string;
  target?: '_self' | '_blank';
  icon?: string;
  order: number;
  badge?: string;
  isExternal?: boolean;
  isActive?: boolean;
  children?: MenuItem[];
}

export interface SiteMenu {
  id: string; // 'header-main' | 'footer-services' | 'footer-links' | 'mobile-quick'
  name: string;
  title?: string;
  location: 'header' | 'footer-services' | 'footer-links' | 'mobile';
  items: MenuItem[];
}

export interface SchemaSettings {
  enabled: boolean;
  organizationName: string;
  alternateName?: string;
  legalName?: string;
  taxId?: string;
  vatID?: string;
  businessType: string; // 'LocalBusiness' | 'ConstructionBusiness' | 'Corporation'
  logoUrl?: string;
  publisherLogo?: string;
  imageUrl?: string;
  description: string;
  phone?: string;
  telephone?: string;
  email: string;
  url?: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  latitude?: number | string;
  longitude?: number | string;
  openingHours: string;
  priceRange: string;
  areaServed?: string;
  sameAs?: string[];
  // Post schema settings
  postDefaultType?: 'BlogPosting' | 'Article' | 'NewsArticle' | 'TechArticle';
  postDefaultAuthor?: string;
  defaultAuthorName?: string;
  authorType?: string;
  postAuthorUrl?: string;
  postPublisherLogo?: string;
  enableBreadcrumbs?: boolean;
  enableBreadcrumbSchema?: boolean;
  enableSiteNavigationSchema?: boolean;
  enableFaqSchema?: boolean;
  autoExtractFaqSchema?: boolean;
  // Page schema settings
  pageDefaultType?: 'WebPage' | 'AboutPage' | 'ContactPage';
  customJsonLd?: string;
}

export interface AiSchedulerConfig {
  isEnabled: boolean;
  enabled?: boolean;
  frequencyHours?: number; // 4, 8, 12, 24, 48
  frequency?: 'daily' | 'every_2_days' | 'weekly';
  publishTime?: string;
  publishStatus?: 'published' | 'draft';
  targetCategory: string;
  focusTopics?: string[];
  focusTopic?: string;
  primaryKeyword: string;
  secondaryKeywords: string[] | string;
  minWordCount: number; // default 1000
  insertInternalLinks?: boolean;
  autoInsertInternalLinks?: boolean;
  selectedInternalLinks?: { title: string; url: string }[];
  lastRunAt?: string;
  nextRunAt?: string;
  totalPublished?: number;
  historyLogs?: {
    id: string;
    timestamp: string;
    newsTitle: string;
    generatedTitle: string;
    wordCount: number;
    status: string;
  }[];
  logs: {
    id: string;
    timestamp: string;
    postTitle: string;
    wordCount: number;
    keywordsUsed: string[];
    internalLinksCount: number;
    status: 'success' | 'failed';
  }[];
}

export type SchedulerLogItem = NonNullable<AiSchedulerConfig['logs']>[0];

export interface MediaFolder {
  id: string;
  name: string; // e.g., 'blog', 'du-an', 'tram-tron'
  path: string; // e.g., '/images/blog'
  description?: string;
  color?: string;
  itemCount?: number;
  totalSizeMb?: number;
  createdAt: string;
}

export type MediaFolderItem = MediaFolder;

export interface TrashItem {
  id: string;
  originalId: string;
  type: 'post' | 'project' | 'page' | 'media' | 'category' | 'lead';
  title: string;
  description?: string;
  data: any;
  deletedAt: string;
  expiresAt: string;
}
