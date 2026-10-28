import assert from 'node:assert/strict'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { up } from '../src/migrations/20261028_160000_photo_catalog'
import { photoCatalog } from '../src/migrations/data/photo-catalog-20261028'
import { up as removeStorage, storagePackageSlugs } from '../src/migrations/20261028_234000_remove_storage_packages'

if (process.env.CATALOG_TEST_MODE !== '1' || new URL(process.env.DATABASE_URL!).pathname !== '/viettel_catalog_test' || new URL(process.env.DATABASE_URL!).port !== '5434') {
  throw new Error('Catalog verification requires the isolated viettel_catalog_test database on port 5434.')
}
const payload = await getPayload({ config })
try {
  const result = await payload.find({ collection: 'packages', pagination: false, depth: 0, overrideAccess: true })
  assert.equal(result.docs.length, 21)
  assert.ok(result.docs.every((item) => !storagePackageSlugs.includes(item.slug)))
  for (const entry of photoCatalog.filter((item) => !storagePackageSlugs.includes(item.slug))) {
    const actual = result.docs.find((item) => item.slug === entry.slug)!
    assert.ok(actual, entry.slug)
    assert.equal(actual.priceUnit, entry.priceUnit)
    for (const price of entry.prices) {
      const row = actual.prices.find((item) => item.region === price.region)!
      assert.equal(row.monthlyPrice, price.monthlyPrice, `${entry.slug}:${price.region}`)
      if (price.activationFee != null) assert.equal(row.activationFee, price.activationFee)
    }
  }
  const original = result.docs.find((item) => item.slug === 'giga2')!
  const amended = await payload.update({ collection: 'packages', id: original.id, overrideAccess: true, data: {
    name: 'GIGA2 admin edit', status: 'draft', seoTitle: 'Custom SEO',
    prices: [...original.prices, { region: 'other', monthlyPrice: 300000 }],
  } })
  const lead = await payload.create({ collection: 'leads', overrideAccess: true, data: { phone: '0912345678', area: 'Migration test only', package: original.id, status: 'new' } })
  await up({ db: payload.db.drizzle } as Parameters<typeof up>[0])
  await up({ db: payload.db.drizzle } as Parameters<typeof up>[0])
  const storage = (await payload.find({ collection: 'packages', where: { slug: { equals: storagePackageSlugs[0] } }, depth: 0 })).docs[0]
  const storageLead = await payload.create({ collection: 'leads', overrideAccess: true, data: { phone: '0912345678', area: 'Storage removal test only', package: storage.id, status: 'new' } })
  await removeStorage({ db: payload.db.drizzle } as Parameters<typeof removeStorage>[0])
  await removeStorage({ db: payload.db.drizzle } as Parameters<typeof removeStorage>[0])
  assert.equal((await payload.findByID({ collection: 'packages', id: storage.id })).status, 'draft')
  assert.equal((await payload.findByID({ collection: 'leads', id: storageLead.id, depth: 0 })).package, storage.id)
  assert.equal((await payload.count({ collection: 'packages' })).totalDocs, 22)
  await payload.delete({ collection: 'leads', id: storageLead.id })
  await removeStorage({ db: payload.db.drizzle } as Parameters<typeof removeStorage>[0])
  const after = await payload.findByID({ collection: 'packages', id: original.id, depth: 0, overrideAccess: true })
  assert.equal(after.name, amended.name)
  assert.equal(after.seoTitle, 'Custom SEO')
  assert.equal(after.status, 'draft')
  assert.equal(after.prices.find((price) => price.region === 'other')?.monthlyPrice, 300000)
  assert.deepEqual(after.equipment, original.equipment)
  assert.deepEqual(after.detailContent, original.detailContent)
  assert.equal((await payload.findByID({ collection: 'leads', id: lead.id, depth: 0 })).package, original.id)
  assert.equal((await payload.count({ collection: 'packages' })).totalDocs, 21)
  await payload.update({ collection: 'packages', id: original.id, data: { name: original.name, status: original.status, seoTitle: original.seoTitle, prices: original.prices } })
  await payload.delete({ collection: 'leads', id: lead.id })
  console.log('PASS: 21 packages; 15 storage variants removed; rerun is safe; custom prices, content and lead relations preserved.')
} finally {
  await payload.destroy()
}
process.exit(0)
