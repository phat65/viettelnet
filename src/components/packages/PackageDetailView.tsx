'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import type { Package } from '@/payload-types'
import { money, regionLabels, type Region } from '@/lib/format'
import { packagePrice } from '@/lib/packagePresentation'
import { catalogGroups } from '@/data/catalog'
import { RegistrationButton } from '@/components/forms/RegistrationButton'
import { RegionPicker } from './RegionPicker'

export function PackageDetailView({ item, initialRegion, children }: { item: Package; initialRegion: Region; children: ReactNode }) {
  const [region, setRegion] = useState(initialRegion)
  const price = packagePrice(item, region)
  const group = catalogGroups.find((entry) => entry.id === item.catalogGroup)
  function chooseRegion(value: Region) {
    setRegion(value)
    const url = new URL(window.location.href)
    url.searchParams.set('khu-vuc', value)
    window.history.replaceState(null, '', url)
  }
  return <>
    <nav className="breadcrumbs" aria-label="Đường dẫn"><Link href="/">Trang chủ</Link><span>›</span><Link href={`/#${group?.id ?? 'goi-cuoc'}`}>{group?.label ?? 'Gói cước'}</Link><span>›</span><span>{item.name}</span></nav>
    <h1 className="article-title">Gói Internet <span>{item.name}</span></h1>
    <div className="detail-grid detail-grid--article">
      <article className="package-article">
        {item.image && typeof item.image === 'object' && item.image.url && <img className="article-image" src={item.image.url} alt={item.image.alt} />}
        <p>{item.description}</p>
        <h2>Thông tin gói lắp đặt Internet Viettel {item.name}</h2>
        <ul><li>Tên gói: <strong>{item.name}</strong></li><li>Tốc độ: <strong>{item.speed} Mbps</strong></li>
          {item.equipment?.map((equipment, index) => <li key={equipment.id || index}>{equipment.name}</li>)}
        </ul>
        <section className="article-prices"><h2>Giá gói {item.name} theo khu vực</h2>
          <ul>{item.prices.map((row) => <li key={row.id || row.region}>{row.region === 'reference' ? 'Giá tham khảo' : regionLabels[row.region]}: <strong>{money(row.monthlyPrice)}/tháng</strong></li>)}</ul>
          <RegionPicker value={region} onChange={chooseRegion} />
          {price ? <dl className="price-details" aria-live="polite">
            <div><dt>{price.region === 'reference' ? 'Giá tham khảo / tháng' : 'Cước hàng tháng'}</dt><dd>{money(price.monthlyPrice)}</dd></div>
            <div><dt>Phí hòa mạng</dt><dd>{price.activationFee == null ? 'Xác nhận khi tư vấn' : money(price.activationFee)}</dd></div>
            <div><dt>Phí lắp đặt</dt><dd>{price.installationFee == null ? 'Xác nhận khi tư vấn' : price.installationFee === 0 ? 'Miễn phí' : money(price.installationFee)}</dd></div>
            {price.commitmentMonths != null && <div><dt>Thời hạn cam kết</dt><dd>{price.commitmentMonths} tháng</dd></div>}
          </dl> : <p role="status">Chưa có giá cho khu vực này. Liên hệ để được kiểm tra hạ tầng và tư vấn gói phù hợp.</p>}
        </section>
        {children}
        <section><h2>Điều kiện áp dụng</h2><p className="preserve-lines">{item.conditions}</p></section>
        <RegistrationButton packageId={item.id} packageName={item.name} className="button article-register">Đăng ký gói {item.name}</RegistrationButton>
      </article>
    </div>
  </>
}
