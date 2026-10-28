import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPackage } from '@/lib/queries'
import { groupFromSlug, packagePath } from '@/lib/catalogRoutes'
import { CatalogLanding, catalogMetadata } from '@/components/packages/CatalogLanding'
import { PackageDetailView } from '@/components/packages/PackageDetailView'
import { PackageArticle } from '@/components/packages/PackageArticle'
import { defaultProvince, provinceFromSlug } from '@/lib/provinces'

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ 'khu-vuc'?: string | string[] }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const group = groupFromSlug(slug)
  if (group) return catalogMetadata(group.id)
  const item = await getPackage(slug)
  if (!item) return { title: 'Không tìm thấy gói cước', robots: { index: false } }
  const title = item.seoTitle || `Gói ${item.name}${item.speed > 0 ? ` ${item.speed} Mbps` : ''}: giá và đăng ký`
  const description = item.seoDescription || item.description.slice(0, 160)
  const url = packagePath(item.slug)
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, siteName: 'Viettelnet', locale: 'vi_VN', type: 'website' } }
}

export default async function InternetContentPage({ params, searchParams }: Props) {
  const { slug } = await params
  const group = groupFromSlug(slug)
  if (group) return <CatalogLanding groupId={group.id} />
  const item = await getPackage(slug)
  if (!item) notFound()
  const query = (await searchParams)['khu-vuc']
  const selected = typeof query === 'string' ? query : undefined
  // Preserve old shared links without assigning an arbitrary province to "other".
  const province = provinceFromSlug(selected) || (selected === 'other' ? undefined : defaultProvince)
  const region = province?.region || 'other'
  return <div className="container detail-page">
    <PackageDetailView key={`${item.id}-${selected || ''}`} item={item} initialRegion={region} initialProvinceSlug={province?.slug}><PackageArticle item={item} /></PackageDetailView>
  </div>
}
