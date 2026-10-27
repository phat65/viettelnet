import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vi } from '@payloadcms/translations/languages/vi'
import sharp from 'sharp'
import { lexicalEditor, FixedToolbarFeature } from '@payloadcms/richtext-lexical'
import { Users } from '@/collections/Users'
import { Packages } from '@/collections/Packages'
import { Leads } from '@/collections/Leads'
import { Media } from '@/collections/Media'
import { SiteSettings } from '@/globals/SiteSettings'
import { CatalogContent } from '@/globals/CatalogContent'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  editor: lexicalEditor({ features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()] }),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.PAYLOAD_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    meta: { titleSuffix: '· Quản trị Internet', icons: { icon: '/favicon.ico?v=viettel-20261022', shortcut: '/favicon.ico?v=viettel-20261022' } },
    importMap: { baseDir: dirname },
    components: { beforeDashboard: ['/components/admin/Welcome#Welcome'] },
  },
  i18n: { fallbackLanguage: 'vi', supportedLanguages: { vi } },
  collections: [Users, Packages, Leads, Media],
  globals: [SiteSettings, CatalogContent],
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
    push: process.env.NODE_ENV !== 'production' && process.env.PAYLOAD_DB_PUSH === 'true',
  }),
  sharp,
  upload: { limits: { fileSize: 5 * 1024 * 1024 }, abortOnLimit: true },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
