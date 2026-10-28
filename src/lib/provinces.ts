import provinces from '@/data/locations/provinces.json'
import type { Region } from './format'

export type InternetProvince = { code: string; name: string; slug: string; region: Region }

export const internetProvinces: InternetProvince[] = provinces.map((province) => {
  const name = province.name.replace(/^(Thành phố|Tỉnh) /, '')
  const slug = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Đ/g, 'D').toLowerCase().replace(/\s+/g, '-')
  return { code: province.code, name, slug, region: province.code === '1' || province.code === '79' ? 'metro' : 'other' }
})

export const defaultProvince = internetProvinces.find((province) => province.code === '1')!
export const provinceFromSlug = (slug: string | undefined) => internetProvinces.find((province) => province.slug === slug)
export const provincePath = (slug: string) => `/internet/khu-vuc/${encodeURIComponent(slug)}`
