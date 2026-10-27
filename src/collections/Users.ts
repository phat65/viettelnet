import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { validateAdminPassword } from '@/lib/adminPassword'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Quản trị viên', plural: 'Quản trị viên' },
  auth: {
    maxLoginAttempts: 5, lockTime: 600000,
    cookies: {
      sameSite: 'Lax',
      secure: (process.env.PAYLOAD_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || '').startsWith('https://'),
    },
  },
  admin: { useAsTitle: 'email', group: 'Hệ thống' },
  access: { admin: isAdmin, create: isAdmin, read: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: {
    beforeValidate: [({ data }) => {
      // An empty password on profile updates means keep the existing password.
      if (data?.password !== undefined && data.password !== '') {
        const result = validateAdminPassword(data.password)
        if (result !== true) throw new ValidationError({ errors: [{ path: 'password', message: result }] })
      }
      return data
    }],
  },
  fields: [{ name: 'name', label: 'Họ tên', type: 'text' }],
}
