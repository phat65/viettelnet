import { test } from 'node:test'
import assert from 'node:assert/strict'
import { catalog } from '../src/data/catalog'
import { validatePackageSlug, groupFromSlug } from '../src/lib/catalogRoutes'

test('package slugs cannot shadow category pages or inject URL segments', () => {
  for (const entry of catalog) {
    assert.equal(validatePackageSlug(entry.slug), true)
    assert.equal(groupFromSlug(entry.slug), undefined)
  }
  for (const slug of ['tv360', 'camera', 'mesh-wifi', 'ultra-speed', 'uu-dai', 'ca-nhan', 'khu-vuc', '../admin', 'netvt1?x=1', '', null]) {
    assert.equal(typeof validatePackageSlug(slug), 'string')
  }
  assert.equal(validatePackageSlug('goi-gia-dinh-2026'), true)
})
