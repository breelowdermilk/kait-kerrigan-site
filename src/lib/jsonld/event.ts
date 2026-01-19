export default function eventJsonLd({
  title,
  slug,
  startDateTime,
  endDateTime,
  venue,
  ticketsUrl,
}: {
  title: string;
  slug: string;
  startDateTime: string;
  endDateTime?: string;
  venue?: { name?: string; address?: string };
  ticketsUrl?: string;
}) {
  const url = `https://www.example.com/events/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: title,
    startDate: startDateTime,
    endDate: endDateTime,
    eventStatus: 'https://schema.org/EventScheduled',
    url,
    location: {
      '@type': 'Place',
      name: venue?.name,
      address: venue?.address,
    },
    offers: ticketsUrl
      ? {
          '@type': 'Offer',
          url: ticketsUrl,
          availability: 'https://schema.org/InStock',
        }
      : undefined,
  } as const;
}
