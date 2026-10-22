import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Đăng ký gói', plural: 'Người đăng ký' },
  admin: {
    useAsTitle: 'phone', group: 'Kinh doanh',
    defaultColumns: ['createdAt', 'name', 'phone', 'package', 'provinceName', 'wardName', 'status'],
    description: 'Xem khách đã đăng ký gói nào, số điện thoại, khu vực và cập nhật kết quả liên hệ.',
  },
  access: { create: isAdmin, read: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'name', label: 'Họ tên khách', type: 'text', maxLength: 100 },
    { name: 'phone', label: 'Số điện thoại', type: 'text', required: true, index: true },
    { name: 'area', label: 'Địa chỉ / khu vực lắp đặt', type: 'text', required: true },
    { name: 'provinceName', label: 'Tỉnh / thành phố', type: 'text', index: true, admin: { readOnly: true } },
    { name: 'wardName', label: 'Phường / xã', type: 'text', admin: { readOnly: true } },
    { name: 'addressLine', label: 'Số nhà, đường / thôn xóm', type: 'text', admin: { readOnly: true } },
    { name: 'provinceCode', label: 'Mã tỉnh / thành', type: 'text', admin: { hidden: true } },
    { name: 'wardCode', label: 'Mã phường / xã', type: 'text', admin: { hidden: true } },
    { name: 'region', label: 'Vùng giá (đăng ký cũ)', type: 'select', admin: { readOnly: true, condition: (data) => Boolean(data?.region) }, options: [
      { label: 'Hà Nội & TP.HCM', value: 'metro' }, { label: 'Tỉnh / thành khác', value: 'other' },
    ] },
    { name: 'package', label: 'Gói quan tâm', type: 'relationship', relationTo: 'packages' },
    { name: 'customerNote', label: 'Ghi chú của khách', type: 'textarea', maxLength: 1000 },
    {
      name: 'status', label: 'Trạng thái', type: 'select', required: true, defaultValue: 'new',
      options: [
        { label: 'Chưa liên hệ', value: 'new' },
        { label: 'Đã liên hệ', value: 'contacted' },
        { label: 'Đã hoàn tất', value: 'completed' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'internalNote', label: 'Ghi chú nội bộ', type: 'textarea' },
  ],
}
