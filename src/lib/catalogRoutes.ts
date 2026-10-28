import { catalogGroups, type CatalogGroup } from '@/data/catalog'

export const catalogRoutes: Record<CatalogGroup, { slug: string; title: string; guide: string }> = {
  individual: { slug: 'ca-nhan', title: 'Gói Internet Viettel cho cá nhân và gia đình', guide: 'So sánh tốc độ và thiết bị đi kèm theo số người, số thiết bị thường dùng. Nếu nhà có nhiều phòng hoặc vật cản, cân nhắc gói có Mesh để mở rộng vùng phủ WiFi.' },
  entertainment: { slug: 'tv360', title: 'Gói Internet Viettel kèm truyền hình TV360', guide: 'Các gói dưới đây kết hợp Internet và truyền hình TV360. Kiểm tra tốc độ, thiết bị và nội dung dịch vụ đi kèm trên trang từng gói; quyền xem và ưu đãi được xác nhận khi đăng ký.' },
  camera: { slug: 'camera', title: 'Gói Internet Viettel kèm Camera', guide: 'So sánh các gói Internet có camera, tốc độ kết nối và thiết bị Mesh đi kèm. Vị trí lắp camera, nhu cầu lưu trữ và điều kiện sử dụng sẽ được tư vấn theo địa chỉ thực tế.' },
  mesh: { slug: 'mesh-wifi', title: 'Gói Mesh WiFi Viettel cho nhà nhiều tầng', guide: 'Số tầng, diện tích và vật cản ảnh hưởng đến cách bố trí Mesh. Xem số thiết bị trong từng gói, sau đó đăng ký tư vấn để lựa chọn vị trí đặt phù hợp với ngôi nhà.' },
  ultra: { slug: 'ultra-speed', title: 'Gói Internet Viettel Ultra Speed đến 1 Gbps', guide: 'Các gói Ultra Speed dành cho nhu cầu truyền tải dữ liệu lớn, làm việc và giải trí tốc độ cao. Khả năng lắp đặt cần được kiểm tra theo hạ tầng tại địa chỉ của bạn; tốc độ thực tế còn phụ thuộc thiết bị và kết nối.' },
  offers: { slug: 'uu-dai', title: 'Gói Internet Viettel kết hợp TV360 và Camera', guide: 'Xem các gói kết hợp Internet, truyền hình và camera, cùng thiết bị đi kèm. So sánh mức giá theo khu vực; ưu đãi, phí và điều kiện áp dụng được xác nhận tại thời điểm đăng ký.' },
}

export const internetPath = '/internet'
export const packagePath = (slug: string) => `${internetPath}/${encodeURIComponent(slug)}`
export const groupPath = (group: CatalogGroup) => `${internetPath}/${catalogRoutes[group].slug}`
export const groupFromSlug = (slug: string) => catalogGroups.find((group) => catalogRoutes[group.id].slug === slug)

// These names belong to category and location pages, not individual packages.
const reservedSlugs = new Set([...Object.values(catalogRoutes).map((route) => route.slug), 'khu-vuc'])
export function validatePackageSlug(value: unknown): true | string {
  if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return 'Dùng chữ thường không dấu, số và dấu gạch ngang.'
  if (reservedSlugs.has(value)) return 'Đường dẫn này dành cho danh mục. Hãy dùng tên riêng của gói, ví dụ netvt1.'
  return true
}

export const catalogNavigation = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Internet', href: internetPath },
  { label: 'TV360', href: groupPath('entertainment') },
  { label: 'Camera', href: groupPath('camera') },
  { label: 'Mesh WiFi', href: groupPath('mesh') },
  { label: 'Ultra Speed', href: groupPath('ultra') },
  { label: 'Ưu đãi', href: groupPath('offers') },
]
