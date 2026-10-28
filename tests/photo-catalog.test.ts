import { test } from 'node:test'
import assert from 'node:assert/strict'
import { photoCatalog } from '../src/migrations/data/photo-catalog-20261028'
import { catalog } from '../src/migrations/data/showcase-v1'
import { packagePriceUnit } from '../src/lib/packagePresentation'

test('photo catalog contains 18 additions and keeps device bundles separate from monthly subscriptions', () => {
  assert.equal(photoCatalog.length, 26)
  assert.equal(new Set(photoCatalog.map((item) => item.slug)).size, 26)
  assert.equal(photoCatalog.filter((item) => !catalog.some((old) => old.slug === item.slug)).length, 18)
  const bundles = photoCatalog.filter((item) => item.priceUnit === '/bộ')
  assert.equal(bundles.length, 10)
  for (const item of bundles) {
    assert.equal(item.speed, 0)
    assert.ok(item.equipment.some((equipment) => equipment.startsWith('12 tháng Cloud')))
    assert.equal(item.prices.length, 2)
    assert.equal(item.prices[0].monthlyPrice, item.prices[1].monthlyPrice)
  }
  assert.equal(packagePriceUnit({}), '/tháng')
  assert.equal(packagePriceUnit(bundles[0]), '/bộ')
  assert.equal(photoCatalog.filter((item) => item.priceUnit === '/tháng/camera').length, 5)
})

test('prices, connection fees, storage periods and business capabilities match the supplied sheets', () => {
  const find = (slug: string) => photoCatalog.find((item) => item.slug === slug)!
  assert.deepEqual(find('netvt1-cam1').prices.map((price) => price.monthlyPrice), [240000, 200000])
  assert.deepEqual(find('meshvt3-cam1').prices.map((price) => price.monthlyPrice), [379000, 319000])
  assert.equal(find('gigapro1').prices[0].monthlyPrice, 500000)
  assert.equal(find('gigavip1').prices[0].monthlyPrice, 1300000)
  assert.ok(find('gigavip1').equipment.includes('1 IP tĩnh'))
  for (const [index, price] of [320000, 355000, 390000, 425000].entries()) {
    assert.deepEqual(find(`giga${index + 1}`).prices, [{ region: 'metro', monthlyPrice: price, activationFee: 500000 }])
  }
  for (const [days, indoor, outdoor, monthly, fee] of [
    [1, 580000, 780000, 20000, 300000], [3, 700000, 900000, 30000, 300000],
    [7, 820000, 1020000, 40000, 300000], [15, 1060000, 1260000, 60000, 180000], [30, 1420000, 1620000, 90000, 180000],
  ]) {
    assert.equal(find(`camera-trong-nha-cloud-${days}-ngay`).prices[0].monthlyPrice, indoor)
    assert.equal(find(`camera-ngoai-troi-cloud-${days}-ngay`).prices[0].monthlyPrice, outdoor)
    assert.equal(find(`cloud-camera-${days}-ngay`).prices[0].monthlyPrice, monthly)
    assert.equal(find(`cloud-camera-${days}-ngay`).prices[0].activationFee, fee)
  }
})
