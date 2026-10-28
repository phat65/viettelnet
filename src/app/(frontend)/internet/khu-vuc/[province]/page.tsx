import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPackages } from '@/lib/queries'
import { provinceFromSlug, provincePath } from '@/lib/provinces'
import { PackageList } from '@/components/packages/PackageList'
import { ProvinceNavigation } from '@/components/packages/ProvinceNavigation'
import { RegistrationButton } from '@/components/forms/RegistrationButton'

type Props = { params: Promise<{ province: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const province = provinceFromSlug((await params).province)
  if (!province) notFound()
  const title = `Lắp mạng Viettel tại ${province.name}: gói cước và giá Internet`
  const description = `Xem giá gói Internet Viettel tại ${province.name}, thiết bị và thông tin lắp đặt. Đăng ký tư vấn để kiểm tra hạ tầng, xác nhận chi phí tại địa chỉ của bạn.`
  const url = provincePath(province.slug)
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, siteName: 'Viettelnet', locale: 'vi_VN', type: 'website' } }
}

export default async function ProvincePage({ params }: Props) {
  const province = provinceFromSlug((await params).province)
  if (!province) notFound()
  const packages = await getPackages()
  return <>
    <div className="container catalog-intro">
      <nav className="breadcrumbs" aria-label="Đường dẫn"><Link href="/">Trang chủ</Link><span aria-hidden="true">›</span><Link href="/internet">Internet</Link><span aria-hidden="true">›</span><span aria-current="page">{province.name}</span></nav>
      <h1>Lắp mạng Viettel tại {province.name}</h1>
      <p>So sánh gói Internet, TV360, Camera và Mesh WiFi với giá tại {province.name}. Chọn gói để xem thiết bị, chi phí và gửi yêu cầu tư vấn theo địa chỉ lắp đặt.</p>
      <ProvinceNavigation slug={province.slug} />
      <p className="catalog-price-note">Giá bên dưới dành cho {province.name}. Gói chưa có bảng giá tại địa phương sẽ hiển thị “Liên hệ”; khả năng lắp đặt cần được kiểm tra theo địa chỉ cụ thể.</p>
    </div>
    <PackageList packages={packages} province={province} />
    <section className="container catalog-help">
      <h2>Thông tin lắp đặt Internet tại {province.name}</h2>
      <ol className="installation-steps">
        <li><strong>Gửi địa chỉ lắp đặt:</strong> chọn phường/xã tại {province.name}, nhập số nhà, tên đường hoặc thôn/xóm cùng số điện thoại liên hệ.</li>
        <li><strong>Kiểm tra và xác nhận:</strong> nhân viên kiểm tra hạ tầng, tư vấn gói, thiết bị, phí hòa mạng, phí lắp đặt và thời hạn cam kết tại địa chỉ của bạn.</li>
        <li><strong>Thống nhất lịch:</strong> lịch lắp đặt được hẹn sau khi xác nhận điều kiện cung cấp dịch vụ. Đăng ký tư vấn chưa phải xác nhận có hạ tầng.</li>
      </ol>
      <RegistrationButton provinceCode={province.code}>Tư vấn lắp đặt tại {province.name}</RegistrationButton>
    </section>
  </>
}
