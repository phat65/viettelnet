import type { CollectionConfig } from 'payload'
import { adminOrPublished, isAdmin } from '@/access/isAdmin'
import { catalogGroups } from '@/data/catalog'
import { validatePackageSlug } from '@/lib/catalogRoutes'

export const Packages: CollectionConfig = {
  slug: 'packages',
  labels: { singular: 'Gói cước', plural: 'Gói cước' },
  admin: {
    useAsTitle: 'name',
    group: 'Kinh doanh',
    defaultColumns: ['name', 'catalogGroup', 'speed', 'status'],
    description: 'Chọn nhóm gói có sẵn, nhập giá từng khu vực và soạn nội dung trang chi tiết. Gói đang bán sẽ tự xuất hiện trên website.',
  },
  access: { read: adminOrPublished, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'name', label: 'Tên gói', type: 'text', required: true },
    {
      name: 'catalogGroup', label: 'Mục gói cước', type: 'select', required: true, defaultValue: 'individual',
      options: catalogGroups.map((group) => ({ label: group.title, value: group.id })),
    },
    {
      name: 'slug', label: 'Đường dẫn', type: 'text', unique: true, required: true, index: true,
      admin: { description: 'Ví dụ netvt1 → /internet/netvt1. Giữ nguyên đường dẫn sau khi xuất bản để không làm mất liên kết cũ.' },
      validate: validatePackageSlug,
    },
    {
      name: 'category', label: 'Loại dịch vụ', type: 'select', required: true, defaultValue: 'internet', admin: { hidden: true },
      hooks: { beforeValidate: [({ data }) => data?.catalogGroup === 'entertainment' ? 'tv360' : ['camera', 'offers'].includes(data?.catalogGroup) ? 'camera' : 'internet'] },
      options: [
        { label: 'Internet', value: 'internet' },
        { label: 'Internet + TV360', value: 'tv360' },
        { label: 'Internet + Camera', value: 'camera' },
      ],
    },
    { name: 'speed', label: 'Tốc độ (Mbps)', type: 'number', min: 0, required: true, admin: { description: 'Nhập 0 cho Camera/Cloud bán riêng, không bao gồm đường truyền Internet.' } },
    { name: 'priceUnit', label: 'Đơn vị giá', type: 'text', defaultValue: '/tháng', maxLength: 32, admin: { description: 'Ví dụ /tháng, /tháng/camera hoặc /bộ. Ghi rõ thời hạn Cloud trong thiết bị/dịch vụ đi kèm.' } },
    { name: 'image', label: 'Ảnh minh họa', type: 'upload', relationTo: 'media' },
    {
      name: 'prices', label: 'Giá theo khu vực', type: 'array', minRows: 1, required: true,
      fields: [
        {
          name: 'region', label: 'Khu vực', type: 'select', required: true,
          options: [
            { label: 'Giá giới thiệu (xác nhận theo địa chỉ)', value: 'reference' },
            { label: 'Hà Nội & TP.HCM', value: 'metro' },
            { label: 'Tỉnh / thành khác', value: 'other' },
          ],
        },
        { name: 'monthlyPrice', label: 'Giá theo kỳ (VNĐ)', type: 'number', min: 0, required: true },
        { name: 'installationFee', label: 'Phí lắp đặt (VNĐ)', type: 'number', min: 0 },
        { name: 'activationFee', label: 'Phí hòa mạng (VNĐ)', type: 'number', min: 0 },
        { name: 'commitmentMonths', label: 'Cam kết (tháng)', type: 'number', min: 0 },
      ],
      validate: (rows: unknown) => {
        if (!Array.isArray(rows) || !rows.length) return 'Nhập ít nhất một khu vực.'
        const regions = rows.map((row) => row.region)
        return new Set(regions).size === regions.length || 'Mỗi khu vực chỉ có một mức giá.'
      },
    },
    {
      name: 'equipment', label: 'Thiết bị / dịch vụ bao gồm', type: 'array',
      fields: [{ name: 'name', label: 'Tên thiết bị / dịch vụ', type: 'text', required: true }],
    },
    { name: 'description', label: 'Nội dung giới thiệu', type: 'textarea', required: true },
    { name: 'detailContent', label: 'Bài viết chi tiết gói cước', type: 'richText', admin: { description: 'Soạn ưu điểm, đối tượng phù hợp, hướng dẫn đăng ký và câu hỏi thường gặp. Thông số và bảng giá phía trên sẽ tự hiển thị từ dữ liệu gói, không cần nhập lại trong bài viết.' } },
    { name: 'conditions', label: 'Điều kiện áp dụng', type: 'textarea', required: true },
    { name: 'seoTitle', label: 'Tiêu đề SEO', type: 'text' },
    { name: 'seoDescription', label: 'Mô tả SEO', type: 'textarea', maxLength: 180 },
    { name: 'sortOrder', label: 'Thứ tự', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    {
      name: 'status', label: 'Hiển thị', type: 'select', defaultValue: 'draft', required: true,
      options: [{ label: 'Bản nháp', value: 'draft' }, { label: 'Đang bán', value: 'published' }],
      admin: { position: 'sidebar' },
    },
  ],
}
