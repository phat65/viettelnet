'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Package } from '@/payload-types'
import { packagePrice, packagePriceUnit, speedLabel } from '@/lib/packagePresentation'
import { Icon } from '@/components/ui/Icon'
import { ProvincePicker } from './ProvincePicker'
import { defaultProvince, provinceFromSlug, type InternetProvince } from '@/lib/provinces'
import { RegistrationButton } from '@/components/forms/RegistrationButton'
import { packagePath } from '@/lib/catalogRoutes'

export function PackageCard({ item, province }: { item: Package; province?: InternetProvince }) {
  const [provinceSlug, setProvinceSlug] = useState(defaultProvince.slug)
  const selectedProvince = province || provinceFromSlug(provinceSlug) || defaultProvince
  const price = packagePrice(item, selectedProvince.region)
  const href = `${packagePath(item.slug)}?khu-vuc=${selectedProvince.slug}`
  const speed = speedLabel(item.speed)
  return <article className={`package-card${item.catalogGroup === 'ultra' ? ' package-card--ultra' : ''}`}>
    <Link className="package-illustration" href={href} aria-label={`Khám phá chi tiết ${item.name}`}>{item.image && typeof item.image === 'object' && item.image.url
      ? <img src={item.image.url} alt={item.image.alt} width="100" height="80" />
      : item.catalogGroup === 'offers' ? <Icon name="gift" width="52" height="52" />
        : <img src={`/images/package-${item.catalogGroup || 'individual'}.png`} alt="" width="100" height="80" />}</Link>
    <div className="package-card-body">
    <div className="package-name-row"><h3><Link href={href}>{item.name}</Link></h3>{item.speed > 0 && <span className="package-bandwidth">{speed.value}{speed.unit}</span>}</div>
    <div className="package-utilities"><span className="card-label">Tiện ích</span>
      <p>{item.equipment?.map((entry) => entry.name).join(' + ') || item.description}</p>
    </div>
    {province ? <p className="package-province">Khu vực lắp đặt: <strong>{province.name}</strong></p> : <ProvincePicker value={selectedProvince.slug} onChange={setProvinceSlug} />}
    <div className="card-bottom"><div className="card-price" aria-live="polite"><span>{price?.region === 'reference' ? 'Giá tham khảo' : 'Đơn giá'}</span>
      <p className="price">{price ? <>{new Intl.NumberFormat('vi-VN').format(price.monthlyPrice)}đ<small>{packagePriceUnit(item)}</small></> : 'Liên hệ'}</p>
    </div><RegistrationButton packageId={item.id} packageName={item.name} provinceCode={selectedProvince.code}>{price ? 'Đăng ký' : 'Tư vấn'}</RegistrationButton></div>
    </div>
  </article>
}
