import Link from 'next/link'
import type { SiteSetting } from '@/payload-types'
import { activeContacts, normalizePhone } from '@/lib/contacts'
import { RegistrationButton } from '@/components/forms/RegistrationButton'

export function Footer({ settings }: { settings: SiteSetting }) {
  const contacts = activeContacts(settings.contacts)
  return <footer className="site-footer"><div className="container">
    <div className="footer-grid">
      <div><Link href="/" aria-label="Viettel — Trang chủ"><img className="brand-logo" src="/images/viettel.svg" alt="viettel" width="112" height="34" /></Link><p>Kết nối cuộc sống.<br />Trọn vẹn từng khoảnh khắc.</p></div>
      <div><h3>Khám phá</h3><Link href="/#goi-cuoc">Gói Internet</Link><Link href="/#entertainment">Internet + TV360</Link><Link href="/#camera">Internet + Camera</Link></div>
      <div><h3>Hỗ trợ lắp đặt</h3>
        {contacts.length ? contacts.map((person, index) => <a key={person.id ?? index} href={`tel:${normalizePhone(person.phone)}`}>{person.name} · {person.phone}</a>)
          : <RegistrationButton className="footer-consultation">Để lại thông tin tư vấn</RegistrationButton>}
      </div>
    </div>
    <div className="footer-bottom"><span>Internet Viettel · Kết nối cho mọi nhà</span><span>Giá và ưu đãi được xác nhận theo địa chỉ lắp đặt.</span></div>
  </div></footer>
}
