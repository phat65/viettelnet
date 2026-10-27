import type { Metadata } from 'next'
import Link from 'next/link'
import { catalogGroups, type CatalogGroup } from '@/data/catalog'
import { getPackages, getCatalogContent } from '@/lib/queries'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { catalogRoutes, groupPath, internetPath } from '@/lib/catalogRoutes'
import { PackageList } from './PackageList'
import { RegistrationButton } from '@/components/forms/RegistrationButton'

export async function catalogMetadata(groupId?: CatalogGroup): Promise<Metadata> {
  const content = (await getCatalogContent())[groupId || 'internet']
  const group = catalogGroups.find((entry) => entry.id === groupId)
  const title = content?.seoTitle?.trim() || (groupId ? catalogRoutes[groupId].title : 'Internet Viettel: bảng giá và đăng ký lắp mạng')
  const description = content?.seoDescription?.trim() || group?.description || 'So sánh các gói Internet Viettel, TV360, Camera và Mesh WiFi. Xem giá theo khu vực, thiết bị đi kèm và đăng ký tư vấn lắp đặt.'
  const url = groupId ? groupPath(groupId) : internetPath
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, siteName: 'Viettelnet', locale: 'vi_VN', type: 'website' } }
}

export async function CatalogLanding({ groupId }: { groupId?: CatalogGroup }) {
  const [packages, contents] = await Promise.all([getPackages(), getCatalogContent()])
  const content = contents[groupId || 'internet']
  const group = catalogGroups.find((entry) => entry.id === groupId)
  const heading = content?.heading?.trim() || (groupId ? catalogRoutes[groupId].title : 'Internet Viettel: chọn gói phù hợp với bạn')
  return <>
    <div className="container catalog-intro">
      <nav className="breadcrumbs" aria-label="Đường dẫn">
        <Link href="/">Trang chủ</Link><span aria-hidden="true">›</span>
        {group ? <><Link href={internetPath}>Internet</Link><span aria-hidden="true">›</span><span aria-current="page">{group.id === 'individual' ? 'Cá nhân' : group.label}</span></> : <span aria-current="page">Internet</span>}
      </nav>
      <h1>{heading}</h1>
      <p>{content?.intro?.trim() || (groupId ? catalogRoutes[groupId].guide : 'Từ kết nối hằng ngày đến truyền hình, camera và WiFi cho nhà nhiều tầng. Chọn nhóm dịch vụ để so sánh gói, xem thiết bị và mức giá phù hợp.')}</p>
      <nav className="catalog-tabs" aria-label="Nhóm gói Internet">
        <Link href={internetPath} aria-current={!groupId ? 'page' : undefined}>Tất cả gói</Link>
        {catalogGroups.map((entry) => <Link key={entry.id} href={groupPath(entry.id)} aria-current={groupId === entry.id ? 'page' : undefined}>{entry.id === 'individual' ? 'Internet cá nhân' : entry.label}</Link>)}
      </nav>
      <p className="catalog-price-note">Chọn Hà Nội & TP.HCM hoặc tỉnh/thành khác trên thẻ để xem giá. Địa chỉ lắp đặt cụ thể sẽ được chọn khi đăng ký.</p>
    </div>
    <PackageList packages={packages} groupId={groupId} />
    {content?.advice && <div className="container managed-content"><RichText data={content.advice} /></div>}
    {!!content?.faq?.length && <section className="container catalog-faq" aria-labelledby="catalog-faq-title">
      <h2 id="catalog-faq-title">Câu hỏi thường gặp</h2><div className="faq-list">
        {content.faq.map((entry, index) => <details key={entry.id || index}><summary>{entry.question}<span className="faq-chevron" aria-hidden="true" /></summary><p>{entry.answer}</p></details>)}
      </div>
    </section>}
    <section className="container catalog-help">
      <h2>Chưa biết nên chọn gói nào?</h2>
      <p>Để lại địa chỉ và nhu cầu sử dụng. Nhân viên sẽ kiểm tra hạ tầng, xác nhận giá và tư vấn thiết bị phù hợp trước khi lắp đặt.</p>
      <RegistrationButton className="button">Đăng ký tư vấn</RegistrationButton>
    </section>
  </>
}
