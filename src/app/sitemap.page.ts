import type { MetadataRoute } from 'next';
import { CLIENT_PROFILES } from '@/lib/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const slugify = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const profileUrls: MetadataRoute.Sitemap = CLIENT_PROFILES
    .filter((p) => p.status === 'active' && !p.hidden)
    .map((p) => ({
      url: `${baseUrl}/${slugify(p.county)}/${slugify(p.subcounty)}/${slugify(p.division)}/${slugify(p.location)}/${slugify(p.businessName)}/${p.numericId}`,
      lastModified: new Date(p.joinedDate),
      changeFrequency: 'weekly' as const,
      priority: p.featured ? 0.9 : 0.7,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...profileUrls,
  ];
}
