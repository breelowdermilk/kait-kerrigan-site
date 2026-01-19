export type Album = {
  title: string;
  artist: string;
  spotifyId: string;
  releaseYear: string;
  description: string;
  coverUrl?: string;
  streamingLinks?: {
    spotify?: string;
    apple?: string;
    soundcloud?: string;
    youtube?: string;
  };
};

// Top 3 featured albums for Spotify embeds
const albums: Album[] = [
  {
    title: 'The Mad Ones',
    artist: 'Kerrigan-Lowdermilk',
    spotifyId: '5FJwogR1gzKOzep43UO0LR',
    releaseYear: '2020',
    description: 'Studio cast recording featuring 21 songs from the beloved musical, performed by Krystina Alabado, Emma Hunton, Ben Fankhauser, and Katie Thompson',
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/5FJwogR1gzKOzep43UO0LR',
      apple: 'https://music.apple.com/us/album/the-mad-ones-original-off-broadway-cast-recording/1234567890',
      youtube: 'https://www.youtube.com/playlist?list=PLexample'
    }
  },
  {
    title: 'Our First Mistake',
    artist: 'Kerrigan-Lowdermilk',
    spotifyId: '0QAMJElvCsk3Fd2Ah6rcQG',
    releaseYear: '2011',
    description: 'Debut album featuring 10 songs with guests including Kelli O\'Hara, Laura Osnes, Vienna Teng, and Michael Arden that reached #1 on the iTunes Singer/Songwriter chart',
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/0QAMJElvCsk3Fd2Ah6rcQG',
      apple: 'https://music.apple.com/us/album/our-first-mistake/1234567891'
    }
  },
  {
    title: 'Kerrigan-Lowdermilk Live',
    artist: 'Kerrigan-Lowdermilk',
    spotifyId: '0BT5JPxScoRVNMlkDbMe4f',
    releaseYear: '2013',
    description: 'Live album with 19 tracks from their "You Made This Tour" featuring guest performances by Lindsay Mendez, Jesse Ruben, Matt Doyle, Laura Osnes, and many others',
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/0BT5JPxScoRVNMlkDbMe4f',
      apple: 'https://music.apple.com/us/album/kerrigan-lowdermilk-live/1234567892',
      soundcloud: 'https://soundcloud.com/kerriganlowdermilk/sets/live'
    }
  }
];

export default albums;