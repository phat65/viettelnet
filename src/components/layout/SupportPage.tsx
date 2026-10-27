import type { Metadata } from 'next'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getSiteSettings } from '@/lib/queries'
import { activeContacts, contactZaloUrl, normalizePhone } from '@/lib/contacts'
import { RegistrationButton } from '@/components/forms/RegistrationButton'

const pages = {
  about: { path: '/gioi-thieu', title: 'Giới thiệu', description: 'Thông tin đơn vị vận hành website và hỗ trợ tư vấn các gói Internet, TV360, Camera.' },
  contact: { path: '/lien-he', title: 'Liên hệ tư vấn', description: 'Liên hệ tư vấn gói cước, kiểm tra hạ tầng và hỗ trợ đăng ký lắp đặt Internet theo địa chỉ.' },
  privacy: { path: '/chinh-sach-bao-mat', title: 'Chính sách bảo mật', description: 'Thông tin về việc thu thập, sử dụng và liên hệ xử lý dữ liệu đăng ký tư vấn trên website.' },
}
type PageKind = keyof typeof pages

export async function supportMetadata(kind: PageKind): Promise<Metadata> {
  const settings = await getSiteSettings()
  const page = pages[kind]
  const title = settings[kind]?.seoTitle?.trim() || page.title
  const description = settings[kind]?.seoDescription?.trim() || page.description
  return { title, description, alternates: { canonical: page.path }, openGraph: { title, description, url: page.path, type: 'website', locale: 'vi_VN' } }
}

export async function SupportPage({ kind }: { kind: PageKind }) {
  const settings = await getSiteSettings()
  const page = pages[kind]
  const organization = settings.organization
  const content = settings[kind]?.content
  const contacts = activeContacts(settings.contacts)
  return <article className="container support-page">
    <nav className="breadcrumbs" aria-label="Đường dẫn"><Link href="/">Trang chủ</Link><span aria-hidden="true">›</span><span aria-current="page">{page.title}</span></nav>
    <h1>{page.title}</h1>
    <div className="managed-content">
      {content ? <RichText data={content} /> : kind === 'about' ? <>
        <p>Website giúp bạn tham khảo các gói Internet, TV360, Camera và đăng ký tư vấn theo nhu cầu sử dụng.</p>
        <p>Giá cước, thiết bị, ưu đãi và khả năng lắp đặt được xác nhận theo địa chỉ trước khi đăng ký dịch vụ.</p>
      </> : kind === 'contact' ? <p>Chọn số điện thoại hoặc Zalo bên dưới để được tư vấn. Bạn cũng có thể để lại thông tin để nhân viên liên hệ kiểm tra hạ tầng tại địa chỉ lắp đặt.</p> : <>
        <h2>Thông tin được tiếp nhận</h2>
        <p>Khi gửi yêu cầu tư vấn, website tiếp nhận số điện thoại, địa chỉ lắp đặt, gói quan tâm và tên nếu bạn cung cấp.</p>
        <h2>Mục đích sử dụng</h2>
        <p>Thông tin được dùng để liên hệ tư vấn, kiểm tra khả năng lắp đặt và hỗ trợ xử lý yêu cầu đăng ký. Nhân viên được cấp quyền quản trị có thể xem yêu cầu để thực hiện việc này.</p>
        <h2>Liên hệ về dữ liệu của bạn</h2>
        <p>Bạn có thể liên hệ qua các kênh bên dưới để yêu cầu kiểm tra, sửa hoặc xóa thông tin đã gửi. Đơn vị tiếp nhận có thể cần xác minh yêu cầu trước khi xử lý.</p>
        <h2>Liên kết Zalo</h2>
        <p>Khi chọn liên hệ Zalo, bạn chuyển sang dịch vụ của Zalo; việc sử dụng dữ liệu trên dịch vụ đó tuân theo chính sách của Zalo.</p>
      </>}
    </div>
    <section className="support-contact" aria-labelledby="support-contact-title">
      <h2 id="support-contact-title">Thông tin liên hệ</h2>
      {organization?.name && <p><strong>{organization.name}</strong></p>}
      {organization?.description && <p>{organization.description}</p>}
      {organization?.address && <p>Địa chỉ: {organization.address}</p>}
      {organization?.email && <p>Email: <a href={`mailto:${organization.email}`}>{organization.email}</a></p>}
      {organization?.workingHours && <p>Giờ tư vấn: {organization.workingHours}</p>}
      {contacts.map((person, index) => {
        const zalo = contactZaloUrl(person)
        return <div className="support-person" key={person.id || index}><strong>{person.name}</strong><a href={`tel:${normalizePhone(person.phone)}`}>{person.phone}</a>{zalo && <a href={zalo} target="_blank" rel="noopener noreferrer">Nhắn Zalo</a>}</div>
      })}
      <RegistrationButton className="button">Đăng ký tư vấn</RegistrationButton>
    </section>
  </article>
}
