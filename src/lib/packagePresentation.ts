import type { Package } from '@/payload-types'
import type { Region } from './format'

export function packagePrice(item: Package, region: Region) {
  return item.prices.find((entry) => entry.region === region) ??
    item.prices.find((entry) => entry.region === 'reference')
}

export function speedLabel(speed: number) {
  return speed >= 1000 ? { value: String(speed / 1000), unit: 'Gbps' } : { value: String(speed), unit: 'Mbps' }
}

export function packagePriceUnit(item: Pick<Package, 'priceUnit'>) {
  return item.priceUnit?.trim() || '/tháng'
}
