// Core Media Types for Kerrigan-Lowdermilk Composer Website
// This file consolidates all TypeScript interfaces used across media data structures

// ============================================================================
// STREAMING & PLATFORM TYPES
// ============================================================================

export type StreamingPlatform = 'spotify' | 'apple' | 'amazon' | 'youtube' | 'soundcloud' | 'bandcamp' | 'tidal';

export interface StreamingLinks {
  spotify?: string;
  apple?: string;
  amazon?: string;
  youtube?: string;
  soundcloud?: string;
  bandcamp?: string;
  tidal?: string;
}

export interface StreamingLink {
  platform: StreamingPlatform;
  url: string;
  icon?: string; // Optional custom icon path
  featured: boolean; // Whether to highlight this platform
}

export interface PlatformConfig {
  name: string;
  color: string;
  icon?: string;
}

// ============================================================================
// ALBUM TYPES
// ============================================================================

export type AlbumCategory = 'original-cast' | 'live-album' | 'studio' | 'compilation';

export interface Album {
  title: string;
  spotifyId: string; // The Spotify album ID for embedding
  artist?: string;
  releaseYear: number;
  cover?: string; // Fallback if Spotify embed doesn't load
  description: string;
  trackCount: number;
  genre: string[];
  streamingLinks: StreamingLinks;
  featured: boolean; // Whether to show in hero carousel
  category: AlbumCategory;
}

// ============================================================================
// VIDEO TYPES
// ============================================================================

export type VideoCategory = 'greatest-hits' | 'broadway-shows' | 'live-performances' | 'collaborations' | 'behind-the-scenes' | 'covers-tributes';

export interface VideoMetrics {
  views?: number;
  likes?: number;
  comments?: number;
  publishedDate?: string;
}

export interface VideoItem {
  title: string;
  youtubeId?: string;
  src?: string;
  poster?: string;
  notes?: string;
}

export interface GalleryVideoItem {
  id: string; // Unique identifier for the video
  title: string;
  youtubeId?: string;
  vimeoId?: string;
  src?: string; // Direct video URL
  poster?: string; // Thumbnail image
  artist?: string;
  album?: string;
  duration?: string; // e.g., "3:42"
  description: string;
  category: VideoCategory;
  tags: string[]; // For filtering and search
  featured: boolean; // Whether to highlight in category
  priority: number; // For ordering within category (1 = highest)
  metrics?: VideoMetrics;
  streamingLinks?: StreamingLinks;
}

export interface VideoCategoryConfig {
  name: string;
  description: string;
  color: string;
}

// ============================================================================
// AUDIO TYPES
// ============================================================================

export interface AudioTrack {
  title: string;
  src: string;
  artist?: string;
  cover?: string;
  duration?: string;
  notes?: string;
}

// ============================================================================
// FEATURED CONTENT TYPES
// ============================================================================

export type FeaturedCategory = 'flagship' | 'live' | 'official' | 'collaboration';

export interface FeaturedItem {
  title: string;
  youtubeId: string;
  artist?: string;
  notes: string;
  streamingLinks?: StreamingLinks;
  category: FeaturedCategory;
}

// ============================================================================
// STREAMING DATA TYPES
// ============================================================================

export interface SongStreamingData {
  songTitle: string;
  artist?: string;
  album?: string;
  links: StreamingLink[];
  isrc?: string; // International Standard Recording Code
  featured: boolean; // Whether to show in main streaming hub
}

// ============================================================================
// MEDIA PAGE COMPONENT TYPES
// ============================================================================

export interface MediaHeroItem {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  videoId?: string;
  type: 'album' | 'video' | 'playlist';
  ctaText?: string;
  ctaLink?: string;
}

export interface MediaSection {
  id: string;
  title: string;
  description?: string;
  type: 'hero-carousel' | 'featured-releases' | 'video-gallery' | 'streaming-hub' | 'album-grid';
  data: any[]; // Will be typed specifically when used
  config?: {
    showControls?: boolean;
    autoplay?: boolean;
    itemsPerView?: number;
    category?: string;
  };
}

// ============================================================================
// SEARCH & FILTER TYPES
// ============================================================================

export interface SearchFilters {
  category?: VideoCategory | AlbumCategory;
  artist?: string;
  album?: string;
  tag?: string;
  year?: number;
  platform?: StreamingPlatform;
}

export interface SearchResult {
  type: 'video' | 'album' | 'song' | 'artist';
  item: GalleryVideoItem | Album | SongStreamingData;
  score: number; // Relevance score for ranking
  matchedFields: string[]; // Which fields matched the search
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  metadata?: {
    total: number;
    page?: number;
    limit?: number;
  };
}

export interface MediaApiResponse extends ApiResponse<{
  albums: Album[];
  videos: GalleryVideoItem[];
  featured: FeaturedItem[];
  streaming: SongStreamingData[];
}> {}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type SortOrder = 'asc' | 'desc';

export type SortField = 'title' | 'artist' | 'releaseYear' | 'views' | 'publishedDate' | 'priority' | 'duration';

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset?: number;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface MediaPlayerProps {
  item: GalleryVideoItem | AudioTrack;
  autoplay?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
}

export interface AlbumEmbedProps {
  album: Album;
  width?: string | number;
  height?: string | number;
  theme?: 'light' | 'dark';
}

export interface StreamingButtonsProps {
  links: StreamingLinks;
  featured?: StreamingPlatform[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  size?: 'small' | 'medium' | 'large';
}

export interface VideoGalleryProps {
  videos: GalleryVideoItem[];
  category?: VideoCategory;
  showFilters?: boolean;
  showSearch?: boolean;
  itemsPerPage?: number;
  layout?: 'grid' | 'list' | 'masonry';
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface MediaError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

export type MediaErrorType = 'LOADING_ERROR' | 'NETWORK_ERROR' | 'INVALID_DATA' | 'NOT_FOUND' | 'PLATFORM_ERROR';

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface MediaConfig {
  platforms: Record<StreamingPlatform, PlatformConfig>;
  categories: Record<VideoCategory, VideoCategoryConfig>;
  albumCategories: Record<AlbumCategory, { name: string; description: string }>;
  defaults: {
    itemsPerPage: number;
    autoplay: boolean;
    showMetrics: boolean;
    embedWidth: number;
    embedHeight: number;
  };
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isAlbum = (item: any): item is Album => {
  return item && typeof item.spotifyId === 'string' && typeof item.title === 'string';
};

export const isVideo = (item: any): item is GalleryVideoItem => {
  return item && typeof item.id === 'string' && (item.youtubeId || item.vimeoId || item.src);
};

export const isFeaturedItem = (item: any): item is FeaturedItem => {
  return item && typeof item.youtubeId === 'string' && typeof item.category === 'string';
};

export const isStreamingData = (item: any): item is SongStreamingData => {
  return item && typeof item.songTitle === 'string' && Array.isArray(item.links);
};

// ============================================================================
// HELPER TYPE UTILITIES
// ============================================================================

export type MediaItemType = Album | GalleryVideoItem | FeaturedItem | SongStreamingData | AudioTrack;

export type MediaCollection<T extends MediaItemType> = {
  items: T[];
  total: number;
  featured: T[];
  categories: Record<string, T[]>;
};

// Extract just the essential fields for lightweight operations
export type MediaSummary<T> = Pick<T, 'title' | 'artist'> & {
  id: string;
  type: 'album' | 'video' | 'song';
};

export type StreamingLinkSummary = Pick<StreamingLink, 'platform' | 'url'>;

// For building navigation and breadcrumbs
export type MediaBreadcrumb = {
  label: string;
  href?: string;
  current: boolean;
};