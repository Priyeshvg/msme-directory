import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { siteConfig } from '@/lib/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Get all enterprises for dynamic URLs
  const { data: enterprises } = await supabase
    .from('enterprises')
    .select('id, enterprise_name, state_name, pincode, updated_at')
    .limit(1000) // Limit for sitemap size

  const enterpriseUrls = enterprises?.map((enterprise) => {
    const stateName = enterprise.state_name.toLowerCase().replace(/\s+/g, '-')
    const companySlug = enterprise.enterprise_name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
    const pincode = enterprise.pincode || '000000'

    return {
      url: `${baseUrl}/${stateName}/${companySlug}-${pincode}`,
      lastModified: enterprise.updated_at ? new Date(enterprise.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
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