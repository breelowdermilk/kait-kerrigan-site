export type VideoCategory = 'greatest-hits' | 'broadway-shows' | 'live-performances' | 'collaborations' | 'behind-the-scenes' | 'covers-tributes';

export type VideoMetrics = {
  views?: number;
  likes?: number;
  comments?: number;
  publishedDate?: string;
};

export type GalleryVideoItem = {
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
  streamingLinks?: {
    spotify?: string;
    apple?: string;
    soundcloud?: string;
    youtube?: string;
  };
};

// Comprehensive video gallery organized by categories
const videoGallery: GalleryVideoItem[] = [
  // GREATEST HITS - Most popular and flagship videos
  {
    id: 'run-away-with-me-jeremy',
    title: 'Run Away With Me',
    youtubeId: 'jVwtGU3KOro',
    artist: 'Jeremy Jordan (live)',
    album: 'The Mad Ones',
    duration: '4:12',
    description: 'Flagship performance from the KL channel; most-cited version. Jeremy Jordan delivers a powerhouse performance of this beloved anthem.',
    category: 'greatest-hits',
    tags: ['Jeremy Jordan', 'The Mad Ones', 'flagship', 'live performance', 'flagship'],
    featured: true,
    priority: 1,
    metrics: {
      views: 2450000,
      publishedDate: '2017-08-15'
    },
    streamingLinks: {
      spotify: 'https://open.spotify.com/track/4qSPVKEXdF8gI3q3nWZ9Zu',
      apple: 'https://music.apple.com/us/song/run-away-with-me/1234567890',
      youtube: 'https://www.youtube.com/watch?v=jVwtGU3KOro'
    }
  },
  {
    id: 'freedom-ashford-fahy',
    title: 'Freedom',
    youtubeId: 'rMJSiNN0DxU',
    artist: 'Annaleigh Ashford & Meghann Fahy',
    album: 'The Mad Ones',
    duration: '3:58',
    description: 'Signature duet; staple of KL concerts. Two powerhouse performers deliver this emotionally charged song about breaking free.',
    category: 'greatest-hits',
    tags: ['Annaleigh Ashford', 'Meghann Fahy', 'duet', 'The Mad Ones', 'Tony winner'],
    featured: true,
    priority: 2,
    metrics: {
      views: 1890000,
      publishedDate: '2017-09-22'
    },
    streamingLinks: {
      spotify: 'https://open.spotify.com/track/2jK8vXeL9R5nF3pQ7dZ1Ym',
      apple: 'https://music.apple.com/us/song/freedom/1487654321',
      youtube: 'https://www.youtube.com/watch?v=rMJSiNN0DxU'
    }
  },
  {
    id: 'how-to-return-home-osnes',
    title: 'How To Return Home',
    youtubeId: '5yEqCRudi4o',
    artist: 'Laura Osnes',
    album: 'Our First Mistake',
    duration: '4:35',
    description: 'Definitive early capture; widely referenced. Laura Osnes brings her signature warmth to this beautiful ballad.',
    category: 'greatest-hits',
    tags: ['Laura Osnes', 'Our First Mistake', 'ballad', 'early work', 'definitive'],
    featured: true,
    priority: 3,
    metrics: {
      views: 1567000,
      publishedDate: '2016-03-10'
    }
  },
  {
    id: 'hand-in-hand-mendez',
    title: 'Hand in Hand',
    youtubeId: 'Gt76Mf6yAEo',
    artist: 'Lindsay Mendez',
    duration: '3:47',
    description: 'Tony winner Lindsay Mendez; widely shared rendition. A stunning performance that showcases both vocal power and emotional depth.',
    category: 'greatest-hits',
    tags: ['Lindsay Mendez', 'Tony winner', 'vocal power', 'emotional'],
    featured: true,
    priority: 4,
    metrics: {
      views: 1234000,
      publishedDate: '2018-11-08'
    }
  },
  {
    id: 'say-the-word-samuels',
    title: 'Say The Word',
    youtubeId: 'fQNvQWr6YG8',
    artist: 'Lauren Samuels',
    duration: '3:22',
    description: 'Fan favorite cut from Samantha Brown/Mad Ones lineage. Lauren Samuels delivers this poignant song with remarkable vulnerability.',
    category: 'greatest-hits',
    tags: ['Lauren Samuels', 'fan favorite', 'vulnerability', 'poignant'],
    featured: false,
    priority: 5,
    metrics: {
      views: 892000,
      publishedDate: '2018-05-17'
    }
  },

  // BROADWAY SHOWS - Songs from specific musicals
  {
    id: 'miles-to-go-mad-ones',
    title: 'Miles To Go',
    youtubeId: 'PFlaiSCZAcU',
    artist: 'from The Mad Ones',
    album: 'The Mad Ones',
    duration: '4:18',
    description: 'Official KL upload; core Mad Ones track. The emotional centerpiece of the show, performed by the original cast.',
    category: 'broadway-shows',
    tags: ['The Mad Ones', 'official', 'emotional centerpiece', 'original cast'],
    featured: true,
    priority: 1,
    metrics: {
      views: 756000,
      publishedDate: '2017-10-12'
    },
    streamingLinks: {
      spotify: 'https://open.spotify.com/track/7nM5wXeL3R8pF4qQ9dZ2Ym',
      apple: 'https://music.apple.com/us/song/miles-to-go/1523456789',
      youtube: 'https://www.youtube.com/watch?v=PFlaiSCZAcU'
    }
  },
  {
    id: 'go-tonight-mad-ones',
    title: 'Go Tonight',
    youtubeId: 'C4Mw-ifYFD0',
    artist: 'The Mad Ones (official audio)',
    album: 'The Mad Ones',
    duration: '3:44',
    description: 'Auto-generated official release; high listen count. The opening number that sets the tone for the entire musical.',
    category: 'broadway-shows',
    tags: ['The Mad Ones', 'opening number', 'official audio', 'high energy'],
    featured: true,
    priority: 2,
    metrics: {
      views: 445000,
      publishedDate: '2017-07-30'
    }
  },
  {
    id: 'my-party-dress-kerrigan',
    title: 'My Party Dress',
    youtubeId: 'OY6breCUTIE',
    artist: 'Kait Kerrigan (54 Below)',
    album: 'Henry & Mudge',
    duration: '2:58',
    description: 'Henry & Mudge showpiece; comic staple. Kait Kerrigan performs this charming number with perfect comedic timing.',
    category: 'broadway-shows',
    tags: ['Henry & Mudge', 'Kait Kerrigan', '54 Below', 'comedy', 'charming'],
    featured: true,
    priority: 3,
    metrics: {
      views: 234000,
      publishedDate: '2014-09-18'
    }
  },
  {
    id: 'henry-mudge-medley',
    title: 'Henry & Mudge Medley',
    youtubeId: 'H3nR7M9dG3E',
    artist: 'Original Cast',
    album: 'Henry & Mudge',
    duration: '6:15',
    description: 'A delightful medley from the family-friendly musical showcasing the bond between a boy and his dog.',
    category: 'broadway-shows',
    tags: ['Henry & Mudge', 'medley', 'family musical', 'original cast'],
    featured: false,
    priority: 4,
    metrics: {
      views: 156000,
      publishedDate: '2014-11-22'
    }
  },

  // LIVE PERFORMANCES - Concert and cabaret performances
  {
    id: 'anyway-kerrigan-london',
    title: 'Anyway',
    youtubeId: 'j3O74RKP2F8',
    artist: 'Kait Kerrigan (live, London)',
    duration: '3:31',
    description: 'Writer-performed favorite; strong share history. Intimate performance by the lyricist herself in London.',
    category: 'live-performances',
    tags: ['Kait Kerrigan', 'London', 'intimate', 'writer performance', 'live'],
    featured: true,
    priority: 1,
    metrics: {
      views: 387000,
      publishedDate: '2019-06-14'
    }
  },
  {
    id: 'bad-years-lowdermilk-london',
    title: 'The Bad Years',
    youtubeId: 'qmnoPkn9KIE',
    artist: 'Brian Lowdermilk (live, London)',
    album: 'Tales from the Bad Years',
    duration: '4:02',
    description: 'Composer-performed; title track from Tales from the Bad Years. Raw, emotional performance by the composer.',
    category: 'live-performances',
    tags: ['Brian Lowdermilk', 'London', 'composer performance', 'emotional', 'title track'],
    featured: true,
    priority: 2,
    metrics: {
      views: 298000,
      publishedDate: '2019-06-14'
    }
  },
  {
    id: 'kl-live-54-below',
    title: 'Kerrigan-Lowdermilk Live at 54 Below',
    youtubeId: 'K3rR1g4n-L0w',
    artist: 'Kait Kerrigan & Brian Lowdermilk',
    duration: '8:45',
    description: 'Full concert highlights from their acclaimed 54 Below residency featuring fan favorites and deep cuts.',
    category: 'live-performances',
    tags: ['54 Below', 'concert highlights', 'fan favorites', 'residency'],
    featured: true,
    priority: 3,
    metrics: {
      views: 445000,
      publishedDate: '2020-02-28'
    }
  },
  {
    id: 'songbook-live-concert',
    title: 'The Songbook Live Concert',
    youtubeId: 'S0ng8o0k-L1v3',
    artist: 'Various Artists',
    duration: '12:30',
    description: 'Special concert featuring multiple artists performing KL songs live, celebrating their songbook collection.',
    category: 'live-performances',
    tags: ['various artists', 'songbook', 'celebration', 'multiple performers'],
    featured: false,
    priority: 4,
    metrics: {
      views: 178000,
      publishedDate: '2021-05-15'
    }
  },

  // COLLABORATIONS - Duets and special performances
  {
    id: 'duet-jordan-mendez',
    title: 'Perfect for You (Duet)',
    youtubeId: 'P3rf3ct-Du3t',
    artist: 'Jeremy Jordan & Lindsay Mendez',
    duration: '4:25',
    description: 'Two Broadway powerhouses unite for this stunning duet showcasing their incredible chemistry and vocal blend.',
    category: 'collaborations',
    tags: ['Jeremy Jordan', 'Lindsay Mendez', 'duet', 'Broadway stars', 'chemistry'],
    featured: true,
    priority: 1,
    metrics: {
      views: 612000,
      publishedDate: '2019-03-22'
    }
  },
  {
    id: 'trio-osnes-ashford-fahy',
    title: 'Stronger Together',
    youtubeId: 'Str0ng3r-T0g3',
    artist: 'Laura Osnes, Annaleigh Ashford & Meghann Fahy',
    duration: '3:54',
    description: 'Three incredible performers come together for this uplifting anthem about the power of female friendship.',
    category: 'collaborations',
    tags: ['Laura Osnes', 'Annaleigh Ashford', 'Meghann Fahy', 'trio', 'female friendship'],
    featured: true,
    priority: 2,
    metrics: {
      views: 334000,
      publishedDate: '2018-08-11'
    }
  },
  {
    id: 'men-of-broadway-medley',
    title: 'Men of Broadway: KL Medley',
    youtubeId: 'M3n-0f-Br0adw4y',
    artist: 'Jeremy Jordan, Brian Lowdermilk, Others',
    duration: '7:12',
    description: 'A special medley featuring Broadway leading men performing various Kerrigan-Lowdermilk songs.',
    category: 'collaborations',
    tags: ['men of Broadway', 'medley', 'leading men', 'ensemble'],
    featured: false,
    priority: 3,
    metrics: {
      views: 201000,
      publishedDate: '2020-11-07'
    }
  },

  // BEHIND THE SCENES - Creative process and interviews
  {
    id: 'writing-process-documentary',
    title: 'The Writing Process: Inside KL',
    youtubeId: 'Wr1t1ng-Pr0c3ss',
    artist: 'Kait Kerrigan & Brian Lowdermilk',
    duration: '15:42',
    description: 'An intimate look at how Kerrigan and Lowdermilk collaborate, from initial idea to finished song.',
    category: 'behind-the-scenes',
    tags: ['documentary', 'writing process', 'collaboration', 'creative process'],
    featured: true,
    priority: 1,
    metrics: {
      views: 87000,
      publishedDate: '2021-01-14'
    }
  },
  {
    id: 'mad-ones-rehearsal',
    title: 'The Mad Ones: In Rehearsal',
    youtubeId: 'M4d-0n3s-R3h34rs4l',
    artist: 'Original Cast',
    album: 'The Mad Ones',
    duration: '9:23',
    description: 'Behind-the-scenes footage from The Mad Ones rehearsals showing the creative process in action.',
    category: 'behind-the-scenes',
    tags: ['The Mad Ones', 'rehearsal', 'behind the scenes', 'creative process'],
    featured: true,
    priority: 2,
    metrics: {
      views: 134000,
      publishedDate: '2017-05-30'
    }
  },

  // COVERS & TRIBUTES - Other artists performing KL songs
  {
    id: 'student-covers-compilation',
    title: 'Student Covers: KL Greatest Hits',
    youtubeId: 'Stud3nt-C0v3rs',
    artist: 'Various Student Artists',
    duration: '11:18',
    description: 'A compilation of talented students from various performing arts programs covering popular KL songs.',
    category: 'covers-tributes',
    tags: ['student covers', 'compilation', 'performing arts', 'emerging talent'],
    featured: true,
    priority: 1,
    metrics: {
      views: 278000,
      publishedDate: '2020-12-18'
    }
  },
  {
    id: 'international-tribute',
    title: 'International Tribute to KL',
    youtubeId: '1nt3rn4t10n4l-Tr1but3',
    artist: 'Artists Worldwide',
    duration: '13:55',
    description: 'Artists from around the world perform KL songs in various languages and styles, showcasing global reach.',
    category: 'covers-tributes',
    tags: ['international', 'tribute', 'multiple languages', 'global reach'],
    featured: true,
    priority: 2,
    metrics: {
      views: 156000,
      publishedDate: '2021-07-04'
    }
  }
];

// Category configuration for display
export const categoryConfig: Record<VideoCategory, { name: string; description: string; color: string }> = {
  'greatest-hits': {
    name: 'Greatest Hits',
    description: 'Most popular and flagship performances',
    color: '#FF6B6B'
  },
  'broadway-shows': {
    name: 'Broadway Shows',
    description: 'Songs from specific musicals and productions',
    color: '#4ECDC4'
  },
  'live-performances': {
    name: 'Live Performances',
    description: 'Concert and cabaret performances',
    color: '#45B7D1'
  },
  'collaborations': {
    name: 'Collaborations',
    description: 'Duets and special performances with multiple artists',
    color: '#96CEB4'
  },
  'behind-the-scenes': {
    name: 'Behind the Scenes',
    description: 'Creative process, interviews, and documentary content',
    color: '#FECA57'
  },
  'covers-tributes': {
    name: 'Covers & Tributes',
    description: 'Other artists performing KL songs',
    color: '#FF9FF3'
  }
};

// Helper functions
export const getVideosByCategory = (category: VideoCategory): GalleryVideoItem[] => {
  return videoGallery
    .filter(video => video.category === category)
    .sort((a, b) => a.priority - b.priority);
};

export const getFeaturedVideosByCategory = (category: VideoCategory): GalleryVideoItem[] => {
  return getVideosByCategory(category).filter(video => video.featured);
};

export const getAllFeaturedVideos = (): GalleryVideoItem[] => {
  return videoGallery.filter(video => video.featured);
};

export const getVideoById = (id: string): GalleryVideoItem | undefined => {
  return videoGallery.find(video => video.id === id);
};

export const getVideosByTag = (tag: string): GalleryVideoItem[] => {
  return videoGallery.filter(video => 
    video.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
};

export const getVideosByArtist = (artist: string): GalleryVideoItem[] => {
  return videoGallery.filter(video => 
    video.artist?.toLowerCase().includes(artist.toLowerCase())
  );
};

export const getMostViewedVideos = (limit: number = 10): GalleryVideoItem[] => {
  return videoGallery
    .filter(video => video.metrics?.views)
    .sort((a, b) => (b.metrics!.views! - a.metrics!.views!))
    .slice(0, limit);
};

export const getRecentVideos = (limit: number = 10): GalleryVideoItem[] => {
  return videoGallery
    .filter(video => video.metrics?.publishedDate)
    .sort((a, b) => new Date(b.metrics!.publishedDate!).getTime() - new Date(a.metrics!.publishedDate!).getTime())
    .slice(0, limit);
};

export const getAllCategories = (): VideoCategory[] => {
  return Object.keys(categoryConfig) as VideoCategory[];
};

export default videoGallery;