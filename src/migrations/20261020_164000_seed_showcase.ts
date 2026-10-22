import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'
import { catalog, catalogConditions } from './data/showcase-v1'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Separate migration: PostgreSQL must commit the new enum value before using it.
  for (const [index, entry] of catalog.entries()) {
    // Use this migration's columns, not the evolving collection schema. Each package
    // and its children are inserted atomically; existing installations skip this seed.
    await db.execute(sql`
      WITH new_package AS (
        INSERT INTO packages (name, slug, catalog_group, category, speed, description, conditions, seo_title, seo_description, sort_order, status)
        VALUES (${entry.name}, ${entry.slug}, ${entry.group}, ${entry.category}, ${entry.speed}, ${entry.description}, ${catalogConditions},
          ${`${entry.name} — Internet ${entry.speed >= 1000 ? '1Gbps' : `${entry.speed}Mbps`}`}, ${entry.description.slice(0, 175)}, ${index}, 'published')
        ON CONFLICT (slug) DO NOTHING RETURNING id
      ), new_prices AS (
        INSERT INTO packages_prices (_order, _parent_id, id, region, monthly_price)
        SELECT 1, id, ${`${entry.slug}-reference`}, 'reference', ${entry.price} FROM new_package
      )
      INSERT INTO packages_equipment (_order, _parent_id, id, name)
      SELECT equipment.ordinality, new_package.id, ${entry.slug} || '-equipment-' || equipment.ordinality, equipment.name
      FROM new_package, jsonb_array_elements_text(${JSON.stringify(entry.equipment)}::jsonb) WITH ORDINALITY AS equipment(name, ordinality)
    `)
  }

  // Keep the old single contact when upgrading an installation that has one.
  const settings = await payload.findGlobal({ slug: 'site-settings', req, overrideAccess: true })
  if (!settings.contacts?.length && settings.hotline) {
    const phone = settings.hotline.replace(/[\s().-]/g, '').replace(/^\+?84(?=\d{9,10}$)/, '0')
    if (/^(0\d{9,10}|1[89]00\d{4,6})$/.test(phone)) {
      await payload.updateGlobal({
        slug: 'site-settings', req, overrideAccess: true,
        data: { contacts: [{ name: 'Tư vấn lắp đặt', phone, zaloUrl: settings.zaloUrl, zaloEnabled: true, enabled: true }] },
      })
    }
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  throw new Error('Catalog packages may have registrations. Use a reviewed forward migration instead of deleting them.')
}
