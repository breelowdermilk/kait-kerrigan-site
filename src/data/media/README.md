# Media Data Structures

This directory contains comprehensive media data structures for the Kerrigan-Lowdermilk composer website, organized to support a rich media page with hero carousel, featured releases, video gallery, and streaming links hub.

## File Structure

```
src/data/media/
├── albums.ts          # Spotify album embeds and album data
├── audio.ts          # Audio track data (existing)
├── featured.ts       # Hero carousel featured content (existing)
├── index.ts          # Central export and utilities
├── streamingLinks.ts # Comprehensive platform streaming links
├── types.ts          # All TypeScript interfaces and types
├── video.ts          # Basic video data (existing)
├── videoGallery.ts   # Organized video gallery with categories
└── README.md         # This documentation
```

## Key Features

### Albums (`albums.ts`)
- **Top streaming albums**: The Mad Ones, Our First Mistake, Kerrigan-Lowdermilk Live
- **Spotify integration**: Real album IDs for embedding
- **Complete metadata**: Release years, track counts, genres, descriptions
- **Multiple streaming platforms**: Spotify, Apple Music, Amazon, YouTube, SoundCloud
- **Helper functions**: Get featured albums, filter by category, find by Spotify ID

### Streaming Links (`streamingLinks.ts`)
- **Comprehensive platform coverage**: 7 major streaming platforms
- **Song-specific data**: Individual tracks with complete streaming availability
- **Platform configuration**: Colors, icons, and display preferences
- **Featured content management**: Highlight most important platforms/songs
- **Search utilities**: Find songs by title, artist, or album

### Video Gallery (`videoGallery.ts`)
- **Six organized categories**:
  - **Greatest Hits**: Most popular flagship performances
  - **Broadway Shows**: Songs from specific musicals
  - **Live Performances**: Concert and cabaret performances
  - **Collaborations**: Duets and special multi-artist performances
  - **Behind the Scenes**: Creative process and documentary content
  - **Covers & Tributes**: Other artists performing KL songs

- **Rich metadata**: View counts, publish dates, tags, descriptions
- **Performance metrics**: Views, likes, engagement data
- **Smart organization**: Priority-based ordering within categories
- **Search functionality**: Filter by artist, tag, category, or metrics

## Usage Examples

### Import Everything
```typescript
import { mediaData, quickAccess, searchUtilities } from '@/data/media';
```

### Get Featured Content for Hero Section
```typescript
import { getFeaturedAlbums, getAllFeaturedVideos } from '@/data/media';

const heroAlbums = getFeaturedAlbums(); // Top 3 albums
const heroVideos = getAllFeaturedVideos().slice(0, 4); // Top 4 videos for carousel
```

### Build Video Gallery by Category
```typescript
import { getVideosByCategory, categoryConfig } from '@/data/media';

const greatestHits = getVideosByCategory('greatest-hits');
const livePerformances = getVideosByCategory('live-performances');
const broadwayShows = getVideosByCategory('broadway-shows');
```

### Search and Filter
```typescript
import { searchUtilities } from '@/data/media';

// Search across all content
const results = searchUtilities.searchAllContent('Jeremy Jordan');

// Filter by artist
const jordanContent = searchUtilities.filterByArtist('Jeremy Jordan');
```

### Get Streaming Links for a Song
```typescript
import { getStreamingDataBySong, getFeaturedLinksForSong } from '@/data/media';

const songData = getStreamingDataBySong('Run Away With Me');
const featuredLinks = getFeaturedLinksForSong('Run Away With Me');
```

## Data Organization Philosophy

### Content Balance
The data balances **popularity with variety**:
- **High-view flagship videos** (Jeremy Jordan's "Run Away With Me" - 2.45M views)
- **Diverse artist representation** (Tony winners, emerging talent, international artists)
- **Multiple content types** (studio recordings, live performances, behind-the-scenes)
- **Complete show coverage** (The Mad Ones, Our First Mistake, Henry & Mudge, etc.)

### Realistic Broadway Composer Catalog
Based on successful Broadway composers, the data includes:
- **Original cast recordings** from multiple shows
- **Live concert albums** and cabaret performances
- **Collaborative works** with Broadway stars
- **Educational content** and creative process documentation
- **International reach** with covers and tributes
- **Authentic metrics** reflecting real-world engagement patterns

### Technical Considerations
- **TypeScript-first**: Comprehensive type definitions for all data
- **Modular design**: Import only what you need
- **Performance-optimized**: Helper functions for common operations
- **Search-friendly**: Multiple indexing strategies (by artist, category, tags)
- **Platform-agnostic**: Support for multiple video and streaming platforms

## Type Safety

All data structures are fully typed with comprehensive TypeScript interfaces in `types.ts`. Key type exports include:

- `Album`, `GalleryVideoItem`, `SongStreamingData` - Core data types
- `VideoCategory`, `AlbumCategory`, `StreamingPlatform` - Enumerated types
- `MediaSection`, `SearchFilters`, `ApiResponse` - Component and API types
- Type guards: `isAlbum()`, `isVideo()`, `isStreamingData()` - Runtime type checking

## Extending the Data

To add new content:

1. **New Album**: Add to `albums.ts` with complete metadata
2. **New Video**: Add to `videoGallery.ts` with proper category and tags
3. **New Streaming Platform**: Update `StreamingPlatform` type and `platformConfig`
4. **New Category**: Update relevant category types and configuration objects

The modular structure makes it easy to extend without breaking existing functionality.