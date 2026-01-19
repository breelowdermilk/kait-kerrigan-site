export type AudioTrack = {
  title: string;
  src: string;
  artist?: string;
  cover?: string;
  duration?: string;
  notes?: string;
};

// TODO: Replace placeholder MP3 URLs with canonical sources when available.
const audioTracks: AudioTrack[] = [
  {
    title: 'Sample Track One',
    artist: 'Artist Name',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12',
    notes: 'Recorded live — placeholder source.'
  },
  {
    title: 'Sample Track Two',
    artist: 'Artist Name',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '4:38',
    notes: 'Demo mix — placeholder source.'
  },
  {
    title: 'Sample Track Three',
    artist: 'Artist Name',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:03',
    notes: 'Instrumental — placeholder source.'
  },
];

export default audioTracks;

