import Image from 'next/image'
import type { Metadata } from 'next'
import { getPackages } from '@/lib/queries'
import { PackageList } from '@/components/packages/PackageList'
import { RegistrationButton } from '@/components/forms/RegistrationButton'
import { FrequentlyAskedQuestions } from '@/components/layout/FrequentlyAskedQuestions'
import { Icon } from '@/components/ui/Icon'

const title = 'Lắp mạng Viettel, Internet WiFi & TV360 | Viettelnet'
const description = 'Xem các gói Internet Viettel, TV360, Camera và Mesh WiFi. So sánh giá theo khu vực, thiết bị đi kèm và đăng ký tư vấn lắp đặt tại địa chỉ của bạn.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/' },
  openGraph: { title, description, url: '/', siteName: 'Viettelnet', locale: 'vi_VN', type: 'website' },
}

export default async function Home() {
  const packages = await getPackages()
  return <>
    <section className="hero"><div className="container hero-inner">
      <div className="hero-copy"><span className="hero-kicker"><span /> INTERNET VIETTEL · KẾT NỐI MỖI NGÀY</span>
        <h1>Trải nghiệm Internet<br /><em>không giới hạn.</em></h1>
        <p className="hero-description">Làm việc hết mình. Giải trí hết ý.<br />Một kết nối cho mọi khoảnh khắc bên nhau.</p>
        <div className="hero-price"><span>Chỉ từ</span><strong>195.000<small>đ</small></strong><span>/ tháng</span></div>
        <a href="/internet" className="button button--large">Tìm gói phù hợp <Icon name="arrow" width="19" height="19" /></a>
        <p className="hero-price-note">Giá tham khảo, xác nhận theo địa chỉ lắp đặt.</p>
      </div>
      <div className="hero-art">
        <div className="hero-orbit hero-orbit--one" /><div className="hero-orbit hero-orbit--two" />
        <Image src="/images/internet-banner.png" alt="Gia đình kết nối Internet tại nhà" width={646} height={450} priority className="hero-family" />
        <span className="hero-chip hero-chip--speed"><span className="icon-box"><Icon name="bolt" /></span><span><strong>Đến 1 Gbps</strong><small>Sẵn sàng bứt phá</small></span></span>
        <span className="hero-chip hero-chip--wifi"><Icon name="wifi" /><span>Thế hệ <strong>WiFi 6</strong></span></span>
      </div>
    </div></section>
    <div className="benefits-strip"><div className="container benefits-inner">
      <div><Icon name="bolt" /><span><strong>Băng thông đến 1Gbps</strong><small>Từ 300Mbps cho nhu cầu mỗi ngày</small></span></div>
      <div><Icon name="wifi" /><span><strong>Modem WiFi 6 đi kèm</strong><small>Kết nối cho nhiều thiết bị</small></span></div>
      <div><Icon name="home" /><span><strong>Mở rộng cùng Mesh WiFi</strong><small>Lựa chọn gói phù hợp không gian</small></span></div>
    </div></div>
    <PackageList packages={packages} />
    <section className="connection-section" id="trai-nghiem"><div className="container connection-inner">
      <div className="connection-image"><Image src="/images/internet-request.webp" alt="WiFi 6 kết nối nhiều thiết bị cho gia đình và công việc" width={459} height={459} sizes="(max-width: 700px) 90vw, 430px" /></div>
      <div><span className="eyebrow">KẾT NỐI VỮNG VÀNG</span><h2>Một đường truyền.<br />Hàng triệu trải nghiệm.</h2>
        <p className="section-intro">Từ cuộc họp quan trọng đến bộ phim cả nhà yêu thích, Internet Viettel luôn là một phần trong cuộc sống của bạn.</p>
        <div className="connection-stats"><div><strong>10 triệu</strong><span>Khách hàng sử dụng Internet</span></div><div><strong>8 triệu</strong><span>Khách hàng hài lòng</span></div></div>
        <p className="source-note">Số liệu giới thiệu trên <a href="https://www.viettelup.vn/internet" target="_blank" rel="noopener noreferrer">ViettelUp</a>.</p>
      </div>
    </div></section>
    <section id="uu-dai" className="container promotion-section">
      <div className="installation-banner">
        <div className="installation-copy"><span className="installation-kicker"><Icon name="wifi" width="18" height="18" /> TƯ VẤN LẮP ĐẶT INTERNET</span>
          <h2>Nhà bạn cần Internet?<br /><span>Để chúng tôi giúp bạn chọn.</span></h2>
          <p>Từ căn hộ nhỏ đến nhà nhiều tầng, chọn đường truyền và thiết bị phù hợp với cách gia đình bạn sử dụng mỗi ngày.</p>
          <RegistrationButton className="button installation-cta">Tư vấn gói phù hợp <Icon name="arrow" width="18" height="18" /></RegistrationButton>
        </div>
        <figure className="installation-visual">
          <span className="installation-wifi"><Icon name="wifi" width="32" height="32" /></span>
          <Image src="/images/internet-statements.png" alt="Modem WiFi, thiết bị Mesh và camera Viettel" width={698} height={403} sizes="(max-width: 760px) 85vw, 460px" />
          <figcaption>Thiết bị được lựa chọn theo từng gói cước</figcaption>
        </figure>
        <div className="installation-benefits">
          <div><Icon name="home" /><span><strong>Kiểm tra tại địa chỉ nhà bạn</strong><small>Xác nhận hạ tầng trước khi lắp</small></span></div>
          <div><Icon name="check" /><span><strong>Tư vấn rõ gói và giá</strong><small>Phù hợp nhu cầu, số lượng thiết bị</small></span></div>
          <div><Icon name="phone" /><span><strong>Hẹn lịch thuận tiện</strong><small>Nhân viên liên hệ để thống nhất</small></span></div>
        </div>
      </div>
    </section>
    <section className="container lifestyle-section"><div className="center-heading"><span className="eyebrow">CHO MỌI NHỊP SỐNG</span><h2>Internet dành riêng cho cách bạn sống</h2><p>Cá nhân, gia đình hay game thủ — luôn có một lựa chọn phù hợp.</p></div>
      <div className="lifestyle-grid">
        <a href="/internet/ca-nhan"><span className="lifestyle-icon"><Icon name="work" width="30" height="30" /></span><span className="eyebrow">LÀM VIỆC & HỌC TẬP</span><h3>Kết nối công việc.<br />Giữ trọn cảm hứng.</h3><p>Học online, họp trực tuyến và làm việc từ xa, ngay trong không gian của bạn.</p><span className="text-link">Xem gói cá nhân <Icon name="arrow" width="17" height="17" /></span></a>
        <a href="/internet/tv360"><span className="lifestyle-icon"><Icon name="users" width="30" height="30" /></span><span className="eyebrow">CHO CẢ GIA ĐÌNH</span><h3>Cùng nhau chia sẻ.<br />Cùng nhau tận hưởng.</h3><p>Kết nối nhiều thiết bị, xem phim và giải trí để cả nhà thêm gần nhau.</p><span className="text-link">Khám phá gói giải trí <Icon name="arrow" width="17" height="17" /></span></a>
        <a href="/internet/ultra-speed"><span className="lifestyle-icon"><Icon name="game" width="30" height="30" /></span><span className="eyebrow">GAME & STREAMING</span><h3>Bứt phá tốc độ.<br />Bắt trọn khoảnh khắc.</h3><p>Khám phá đường truyền đến 1Gbps cho nhu cầu chơi game và streaming.</p><span className="text-link">Trải nghiệm Ultra Speed <Icon name="arrow" width="17" height="17" /></span></a>
      </div>
    </section>
    <section className="mesh-section"><div className="container mesh-inner">
      <div><span className="eyebrow">HOMEWIFI · PHỦ SÓNG CẢ NHÀ</span><h2>Tầng nào cũng gần.<br />Góc nào cũng kết nối.</h2><p>Mesh WiFi mở rộng vùng phủ, giúp kết nối đi xa hơn trong không gian nhiều phòng và nhiều tầng.</p>
        <ul className="check-list"><li><Icon name="check" />Mở rộng vùng phủ WiFi</li><li><Icon name="check" />Linh hoạt bố trí theo không gian</li><li><Icon name="check" />Lựa chọn 1, 2 hoặc 3 Mesh theo gói</li></ul>
        <a className="button button--secondary" href="/internet/mesh-wifi">Xem gói Mesh WiFi <Icon name="arrow" width="17" height="17" /></a>
      </div><figure><Image src="/images/internet-statements.png" alt="Hình minh họa modem, Mesh WiFi và camera Viettel" width={698} height={403} sizes="(max-width: 700px) 90vw, 580px" /><figcaption>Hình minh họa. Thiết bị đi kèm được ghi riêng trong từng gói.</figcaption></figure>
    </div></section>
    <FrequentlyAskedQuestions />
  </>
}
