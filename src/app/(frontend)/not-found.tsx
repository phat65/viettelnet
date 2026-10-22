import Link from 'next/link'

export default function NotFound() {
  return <section className="container section"><h1>Không tìm thấy trang</h1>
    <p>Gói cước có thể đã được cập nhật hoặc ngừng cung cấp.</p><Link className="button" href="/">Về trang chủ</Link>
  </section>
}
