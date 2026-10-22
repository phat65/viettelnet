import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { regionalPrices, detailArticle } from './data/regional-prices-v2'
import { catalog } from './data/showcase-v1'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const entry of catalog) {
    const { docs } = await payload.find({ collection: 'packages', req, overrideAccess: true, depth: 0, limit: 1, where: { slug: { equals: entry.slug } } })
    const item = docs[0]
    if (!item) continue
    const data: Record<string, unknown> = {}
    // Only replace untouched introductory prices; preserve any manually maintained prices.
    if (item.prices.length === 1 && item.prices[0].region === 'reference' && item.prices[0].monthlyPrice === entry.price) {
      const [metro, other] = regionalPrices[entry.slug]
      const fees = entry.slug === 'netvt1' ? { activationFee: 300000, installationFee: 0 } : {}
      data.prices = [{ region: 'metro', monthlyPrice: metro, ...fees }, ...(other == null ? [] : [{ region: 'other', monthlyPrice: other, ...fees }])]
      data.conditions = 'Giá và ưu đãi áp dụng được xác nhận theo địa chỉ lắp đặt, hạ tầng và thời điểm đăng ký. Tốc độ trải nghiệm phụ thuộc thiết bị và vùng phủ WiFi.'
    }
    if (!item.detailContent) data.detailContent = detailArticle(item.name, item.description)
    if (Object.keys(data).length) await payload.update({ collection: 'packages', id: item.id, req, overrideAccess: true, data })
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  throw new Error('Regional prices and articles may have been edited. Use a forward migration to preserve administrator changes.')
}
