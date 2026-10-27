import type { Field, GlobalConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { catalogGroups } from '@/data/catalog'
import { catalogRoutes } from '@/lib/catalogRoutes'

const contentFields = (heading: string, intro: string): Field[] => [
  { name: 'heading', label: 'Tiêu đề trang', type: 'text', defaultValue: heading },
  { name: 'intro', label: 'Giới thiệu', type: 'textarea', defaultValue: intro },
  { name: 'advice', label: 'Nội dung tư vấn', type: 'richText', admin: { description: 'Hiển thị dưới danh sách gói. Không cần nhập lại bảng giá.' } },
  { name: 'faq', label: 'Câu hỏi thường gặp', type: 'array', fields: [
    { name: 'question', label: 'Câu hỏi', type: 'text', required: true },
    { name: 'answer', label: 'Trả lời', type: 'textarea', required: true },
  ] },
  { name: 'seoTitle', label: 'Tiêu đề SEO', type: 'text' },
  { name: 'seoDescription', label: 'Mô tả SEO', type: 'textarea', maxLength: 180 },
]

export const CatalogContent: GlobalConfig = {
  slug: 'catalog-content', label: 'Nội dung danh mục',
  admin: { group: 'Nội dung', description: 'Chọn tab danh mục để sửa trang tương ứng. Đường dẫn và các gói giữ nguyên; để trống tiêu đề/giới thiệu/SEO sẽ dùng nội dung mặc định.' },
  access: { read: () => true, update: isAdmin },
  fields: [{ type: 'tabs', tabs: [
    { label: 'Tất cả Internet', fields: [{ name: 'internet', type: 'group', label: 'Trang /internet', fields: contentFields('Internet Viettel: chọn gói phù hợp với bạn', 'Từ kết nối hằng ngày đến truyền hình, camera và WiFi cho nhà nhiều tầng. Chọn nhóm dịch vụ để so sánh gói, xem thiết bị và mức giá phù hợp.') }] },
    ...catalogGroups.map((group) => ({ label: group.id === 'individual' ? 'Cá nhân' : group.label, fields: [
      { name: group.id, type: 'group' as const, label: group.title, fields: contentFields(catalogRoutes[group.id].title, catalogRoutes[group.id].guide) },
    ] })),
  ] }],
}
