import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { MigrateUpArgs } from '@payloadcms/db-postgres'
import { bootstrapAdminCredentials, up, down } from '../src/migrations/20261022_000000_bootstrap_admin'

const valid = { BOOTSTRAP_ADMIN_EMAIL: ' Owner@Example.test ', BOOTSTRAP_ADMIN_PASSWORD: 'Test-only-long-password-42!', BOOTSTRAP_ADMIN_NAME: ' Chủ website ' }

test('bootstrap validates credentials without leaking their values in errors', () => {
  assert.deepEqual(bootstrapAdminCredentials(valid), { email: 'owner@example.test', password: valid.BOOTSTRAP_ADMIN_PASSWORD, name: 'Chủ website' })
  for (const change of [{ BOOTSTRAP_ADMIN_EMAIL: '' }, { BOOTSTRAP_ADMIN_EMAIL: 'invalid' }, { BOOTSTRAP_ADMIN_PASSWORD: '' }, { BOOTSTRAP_ADMIN_PASSWORD: 'short-secret' }, { BOOTSTRAP_ADMIN_PASSWORD: ' '.repeat(20) }, { BOOTSTRAP_ADMIN_PASSWORD: 'replace-with-a-password' }, { BOOTSTRAP_ADMIN_PASSWORD: 'x'.repeat(129) }]) {
    assert.throws(() => bootstrapAdminCredentials({ ...valid, ...change }), error => {
      assert.ok(error instanceof Error)
      assert.equal(error.message.includes(valid.BOOTSTRAP_ADMIN_PASSWORD), false)
      return true
    })
  }
})

test('an existing admin is preserved without reading bootstrap credentials or creating accounts', async () => {
  const req = { transactionID: 'migration-test' }
  let creates = 0
  const payload = {
    count: async (args: { req: unknown }) => { assert.equal(args.req, req); return { totalDocs: 1 } },
    create: async () => { creates++ },
    logger: { info: () => {} },
  }
  await up({ payload, req } as unknown as MigrateUpArgs)
  assert.equal(creates, 0)
})

test('empty database uses Payload password handling and the migration transaction', async () => {
  const original = Object.fromEntries(Object.keys(valid).map(key => [key, process.env[key]]))
  const req = { transactionID: 'migration-test' }
  const writes: unknown[] = []
  const payload = { count: async () => ({ totalDocs: 0 }), create: async (args: unknown) => { writes.push(args) }, logger: { info: () => {} } }
  try {
    Object.assign(process.env, valid)
    await up({ payload, req } as unknown as MigrateUpArgs)
    assert.deepEqual(writes, [{ collection: 'users', overrideAccess: true, req, data: bootstrapAdminCredentials(valid) }])
    process.env.BOOTSTRAP_ADMIN_PASSWORD = ''
    await assert.rejects(up({ payload, req } as unknown as MigrateUpArgs), /BOOTSTRAP_ADMIN_PASSWORD/)
    assert.equal(writes.length, 1)
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
})

test('rollback refuses to delete administrator accounts', async () => {
  await assert.rejects(down({} as Parameters<typeof down>[0]), /cannot be rolled back/)
})
