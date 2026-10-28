import { test } from 'node:test'
import assert from 'node:assert/strict'
import provinces from '../src/data/locations/provinces.json'
import { internetProvinces, provinceFromSlug, provincePath } from '../src/lib/provinces'
import { packagePrice } from '../src/lib/packagePresentation'
import type { Package } from '../src/payload-types'

test('every registration province has a unique public URL; only Hanoi and HCMC use metro pricing', () => {
  assert.equal(internetProvinces.length, provinces.length)
  assert.equal(new Set(internetProvinces.map((province) => province.slug)).size, provinces.length)
  assert.deepEqual(internetProvinces.filter((province) => province.region === 'metro').map((province) => province.slug), ['ha-noi', 'ho-chi-minh'])
  for (const province of internetProvinces) {
    assert.match(province.slug, /^[a-z]+(?:-[a-z]+)*$/)
    assert.equal(provincePath(province.slug), `/internet/khu-vuc/${province.slug}`)
    assert.ok(provinces.some((entry) => entry.code === province.code))
    if (!['1', '79'].includes(province.code)) assert.equal(province.region, 'other')
  }
  for (const slug of ['da-nang', 'dak-lak', 'can-tho']) assert.ok(provinceFromSlug(slug))
  for (const slug of ['metro', 'other', 'khong-ton-tai', '../admin', undefined]) assert.equal(provinceFromSlug(slug), undefined)
})

test('province pricing keeps local fees and never substitutes a metro price for a missing other price', () => {
  const item: Package = {
    id: 1, name: 'Test', slug: 'test', catalogGroup: 'individual', category: 'internet', speed: 300,
    description: 'Test', conditions: '', status: 'published', createdAt: '', updatedAt: '',
    prices: [{ region: 'metro', monthlyPrice: 235000, installationFee: 0 }, { region: 'other', monthlyPrice: 195000, activationFee: 300000 }],
  }
  for (const slug of ['ha-noi', 'ho-chi-minh']) assert.equal(packagePrice(item, provinceFromSlug(slug)!.region)?.monthlyPrice, 235000)
  const localPrice = packagePrice(item, provinceFromSlug('da-nang')!.region)
  assert.equal(localPrice?.monthlyPrice, 195000)
  assert.equal(localPrice?.activationFee, 300000)
  item.prices = [item.prices[0]]
  assert.equal(packagePrice(item, provinceFromSlug('da-nang')!.region), undefined)
  item.prices.push({ region: 'reference', monthlyPrice: 200000 })
  assert.equal(packagePrice(item, provinceFromSlug('da-nang')!.region)?.region, 'reference')
  assert.equal(packagePrice(item, provinceFromSlug('ha-noi')!.region)?.monthlyPrice, 235000)
})
