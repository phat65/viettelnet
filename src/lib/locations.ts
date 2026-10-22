import provinces from '@/data/locations/provinces.json'
import wardCatalog from '@/data/locations/wards.json'

export type Ward = { code: string; name: string }
const wards: Record<string, Ward[]> = wardCatalog

export function getWards(provinceCode: string): Ward[] {
  return Object.hasOwn(wards, provinceCode) ? wards[provinceCode] : []
}

export function resolveLocation(provinceCode: string, wardCode: string) {
  const province = provinces.find(item => item.code === provinceCode)
  const ward = getWards(provinceCode).find(item => item.code === wardCode)
  return province && ward ? { province, ward } : null
}
