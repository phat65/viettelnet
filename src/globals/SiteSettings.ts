import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { validContactPhone, validZaloUrl } from '@/lib/contacts'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Liên hệ & Zalo',
  admin: { group: 'Kinh doanh', description: 'Thêm các số tư vấn. Khách bấm Gọi hoặc Zalo trên website rồi chọn người muốn liên hệ.' },
  access: { read: () => true, update: isAdmin },
  fields: [
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
