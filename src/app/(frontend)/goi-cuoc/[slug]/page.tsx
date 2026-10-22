import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPackage } from '@/lib/queries'
import { PackageDetailView } from '@/components/packages/PackageDetailView'
import { PackageArticle } from '@/components/packages/PackageArticle'

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ 'khu-vuc'?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getPackage((await params).slug)
  if (!item) return { title: 'Không tìm thấy gói cước' }
  return {
    title: item.seoTitle || item.name,
    description: item.seoDescription || item.description.slice(0, 160),
    alternates: { canonical: `/goi-cuoc/${item.slug}` },
  }
}

export default async function PackagePage({ params, searchParams }: Props) {
  const item = await getPackage((await params).slug)
  if (!item) notFound()
  const region = (await searchParams)['khu-vuc'] === 'other' ? 'other' : 'metro'
  return <div className="container detail-page">
    <PackageDetailView item={item} initialRegion={region}><PackageArticle item={item} /></PackageDetailView>
  </div>
}
