import Link from 'next/link'
import { catalogGroups } from '@/data/catalog'

export function Welcome() {
  return (
    <section className="sales-welcome">
      <span className="sales-welcome__eyebrow">QUẢN TRỊ WEBSITE</span>
      <h1>Công việc hôm nay</h1>
      <p>Thêm gói vào nhóm có sẵn, cập nhật giá theo khu vực và soạn trang chi tiết. Theo dõi đăng ký và quản lý số liên hệ tại đây.</p>
      <div className="sales-welcome__links">
        <Link href="/admin/collections/leads">Xem người đăng ký →</Link>
        <Link href="/admin/collections/packages">Quản lý gói cước →</Link>
        <Link href="/admin/globals/site-settings">Liên hệ & Zalo →</Link>
      </div>
      <h2>Danh mục gói cước</h2>
      <div className="sales-welcome__links">{catalogGroups.map((group) => <Link key={group.id} href={`/admin/collections/packages?where[catalogGroup][equals]=${group.id}`}>{group.title} →</Link>)}</div>
    </section>
  )
}
