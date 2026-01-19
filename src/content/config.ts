import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.string().url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});

export const collections = {
  post: postCollection,
  // Bree Lowdermilk blueprint collections
  songs: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      show: z.string().optional(),
      voiceTypes: z
        .array(
          z.enum([
            'Soprano',
            'Mezzo',
            'Alto',
            'Tenor',
            'Baritone',
            'Bass',
            'Duet',
            'Trio',
            'Quartet',
            'Ensemble',
            'Mixed',
          ])
        )
        .default([]),
      keys: z
        .array(
          z.object({
            name: z.string(),
            range: z.string().optional(),
            isOriginal: z.boolean().optional(),
          })
        )
        .default([]),
      moods: z.array(z.string()).default([]),
      tempoBpm: z.number().optional(),
      lyricExcerpt: z.string().optional(),
      lyrics: z.string().optional(),
      sheetMusic: z
        .object({
          provider: z.string().optional(),
          url: z.string().url().optional(),
        })
        .optional(),
      media: z
        .object({
          youtubeId: z.string().optional(),
          spotifyUrl: z.string().optional(),
          appleUrl: z.string().optional(),
          soundcloudUrl: z.string().optional(),
        })
        .optional(),
      credits: z.array(z.string()).default([]),
      coverImage: z.string().optional(),
      date: z.string().optional(),
      published: z.boolean().default(true),
    }),
  }),
  shows: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      status: z.enum(['development', 'licensed', 'archived', 'touring']).default('development'),
      synopsis: z.string().optional(),
      credits: z.array(z.string()).default([]),
      heroImage: z.string().optional(),
      gallery: z.array(z.string()).default([]),
      links: z
        .object({
          licensing: z.string().url().optional(),
        })
        .optional(),
      pressQuotes: z
        .array(
          z.object({
            quote: z.string(),
            outlet: z.string(),
            author: z.string().optional(),
            date: z.string().optional(),
            url: z.string().url().optional(),
          })
        )
        .default([]),
    }),
  }),
  recordings: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      releaseDate: z.string().optional(),
      coverImage: z.string().optional(),
      tracks: z
        .array(
          z.object({
            title: z.string(),
            songSlug: z.string().optional(),
            duration: z.string().optional(),
          })
        )
        .default([]),
      streamLinks: z
        .object({
          spotify: z.string().optional(),
          apple: z.string().optional(),
          bandcamp: z.string().optional(),
        })
        .optional(),
      credits: z.array(z.string()).default([]),
    }),
  }),
  events: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      startDateTime: z.string(),
      endDateTime: z.string().optional(),
      venue: z.object({
        name: z.string(),
        address: z.string().optional(),
        city: z.string().optional(),
        url: z.string().optional(),
      }),
      ticketsUrl: z.string().optional(),
      status: z.enum(['scheduled', 'postponed', 'cancelled', 'completed']).default('scheduled'),
      notes: z.string().optional(),
      relatedWorks: z.array(z.string()).default([]),
    }),
  }),
  press: defineCollection({
    type: 'content',
    schema: z.object({
      quote: z.string(),
      outlet: z.string(),
      author: z.string().optional(),
      date: z.string().optional(),
      url: z.string().url().optional(),
    }),
  }),
};
