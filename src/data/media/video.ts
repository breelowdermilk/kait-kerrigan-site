export type VideoItem = {
  title: string;
  youtubeId?: string;
  src?: string;
  poster?: string;
  notes?: string;
};

// Curated list
const videoItems: VideoItem[] = [
  { title: 'Run Away With Me — Jeremy Jordan (live)', youtubeId: 'jVwtGU3KOro', notes: 'Flagship performance from the KL channel; most-cited version.' },
  { title: 'How To Return Home — Laura Osnes', youtubeId: '5yEqCRudi4o', notes: 'Definitive early capture; widely referenced.' },
  { title: 'Freedom — Annaleigh Ashford & Meghann Fahy', youtubeId: 'rMJSiNN0DxU', notes: 'Signature duet; staple of KL concerts.' },
  { title: 'Anyway — Kait Kerrigan (live, London)', youtubeId: 'j3O74RKP2F8', notes: 'Writer-performed favorite; strong share history.' },
  { title: 'Say The Word — Lauren Samuels', youtubeId: 'fQNvQWr6YG8', notes: 'Fan favorite cut from Samantha Brown/Mad Ones lineage.' },
  { title: 'My Party Dress — Kait Kerrigan (54 Below)', youtubeId: 'OY6breCUTIE', notes: 'Henry & Mudge showpiece; comic staple.' },
  { title: 'Miles To Go — from The Mad Ones', youtubeId: 'PFlaiSCZAcU', notes: 'Official KL upload; core Mad Ones track.' },
  { title: 'Go Tonight — The Mad Ones (official audio topic)', youtubeId: 'C4Mw-ifYFD0', notes: 'Auto-generated official release; high listen count.' },
  { title: 'The Bad Years — Brian Lowdermilk (live, London)', youtubeId: 'qmnoPkn9KIE', notes: 'Composer-performed; title track from Tales from the Bad Years.' },
  { title: 'Hand in Hand — Lindsay Mendez', youtubeId: 'Gt76Mf6yAEo', notes: 'Tony winner Lindsay Mendez; widely shared rendition.' },
];

export default videoItems;

