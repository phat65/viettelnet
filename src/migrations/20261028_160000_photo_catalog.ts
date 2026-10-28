import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'
import { photoCatalog } from './data/photo-catalog-20261028'

// Add the price unit before seeding Camera bundles. Historical monthly amounts keep their meaning.
// SQL intentionally uses this snapshot's columns, independent of future Payload collection fields.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "price_unit" varchar DEFAULT '/tháng';`)
  for (const [index, entry] of photoCatalog.entries()) {
    const { rows } = await db.execute<{ id: number }>(sql`
      INSERT INTO packages (slug, name, catalog_group, category, speed, price_unit, description, conditions, sort_order, status)
      VALUES (${entry.slug}, ${entry.name}, ${entry.catalogGroup}, ${entry.category}, ${entry.speed}, ${entry.priceUnit}, ${entry.description}, ${entry.conditions}, ${100 + index}, 'published')
      ON CONFLICT (slug) DO UPDATE SET speed = EXCLUDED.speed, price_unit = EXCLUDED.price_unit, conditions = EXCLUDED.conditions, updated_at = now()
      RETURNING id
    `)
    const id = rows[0].id
    // Preserve existing equipment, article, SEO, image, status, order and package IDs/lead relations.
    await db.execute(sql`
      INSERT INTO packages_equipment (_order, _parent_id, id, name)
      SELECT equipment.ordinality, ${id}, ${`photo-v3-${entry.slug}-`} || equipment.ordinality, equipment.name
      FROM jsonb_array_elements_text(${JSON.stringify(entry.equipment)}::jsonb) WITH ORDINALITY AS equipment(name, ordinality)
      WHERE NOT EXISTS (SELECT 1 FROM packages_equipment WHERE _parent_id = ${id})
    `)
    for (const price of entry.prices) {
      // Update only price regions included in the supplied sheet; retain additional admin-maintained regions.
      await db.execute(sql`
        WITH updated AS (
          UPDATE packages_prices SET monthly_price = ${price.monthlyPrice},
            activation_fee = COALESCE(${price.activationFee ?? null}::numeric, activation_fee),
            installation_fee = COALESCE(${price.installationFee ?? null}::numeric, installation_fee)
          WHERE _parent_id = ${id} AND region = ${price.region} RETURNING id
        )
        INSERT INTO packages_prices (_order, _parent_id, id, region, monthly_price, activation_fee, installation_fee)
        SELECT (SELECT COALESCE(MAX(_order), 0) + 1 FROM packages_prices WHERE _parent_id = ${id}), ${id}, ${`photo-v3-${entry.slug}-${price.region}`}, ${price.region}::enum_packages_prices_region, ${price.monthlyPrice}, ${price.activationFee ?? null}::numeric, ${price.installationFee ?? null}::numeric
        WHERE NOT EXISTS (SELECT 1 FROM updated)
      `)
    }
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  throw new Error('Photo catalog may have leads and administrator edits. Restore a backup or use a forward migration; do not delete packages or their price units.')
}
