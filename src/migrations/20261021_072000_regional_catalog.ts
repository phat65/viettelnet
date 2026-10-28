import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'
import { regionalPrices, detailArticle } from './data/regional-prices-v2'
import { catalog } from './data/showcase-v1'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const entry of catalog) {
    // Read only this migration's historical columns. Future collection fields do not exist yet on a fresh deploy.
    const { rows } = await db.execute<{ id: number; name: string; description: string }>(sql`SELECT id, name, description FROM packages WHERE slug = ${entry.slug}`)
    const item = rows[0]
    if (!item) continue
    const [metro, other] = regionalPrices[entry.slug]
    const prices = [{ region: 'metro', price: metro }, ...(other == null ? [] : [{ region: 'other', price: other }])]
    await db.execute(sql`
      WITH eligible AS (
        SELECT id FROM packages WHERE id = ${item.id}
          AND (SELECT count(*) FROM packages_prices WHERE _parent_id = ${item.id}) = 1
          AND EXISTS (SELECT 1 FROM packages_prices WHERE _parent_id = ${item.id} AND region = 'reference' AND monthly_price = ${entry.price})
      ), removed AS (
        DELETE FROM packages_prices WHERE _parent_id IN (SELECT id FROM eligible) RETURNING id
      ), inserted AS (
        INSERT INTO packages_prices (_order, _parent_id, id, region, monthly_price, activation_fee, installation_fee)
        SELECT price.ordinality, eligible.id, ${`regional-v2-${entry.slug}-`} || (price.value->>'region'),
          (price.value->>'region')::enum_packages_prices_region, (price.value->>'price')::numeric,
          ${entry.slug === 'netvt1' ? 300000 : null}::numeric, ${entry.slug === 'netvt1' ? 0 : null}::numeric
        FROM eligible, jsonb_array_elements(${JSON.stringify(prices)}::jsonb) WITH ORDINALITY AS price(value, ordinality)
      )
      UPDATE packages SET conditions = 'Giá và ưu đãi áp dụng được xác nhận theo địa chỉ lắp đặt, hạ tầng và thời điểm đăng ký. Tốc độ trải nghiệm phụ thuộc thiết bị và vùng phủ WiFi.'
      WHERE id IN (SELECT id FROM eligible)
    `)
    await db.execute(sql`UPDATE packages SET detail_content = ${JSON.stringify(detailArticle(item.name, item.description))}::jsonb WHERE id = ${item.id} AND detail_content IS NULL`)
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  throw new Error('Regional prices and articles may have been edited. Use a forward migration to preserve administrator changes.')
}
