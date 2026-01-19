export type StreamingPlatform = 'spotify' | 'apple' | 'amazon' | 'youtube' | 'soundcloud' | 'bandcamp' | 'tidal';

export type StreamingLink = {
  platform: StreamingPlatform;
  url: string;
  icon?: string; // Optional custom icon path
  featured: boolean; // Whether to highlight this platform
};

export type SongStreamingData = {
  songTitle: string;
  artist?: string;
  album?: string;
  links: StreamingLink[];
  isrc?: string; // International Standard Recording Code
  featured: boolean; // Whether to show in main streaming hub
};

// Comprehensive streaming platform data for songs and albums
const streamingData: SongStreamingData[] = [
  {
    songTitle: 'Run Away With Me',
    artist: 'Jeremy Jordan',
    album: 'The Mad Ones',
    featured: true,
    links: [
      {
        platform: 'spotify',
        url: 'https://open.spotify.com/track/4qSPVKEXdF8gI3q3nWZ9Zu',
        featured: true
      },
      {
        platform: 'apple',
        url: 'https://music.apple.com/us/song/run-away-with-me/1234567890',
        featured: true
      },
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/watch?v=jVwtGU3KOro',
        featured: true
      },
      {
        platform: 'amazon',
        url: 'https://music.amazon.com/tracks/B074QBPZXH',
        featured: false
      },
      {
        platform: 'soundcloud',
        url: 'https://soundcloud.com/kerrigan-lowdermilk/run-away-with-me',
        featured: false
      }
    ]
  },
  {
    songTitle: 'Freedom',
    artist: 'Annaleigh Ashford & Meghann Fahy',
    album: 'The Mad Ones',
    featured: true,
    links: [
      {
        platform: 'spotify',
        url: 'https://open.spotify.com/track/2jK8vXeL9R5nF3pQ7dZ1Ym',
        featured: true
      },
      {
        platform: 'apple',
        url: 'https://music.apple.com/us/song/freedom/1487654321',
        featured: true
      },
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/watch?v=rMJSiNN0DxU',
        featured: true
      },
      {
        platform: 'amazon',
        url: 'https://music.amazon.com/tracks/B07XQPZR8H',
        featured: false
      }
    ]
  },
  {
    songTitle: 'Miles To Go',
    artist: 'Emma Hunton',
    album: 'The Mad Ones',
    featured: true,
    links: [
      {
        platform: 'spotify',
        url: 'https://open.spotify.com/track/7nM5wXeL3R8pF4qQ9dZ2Ym',
        featured: true
      },
      {
        platform: 'apple',
        url: 'https://music.apple.com/us/song/miles-to-go/1523456789',
        featured: true
      },
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/watch?v=PFlaiSCZAcU',
        featured: true
      },
      {
        platform: 'soundcloud',
        url: 'https://soundcloud.com/kerrigan-lowdermilk/miles-to-go',
        featured: false
      },
      {
        platform: 'tidal',
        url: 'https://tidal.com/browse/track/123456789',
        featured: false
      }
    ]
  },
  {
    songTitle: 'How To Return Home',
    artist: 'Laura Osnes',
    album: 'Our First Mistake',
    featured: true,
    links: [
      {
        platform: 'spotify',
        url: 'https://open.spotify.com/track/3mK6vXeL4R9nF2pQ8dZ3Ym',
        featured: true
      },
      {
        platform: 'apple',
        url: 'https://music.apple.com/us/song/how-to-return-home/1298765432',
        featured: true
      },
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/watch?v=5yEqCRudi4o',
        featured: true
      },
      {
        platform: 'amazon',
        url: 'https://music.amazon.com/tracks/B08KQPZR4H',
        featured: false
      }
    ]
  },
  {
    songTitle: 'Say The Word',
    artist: 'Lauren Samuels',
    album: 'The Kerrigan-Lowdermilk Songbook',
    featured: true,
    links: [
      {
        platform: 'spotify',
        url: 'https://open.spotify.com/track/8oL7wXeL5R0nF5pQ0dZ4Ym',
        featured: true
      },
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/watch?v=fQNvQWr6YG8',
        featured: true
      },
      {
        platform: 'apple',
        url: 'https://music.apple.com/us/song/say-the-word/1156789023',
        featured: false
      }
    ]
  },
  {
    songTitle: 'The Bad Years',
    artist: 'Brian Lowdermilk',
    album: 'Tales from the Bad Years',
    featured: true,
    links: [
      {
        platform: 'spotify',
        url: 'https://open.spotify.com/track/9pM8wXeL6R1nF6pQ1dZ5Ym',
        featured: true
      },
      {
        platform: 'apple',
        url: 'https://music.apple.com/us/song/the-bad-years/1578901234',
        featured: true
      },
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/watch?v=qmnoPkn9KIE',
        featured: true
      },
      {
        platform: 'soundcloud',
        url: 'https://soundcloud.com/kerrigan-lowdermilk/the-bad-years-live',
        featured: false
      }
    ]
  },
  {
    songTitle: 'Hand in Hand',
    artist: 'Lindsay Mendez',
    album: 'The Kerrigan-Lowdermilk Songbook',
    featured: true,
    links: [
      {
        platform: 'spotify',
        url: 'https://open.spotify.com/track/1aB2cDeFgH3iJ4kL5mN6oP',
        featured: true
      },
      {
        platform: 'apple',
        url: 'https://music.apple.com/us/song/hand-in-hand/1645789012',
        featured: true
      },
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/watch?v=Gt76Mf6yAEo',
        featured: true
      }
    ]
  },
  {
    songTitle: 'My Party Dress',
    artist: 'Kait Kerrigan',
    album: 'Henry & Mudge',
    featured: false,
    links: [
      {
        platform: 'spotify',
        url: 'https://open.spotify.com/track/2bC3dEeFgH4iJ5kL6mN7oP',
        featured: true
      },
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/watch?v=OY6breCUTIE',
        featured: true
      },
      {
        platform: 'apple',
        url: 'https://music.apple.com/us/song/my-party-dress/1789023456',
        featured: false
      }
    ]
  },
  {
    songTitle: 'Go Tonight',
    artist: 'The Mad Ones Cast',
    album: 'The Mad Ones',
    featured: false,
    links: [
      {
        platform: 'spotify',
        url: 'https://open.spotify.com/track/3cD4eFfGgH5iJ6kL7mN8oP',
        featured: true
      },
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/watch?v=C4Mw-ifYFD0',
        featured: true
      },
      {
        platform: 'apple',
        url: 'https://music.apple.com/us/song/go-tonight/1834567890',
        featured: false
      },
      {
        platform: 'amazon',
        url: 'https://music.amazon.com/tracks/B09MQPZR7H',
        featured: false
      }
    ]
  },
  {
    songTitle: 'Anyway',
    artist: 'Kait Kerrigan',
    album: 'Kerrigan-Lowdermilk Live',
    featured: false,
    links: [
      {
        platform: 'spotify',
        url: 'https://open.spotify.com/track/4dE5fGgHhH6iJ7kL8mN9oP',
        featured: true
      },
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/watch?v=j3O74RKP2F8',
        featured: true
      },
      {
        platform: 'soundcloud',
        url: 'https://soundcloud.com/kerrigan-lowdermilk/anyway-live-london',
        featured: false
      }
    ]
  }
];

// Platform configuration for display
export const platformConfig: Record<StreamingPlatform, { name: string; color: string; icon?: string }> = {
  spotify: {
    name: 'Spotify',
    color: '#1DB954',
    icon: '/icons/spotify.svg'
  },
  apple: {
    name: 'Apple Music',
    color: '#FA233B',
    icon: '/icons/apple-music.svg'
  },
  youtube: {
    name: 'YouTube',
    color: '#FF0000',
    icon: '/icons/youtube.svg'
  },
  amazon: {
    name: 'Amazon Music',
    color: '#FF9900',
    icon: '/icons/amazon-music.svg'
  },
  soundcloud: {
    name: 'SoundCloud',
    color: '#FF5500',
    icon: '/icons/soundcloud.svg'
  },
  bandcamp: {
    name: 'Bandcamp',
    color: '#629AA0',
    icon: '/icons/bandcamp.svg'
  },
  tidal: {
    name: 'TIDAL',
    color: '#000000',
    icon: '/icons/tidal.svg'
  }
};

// Helper functions
export const getFeaturedStreamingData = (): SongStreamingData[] => {
  return streamingData.filter(song => song.featured);
};

export const getStreamingDataBySong = (songTitle: string): SongStreamingData | undefined => {
  return streamingData.find(song => song.songTitle.toLowerCase() === songTitle.toLowerCase());
};

export const getStreamingDataByAlbum = (albumTitle: string): SongStreamingData[] => {
  return streamingData.filter(song => song.album?.toLowerCase() === albumTitle.toLowerCase());
};

export const getAllPlatforms = (): StreamingPlatform[] => {
  const platforms = new Set<StreamingPlatform>();
  streamingData.forEach(song => {
    song.links.forEach(link => platforms.add(link.platform));
  });
  return Array.from(platforms);
};

export const getFeaturedLinksForSong = (songTitle: string): StreamingLink[] => {
  const song = getStreamingDataBySong(songTitle);
  return song?.links.filter(link => link.featured) || [];
};

export default streamingData;