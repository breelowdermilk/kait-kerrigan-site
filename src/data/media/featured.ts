export type FeaturedItem = {
  title: string;
  youtubeId: string;
  artist?: string;
  notes: string;
  streamingLinks?: {
    spotify?: string;
    apple?: string;
    soundcloud?: string;
    youtube?: string;
  };
  category: 'flagship' | 'live' | 'official' | 'collaboration';
};

// Hero carousel - Top 4 most impressive videos
const featuredItems: FeaturedItem[] = [
  {
    title: 'Run Away With Me',
    youtubeId: 'jVwtGU3KOro',
    artist: 'Jeremy Jordan (live)',
    notes: 'Flagship performance from the KL channel; most-cited version.',
    category: 'flagship',
    streamingLinks: {
      spotify: 'https://open.spotify.com/track/example1',
      apple: 'https://music.apple.com/us/song/example1',
      youtube: 'https://www.youtube.com/watch?v=jVwtGU3KOro'
    }
  },
  {
    title: 'Freedom',
    youtubeId: 'M7lc1UVf-VE',
    artist: 'Annaleigh Ashford & Meghann Fahy',
    notes: 'Signature duet; staple of KL concerts.',
    category: 'collaboration',
    streamingLinks: {
      spotify: 'https://open.spotify.com/track/example2',
      youtube: 'https://www.youtube.com/watch?v=M7lc1UVf-VE'
    }
  },
  {
    title: 'Miles To Go',
    youtubeId: 'PFlaiSCZAcU',
    artist: 'from The Mad Ones',
    notes: 'Official KL upload; core Mad Ones track.',
    category: 'official',
    streamingLinks: {
      spotify: 'https://open.spotify.com/track/example3',
      apple: 'https://music.apple.com/us/song/example3',
      soundcloud: 'https://soundcloud.com/example3',
      youtube: 'https://www.youtube.com/watch?v=PFlaiSCZAcU'
    }
  },
  {
    title: 'Hand in Hand',
    youtubeId: 'Gt76Mf6yAEo',
    artist: 'Lindsay Mendez',
    notes: 'Tony winner Lindsay Mendez; widely shared rendition.',
    category: 'collaboration',
    streamingLinks: {
      spotify: 'https://open.spotify.com/track/example4',
      youtube: 'https://www.youtube.com/watch?v=Gt76Mf6yAEo'
    }
  }
];

export default featuredItems;