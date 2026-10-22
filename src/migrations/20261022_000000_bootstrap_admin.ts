import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { z } from 'zod'

export function bootstrapAdminCredentials(env: Record<string, string | undefined>) {
  const email = z.email().safeParse(env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase())
  const password = env.BOOTSTRAP_ADMIN_PASSWORD || ''
  const name = env.BOOTSTRAP_ADMIN_NAME?.trim() || 'Quản trị viên'
  if (!email.success) throw new Error('Empty users table: set BOOTSTRAP_ADMIN_EMAIL to a valid email before running migrations.')
  if (password.length < 16 || password.length > 128 || !password.trim() || /^(replace-|change-me|your-password|example-password)/i.test(password)) {
    throw new Error('Empty users table: set BOOTSTRAP_ADMIN_PASSWORD to a unique password of 16–128 characters, not a placeholder.')
  }
  if (name.length > 100) throw new Error('BOOTSTRAP_ADMIN_NAME must be at most 100 characters.')
  return { email: email.data, password, name }
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // Existing installations keep every account and password, even if bootstrap env changes.
  const { totalDocs } = await payload.count({ collection: 'users', overrideAccess: true, req })
  if (totalDocs > 0) {
    payload.logger.info('Admin bootstrap skipped: an administrator already exists.')
    return
  }

  const data = bootstrapAdminCredentials(process.env)
  // Payload hashes the password; passing req keeps the write inside the migration transaction.
  await payload.create({ collection: 'users', overrideAccess: true, req, data })
  payload.logger.info('Initial administrator created. Credentials were not logged.')
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  throw new Error('Admin bootstrap cannot be rolled back by deleting accounts. Manage users through the admin panel.')
}
