import path from 'node:path'
import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Hình ảnh', plural: 'Hình ảnh' },
  admin: { group: 'Nội dung', useAsTitle: 'alt', description: 'Ảnh JPG, PNG, WebP hoặc AVIF. Tối đa 5 MB mỗi ảnh.' },
  access: { read: () => true, create: isAdmin, update: isAdmin, delete: isAdmin },
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    imageSizes: [{ name: 'card', width: 720, height: 480, fit: 'inside' }],
  },
  fields: [{ name: 'alt', label: 'Mô tả ảnh', type: 'text', required: true }],
}
