'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import type { Package } from '@/payload-types'
import { money, type Region } from '@/lib/format'
import { packagePrice, packagePriceUnit } from '@/lib/packagePresentation'
import { catalogGroups } from '@/data/catalog'
import { RegistrationButton } from '@/components/forms/RegistrationButton'
import { ProvincePicker } from './ProvincePicker'
import { provinceFromSlug, provincePath } from '@/lib/provinces'
import { groupPath, internetPath } from '@/lib/catalogRoutes'

export function PackageDetailView({ item, initialRegion, initialProvinceSlug, children }: { item: Package; initialRegion: Region; initialProvinceSlug?: string; children: ReactNode }) {
  const [provinceSlug, setProvinceSlug] = useState(initialProvinceSlug || '')
  const province = provinceFromSlug(provinceSlug)
  const region = province?.region || initialRegion
  const price = packagePrice(item, region)
  const group = catalogGroups.find((entry) => entry.id === item.catalogGroup)
  function chooseProvince(value: string) {
    setProvinceSlug(value)
    const url = new URL(window.location.href)
    url.searchParams.set('khu-vuc', value)
    window.history.replaceState(null, '', url)
  }
  return <>
    <nav className="breadcrumbs" aria-label="Đường dẫn"><Link href="/">Trang chủ</Link><span aria-hidden="true">›</span><Link href={internetPath}>Internet</Link>{group && <><span aria-hidden="true">›</span><Link href={groupPath(group.id)}>{group.id === 'individual' ? 'Cá nhân' : group.label}</Link></>}<span aria-hidden="true">›</span><span aria-current="page">{item.name}</span></nav>
    {province && <p className="package-province">Khu vực lắp đặt: <Link href={provincePath(province.slug)}>{province.name}</Link></p>}
    <h1 className="article-title">{item.speed > 0 ? 'Gói Internet' : 'Gói'} <span>{item.name}</span></h1>
    <div className="detail-grid detail-grid--article">
      <article className="package-article">
        {item.image && typeof item.image === 'object' && item.image.url && <img className="article-image" src={item.image.url} alt={item.image.alt} />}
        <p>{item.description}</p>
        <h2>Thông tin gói {item.name}</h2>
        <ul><li>Tên gói: <strong>{item.name}</strong></li>{item.speed > 0 && <li>Tốc độ: <strong>{item.speed} Mbps</strong></li>}
          {item.equipment?.map((equipment, index) => <li key={equipment.id || index}>{equipment.name}</li>)}
        </ul>
        <section className="article-prices"><h2>Giá gói {item.name}{province ? ` tại ${province.name}` : ' theo khu vực'}</h2>
          <ProvincePicker value={provinceSlug} onChange={chooseProvince} />
          {price ? <dl className="price-details" aria-live="polite">
            <div><dt>{price.region === 'reference' ? 'Giá tham khảo' : 'Giá gói'} {packagePriceUnit(item)}</dt><dd>{money(price.monthlyPrice)}</dd></div>
            <div><dt>Phí hòa mạng</dt><dd>{price.activationFee == null ? 'Xác nhận khi tư vấn' : money(price.activationFee)}</dd></div>
            <div><dt>Phí lắp đặt</dt><dd>{price.installationFee == null ? 'Xác nhận khi tư vấn' : price.installationFee === 0 ? 'Miễn phí' : money(price.installationFee)}</dd></div>
            {price.commitmentMonths != null && <div><dt>Thời hạn cam kết</dt><dd>{price.commitmentMonths} tháng</dd></div>}
          </dl> : <p role="status">Chưa có giá cho khu vực này. Liên hệ để được kiểm tra hạ tầng và tư vấn gói phù hợp.</p>}
        </section>
        {children}
        <section><h2>Điều kiện áp dụng</h2><p className="preserve-lines">{item.conditions}</p></section>
        <RegistrationButton packageId={item.id} packageName={item.name} provinceCode={province?.code} className="button article-register">Đăng ký gói {item.name}</RegistrationButton>
      </article>
    </div>
  </>
}
