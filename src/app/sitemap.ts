import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://msme-directory.vercel.app'

  // Get all enterprises for dynamic URLs
  const { data: enterprises } = await supabase
    .from('enterprises')
    .select('id, enterprise_name, updated_at')
    .limit(1000) // Limit for sitemap size

  const enterpriseUrls = enterprises?.map((enterprise) => {
    const slug = enterprise.enterprise_name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-') + '-' + enterprise.id

    return {
      url: `${baseUrl}/enterprise/${slug}`,
      lastModified: enterprise.updated_at ? new Date(enterprise.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  }) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...enterpriseUrls,
  ]
}