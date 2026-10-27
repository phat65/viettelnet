import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { validContactPhone, validZaloUrl } from '@/lib/contacts'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Đơn vị & Liên hệ',
  admin: { group: 'Kinh doanh', description: 'Thông tin công khai ở footer và các trang hỗ trợ. Nhập đúng đơn vị vận hành thực tế; các số liên hệ dùng chung cho website.' },
  access: { read: () => true, update: isAdmin },
  fields: [
    { name: 'organization', label: 'Đơn vị vận hành', type: 'group', fields: [
      { name: 'name', label: 'Tên đơn vị / người vận hành', type: 'text' },
      { name: 'description', label: 'Giới thiệu ngắn / vai trò', type: 'textarea' },
      { name: 'address', label: 'Địa chỉ liên hệ', type: 'textarea' },
      { name: 'email', label: 'Email liên hệ', type: 'email' },
      { name: 'workingHours', label: 'Giờ tư vấn', type: 'text' },
    ] },
    { type: 'tabs', tabs: [
      { label: 'Giới thiệu', fields: [{ name: 'about', label: 'Trang /gioi-thieu', type: 'group', fields: supportFields() }] },
      { label: 'Liên hệ', fields: [{ name: 'contact', label: 'Trang /lien-he', type: 'group', fields: supportFields() }] },
      { label: 'Chính sách bảo mật', fields: [{ name: 'privacy', label: 'Trang /chinh-sach-bao-mat', type: 'group', fields: supportFields() }] },
    ] },
    {
      name: 'contacts', label: 'Danh sách liên hệ', type: 'array',
      labels: { singular: 'Người liên hệ', plural: 'Người liên hệ' },
      admin: { description: 'Có thể thêm nhiều số. Thứ tự ở đây cũng là thứ tự hiển thị trên website.' },
      fields: [
        { name: 'name', label: 'Tên hiển thị', type: 'text', required: true, maxLength: 80 },
        { name: 'phone', label: 'Số điện thoại', type: 'text', required: true,
          validate: (value: unknown) => typeof value === 'string' && validContactPhone(value) || 'Nhập số điện thoại Việt Nam hợp lệ.' },
        { name: 'zaloEnabled', label: 'Cho phép liên hệ Zalo', type: 'checkbox', defaultValue: true },
        { name: 'zaloUrl', label: 'Link Zalo (không bắt buộc)', type: 'text',
          admin: { description: 'Ví dụ https://zalo.me/09xxxxxxxx. Để trống để tự dùng số di động phía trên.' },
          validate: (value: unknown) => !value || typeof value === 'string' && validZaloUrl(value) || 'Dùng link https://zalo.me/...' },
        { name: 'enabled', label: 'Hiển thị trên website', type: 'checkbox', defaultValue: true },
      ],
    },
    // Preserve legacy values and uploads in the database; the showcase has fixed content.
    { name: 'siteName', label: 'Tên website', type: 'text', defaultValue: 'Internet Viettel', required: true, admin: { hidden: true } },
    { name: 'hotline', label: 'Hotline tư vấn', type: 'text', admin: { hidden: true },
      validate: (value: unknown) => !value || (typeof value === 'string' && /^\+?[0-9 ()-]{8,20}$/.test(value)) || 'Nhập số điện thoại hợp lệ.' },
    { name: 'zaloUrl', label: 'Đường dẫn Zalo', type: 'text', admin: { hidden: true },
      validate: (value: unknown) => {
        if (!value) return true
        try { const url = new URL(String(value)); return (url.protocol === 'https:' && url.hostname === 'zalo.me') || 'Dùng đường dẫn https://zalo.me/...' }
        catch { return 'Đường dẫn không hợp lệ.' }
      },
    },
    { name: 'heroTitle', label: 'Tiêu đề banner', type: 'text', admin: { hidden: true } },
    { name: 'heroDescription', label: 'Mô tả banner', type: 'textarea', admin: { hidden: true } },
    { name: 'banner', label: 'Ảnh banner', type: 'upload', relationTo: 'media', admin: { hidden: true } },
    { name: 'footerText', label: 'Thông tin đơn vị tư vấn', type: 'textarea', admin: { hidden: true } },
  ],
}

function supportFields(): import('payload').Field[] {
  return [
    { name: 'content', label: 'Nội dung trang', type: 'richText', admin: { description: 'Để trống để dùng nội dung cơ bản. Thông tin đơn vị và các số liên hệ được lấy tự động từ cấu hình chung.' } },
    { name: 'seoTitle', label: 'Tiêu đề SEO', type: 'text' },
    { name: 'seoDescription', label: 'Mô tả SEO', type: 'textarea', maxLength: 180 },
  ]
}
