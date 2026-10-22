import { test } from 'node:test'
import assert from 'node:assert/strict'
import { activeContacts, contactZaloUrl, normalizePhone, validZaloUrl } from '../src/lib/contacts'

test('uses the selected phone or that contact’s explicit Zalo link', () => {
  assert.equal(contactZaloUrl({ name: 'A', phone: '+84 912 345 678' }), 'https://zalo.me/0912345678')
  assert.equal(contactZaloUrl({ name: 'B', phone: '0987654321', zaloUrl: 'https://zalo.me/0987000000' }), 'https://zalo.me/0987000000')
  assert.equal(normalizePhone('+84 912 345 678'), '0912345678')
})

test('rejects unsafe URLs and does not offer Zalo for disabled contacts or landlines', () => {
  for (const url of ['javascript:alert(1)', 'https://zalo.me.evil.test/0912345678', 'http://zalo.me/0912345678', 'https://user:pass@zalo.me/123', 'https://zalo.me/']) {
    assert.equal(validZaloUrl(url), false)
  }
  assert.equal(contactZaloUrl({ name: 'A', phone: '0912345678', zaloEnabled: false }), null)
  assert.equal(contactZaloUrl({ name: 'B', phone: '02412345678' }), null)
  assert.equal(activeContacts([{ name: 'A', phone: '0912345678', enabled: false }]).length, 0)
})
