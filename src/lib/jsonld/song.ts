export default function songJsonLd({
  title,
  slug,
  show,
  media,
  credits,
}: {
  title: string;
  slug: string;
  show?: string;
  media?: { spotifyUrl?: string };
  credits?: string[];
}) {
  const url = `https://www.example.com/songs/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicComposition',
    name: title,
    url,
    composer: [{ '@type': 'Person', name: 'Bree Lowdermilk' }],
    lyricist: credits?.find((c) => c.toLowerCase().includes('lyrics by'))
      ? { '@type': 'Person', name: 'Kait Kerrigan' }
      : undefined,
    isPartOf: show ? { '@type': 'CreativeWork', name: show } : undefined,
    audio: media?.spotifyUrl ? { '@type': 'AudioObject', url: media.spotifyUrl } : undefined,
  } as const;
}
