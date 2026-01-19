// Central export file for all media data structures
// Import all data and types from the media directory

// Data exports
export { default as albums, getFeaturedAlbums, getAlbumsByCategory, getAlbumBySpotifyId } from './albums';
export { default as audioTracks } from './audio';
export { default as featuredItems } from './featured';
export { default as streamingData, getFeaturedStreamingData, getStreamingDataBySong, getStreamingDataByAlbum, getAllPlatforms, getFeaturedLinksForSong, platformConfig } from './streamingLinks';
export { default as videoItems } from './video';
export { default as videoGallery, getVideosByCategory, getFeaturedVideosByCategory, getAllFeaturedVideos, getVideoById, getVideosByTag, getVideosByArtist, getMostViewedVideos, getRecentVideos, getAllCategories, categoryConfig } from './videoGallery';

// Type exports
export type {
  // Core types
  StreamingPlatform,
  StreamingLinks,
  StreamingLink,
  PlatformConfig,
  
  // Album types
  Album,
  AlbumCategory,
  
  // Video types
  VideoItem,
  GalleryVideoItem,
  VideoCategory,
  VideoMetrics,
  VideoCategoryConfig,
  
  // Audio types
  AudioTrack,
  
  // Featured content types
  FeaturedItem,
  FeaturedCategory,
  
  // Streaming data types
  SongStreamingData,
  
  // Media page types
  MediaHeroItem,
  MediaSection,
  
  // Search and filter types
  SearchFilters,
  SearchResult,
  
  // API types
  ApiResponse,
  MediaApiResponse,
  
  // Utility types
  SortOrder,
  SortField,
  SortOptions,
  PaginationOptions,
  
  // Component prop types
  MediaPlayerProps,
  AlbumEmbedProps,
  StreamingButtonsProps,
  VideoGalleryProps,
  
  // Error types
  MediaError,
  MediaErrorType,
  
  // Configuration types
  MediaConfig,
  
  // Helper types
  MediaItemType,
  MediaCollection,
  MediaSummary,
  StreamingLinkSummary,
  MediaBreadcrumb,
  
  // Type guards
  isAlbum,
  isVideo,
  isFeaturedItem,
  isStreamingData
} from './types';

// Consolidated data object for easy importing
export const mediaData = {
  albums,
  audioTracks,
  featuredItems,
  streamingData,
  videoItems,
  videoGallery,
  
  // Helper functions
  helpers: {
    // Album helpers
    getFeaturedAlbums,
    getAlbumsByCategory,
    getAlbumBySpotifyId,
    
    // Video helpers
    getVideosByCategory,
    getFeaturedVideosByCategory,
    getAllFeaturedVideos,
    getVideoById,
    getVideosByTag,
    getVideosByArtist,
    getMostViewedVideos,
    getRecentVideos,
    getAllCategories,
    
    // Streaming helpers
    getFeaturedStreamingData,
    getStreamingDataBySong,
    getStreamingDataByAlbum,
    getAllPlatforms,
    getFeaturedLinksForSong
  },
  
  // Configuration
  config: {
    categoryConfig,
    platformConfig
  }
};

// Quick access collections for common use cases
export const quickAccess = {
  // Top content for hero sections
  heroContent: {
    featuredAlbums: getFeaturedAlbums(),
    featuredVideos: getAllFeaturedVideos().slice(0, 4), // Top 4 for carousel
    topStreamingSongs: getFeaturedStreamingData().slice(0, 6)
  },
  
  // Greatest hits compilation
  greatestHits: {
    videos: getVideosByCategory('greatest-hits'),
    songs: getFeaturedStreamingData(),
    albums: getFeaturedAlbums()
  },
  
  // Live performance content
  liveContent: {
    videos: getVideosByCategory('live-performances'),
    albums: getAlbumsByCategory('live-album')
  },
  
  // Broadway show content
  broadwayShows: {
    videos: getVideosByCategory('broadway-shows'),
    albums: getAlbumsByCategory('original-cast')
  },
  
  // Most popular content based on metrics
  popular: {
    videos: getMostViewedVideos(10),
    recentVideos: getRecentVideos(8)
  }
};

// Search and filter utilities
export const searchUtilities = {
  searchAllContent: (query: string) => {
    const results: any[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Search albums
    albums.forEach(album => {
      if (album.title.toLowerCase().includes(lowerQuery) || 
          album.artist?.toLowerCase().includes(lowerQuery) ||
          album.genre.some(g => g.toLowerCase().includes(lowerQuery))) {
        results.push({ type: 'album', item: album, score: 1 });
      }
    });
    
    // Search videos
    videoGallery.forEach(video => {
      if (video.title.toLowerCase().includes(lowerQuery) ||
          video.artist?.toLowerCase().includes(lowerQuery) ||
          video.tags.some(t => t.toLowerCase().includes(lowerQuery))) {
        results.push({ type: 'video', item: video, score: 1 });
      }
    });
    
    // Search streaming data
    streamingData.forEach(song => {
      if (song.songTitle.toLowerCase().includes(lowerQuery) ||
          song.artist?.toLowerCase().includes(lowerQuery) ||
          song.album?.toLowerCase().includes(lowerQuery)) {
        results.push({ type: 'song', item: song, score: 1 });
      }
    });
    
    return results;
  },
  
  filterByCategory: (category: string) => {
    return {
      videos: getVideosByCategory(category as VideoCategory),
      albums: getAlbumsByCategory(category as AlbumCategory)
    };
  },
  
  filterByArtist: (artistName: string) => {
    return {
      videos: getVideosByArtist(artistName),
      albums: albums.filter(album => album.artist?.toLowerCase().includes(artistName.toLowerCase())),
      songs: streamingData.filter(song => song.artist?.toLowerCase().includes(artistName.toLowerCase()))
    };
  }
};

// Data validation utilities
export const validation = {
  validateAlbum: (album: any): album is Album => {
    return album && 
           typeof album.title === 'string' &&
           typeof album.spotifyId === 'string' &&
           typeof album.releaseYear === 'number' &&
           Array.isArray(album.genre) &&
           typeof album.streamingLinks === 'object';
  },
  
  validateVideo: (video: any): video is GalleryVideoItem => {
    return video &&
           typeof video.id === 'string' &&
           typeof video.title === 'string' &&
           typeof video.category === 'string' &&
           Array.isArray(video.tags) &&
           typeof video.featured === 'boolean';
  },
  
  validateStreamingData: (data: any): data is SongStreamingData => {
    return data &&
           typeof data.songTitle === 'string' &&
           Array.isArray(data.links) &&
           typeof data.featured === 'boolean';
  }
};