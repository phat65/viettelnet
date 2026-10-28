import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

// Exact variants introduced by the photo catalog, not a wildcard over administrator packages.
export const storagePackageSlugs = [1, 3, 7, 15, 30].flatMap((days) => [
  `camera-trong-nha-cloud-${days}-ngay`,
  `camera-ngoai-troi-cloud-${days}-ngay`,
  `cloud-camera-${days}-ngay`,
])

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const slug of storagePackageSlugs) {
    // Keep the historical package relation if a customer already registered for it.
    await db.execute(sql`UPDATE packages SET status = 'draft', updated_at = now() WHERE slug = ${slug} AND status <> 'draft'`)
    await db.execute(sql`
      DELETE FROM packages WHERE slug = ${slug}
      AND NOT EXISTS (SELECT 1 FROM leads WHERE leads.package_id = packages.id)
    `)
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  throw new Error('Restore a backup or use a forward migration to restore removed storage packages and their administrator content.')
}
