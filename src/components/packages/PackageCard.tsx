'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Package } from '@/payload-types'
import { type Region } from '@/lib/format'
import { packagePrice, speedLabel } from '@/lib/packagePresentation'
import { Icon } from '@/components/ui/Icon'
import { RegionPicker } from './RegionPicker'
import { RegistrationButton } from '@/components/forms/RegistrationButton'

export function PackageCard({ item }: { item: Package }) {
  const [region, setRegion] = useState<Region>(item.prices.some((price) => price.region === 'other') ? 'other' : 'metro')
  const price = packagePrice(item, region)
  const speed = speedLabel(item.speed)
  return <article className={`package-card${item.catalogGroup === 'ultra' ? ' package-card--ultra' : ''}`}>
    <Link className="package-illustration" href={`/goi-cuoc/${item.slug}?khu-vuc=${region}`} aria-label={`Khám phá chi tiết ${item.name}`}>{item.image && typeof item.image === 'object' && item.image.url
      ? <img src={item.image.url} alt={item.image.alt} width="100" height="80" />
      : item.catalogGroup === 'offers' ? <Icon name="gift" width="52" height="52" />
        : <img src={`/images/package-${item.catalogGroup || 'individual'}.png`} alt="" width="100" height="80" />}</Link>
    <div className="package-card-body">
    <div className="package-name-row"><h3><Link href={`/goi-cuoc/${item.slug}?khu-vuc=${region}`}>{item.name}</Link></h3><span className="package-bandwidth">{speed.value}{speed.unit}</span></div>
    <div className="package-utilities"><span className="card-label">Tiện ích</span>
      <p>{item.equipment?.map((entry) => entry.name).join(' + ') || item.description}</p>
    </div>
    <RegionPicker value={region} onChange={setRegion} compact />
    <div className="card-bottom"><div className="card-price" aria-live="polite"><span>{price?.region === 'reference' ? 'Giá tham khảo' : 'Đơn giá'}</span>
      <p className="price">{price ? <>{new Intl.NumberFormat('vi-VN').format(price.monthlyPrice)}đ<small>/tháng</small></> : 'Liên hệ'}</p>
    </div><RegistrationButton packageId={item.id} packageName={item.name}>{price ? 'Đăng ký' : 'Tư vấn'}</RegistrationButton></div>
    </div>
  </article>
}
