import { test } from 'node:test'
import assert from 'node:assert/strict'
import { consultationSchema } from '../src/lib/validation'
import provinces from '../src/data/locations/provinces.json'
import { getWards, resolveLocation } from '../src/lib/locations'

const valid = { name: 'Khách thử', phone: '+84 912 345 678', addressLine: '12 Nguyễn Văn Linh', provinceCode: '1', wardCode: getWards('1')[0].code, packageId: '12', customerNote: '' }

test('normalizes phone and parses package ID', () => {
  const value = consultationSchema.parse(valid)
  assert.equal(value.phone, '0912345678')
  assert.equal(value.packageId, 12)
})

test('rejects malformed phone, address, location and package IDs', () => {
  for (const change of [{ phone: 'abc' }, { addressLine: ' ' }, { provinceCode: '99' }, { provinceCode: '__proto__' }, { provinceCode: 'constructor' }, { wardCode: '99999' }, { wardCode: getWards('48')[0].code }, { packageId: '-1' }, { packageId: '1.5' }, { packageId: '9'.repeat(30) }]) {
    assert.equal(consultationSchema.safeParse({ ...valid, ...change }).success, false)
  }
})

test('allows general inquiries and strips client-supplied privileged fields', () => {
  const value = consultationSchema.parse({ ...valid, packageId: '', status: 'completed', internalNote: 'override', region: 'metro', provinceName: 'Fake province', wardName: 'Fake ward' })
  assert.equal(value.packageId, undefined)
  assert.equal('status' in value, false)
  assert.equal('internalNote' in value, false)
  assert.equal('region' in value, false)
  assert.equal('provinceName' in value, false)
  assert.equal('wardName' in value, false)
})

test('every province has unique wards that resolve to canonical names', () => {
  const codes = new Set<string>()
  assert.ok(provinces.length >= 30)
  for (const province of provinces) {
    assert.ok(getWards(province.code).length > 0)
    for (const ward of getWards(province.code)) {
      assert.equal(codes.has(ward.code), false)
      codes.add(ward.code)
      assert.deepEqual(resolveLocation(province.code, ward.code), { province, ward })
    }
  }
})
