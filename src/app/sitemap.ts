import type { MetadataRoute } from 'next'
import { getPackages } from '@/lib/queries'
import { catalogGroups } from '@/data/catalog'
import { groupPath, internetPath, packagePath } from '@/lib/catalogRoutes'
import { internetProvinces, provincePath } from '@/lib/provinces'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
  const packages = await getPackages()
  return [{ url: base, changeFrequency: 'weekly', priority: 1 },
    ...['/gioi-thieu', '/lien-he', '/chinh-sach-bao-mat'].map((path) => ({ url: `${base}${path}`, changeFrequency: 'monthly' as const, priority: 0.5 })),
    { url: `${base}${internetPath}`, changeFrequency: 'weekly', priority: 0.9 },
    ...internetProvinces.map((province) => ({ url: `${base}${provincePath(province.slug)}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...catalogGroups.filter((group) => packages.some((item) => item.catalogGroup === group.id)).map((group) => ({
      url: `${base}${groupPath(group.id)}`, changeFrequency: 'weekly' as const, priority: 0.8,
    })), ...packages.map((item) => ({
    url: `${base}${packagePath(item.slug)}`, lastModified: item.updatedAt,
    changeFrequency: 'weekly' as const, priority: 0.8,
  }))]
}
