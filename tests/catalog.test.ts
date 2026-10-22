import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { catalog, catalogGroups } from '../src/data/catalog'

test('contains each package in seccondmove exactly once, with its listed price', () => {
  const source = readFileSync(new URL('../seccondmove.md', import.meta.url), 'utf8').replaceAll('\\_', '_')
  const rows = [...source.matchAll(/\n((?:NETVT|MESHVT|GIGA)[A-Z0-9_]+?)(?:300\s*Mbps|350\s*Mbps|500\s*Mbps|1Gbps)[\s\S]*?(\d{3})\.000đ\/tháng/g)]
  assert.equal(rows.length, 18)
  assert.equal(catalog.length, rows.length)
  assert.equal(new Set(catalog.map((entry) => entry.slug)).size, rows.length)
  for (const [, name, price] of rows) {
    assert.equal(catalog.find((entry) => entry.name === name)?.price, Number(price) * 1000, name)
  }
  assert.deepEqual(catalogGroups.map((group) => catalog.filter((entry) => entry.group === group.id).length), [2, 3, 3, 4, 2, 4])
})
