import type { MetadataRoute } from 'next'
import { getPackages } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const packages = await getPackages()
  return [{ url: base, changeFrequency: 'weekly', priority: 1 }, ...packages.map((item) => ({
    url: `${base}/goi-cuoc/${item.slug}`, lastModified: item.updatedAt,
    changeFrequency: 'weekly' as const, priority: 0.8,
  }))]
}
