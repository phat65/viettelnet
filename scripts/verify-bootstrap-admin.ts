import assert from 'node:assert/strict'
import { getPayload } from 'payload'
import { sql } from '@payloadcms/db-postgres'
import config from '../src/payload.config'

// This verifier is only run in the disposable migration test database.
if (process.env.BOOTSTRAP_TEST_MODE !== '1' || new URL(process.env.DATABASE_URL!).pathname !== '/viettel_bootstrap_test') {
  throw new Error('Bootstrap verification requires the isolated viettel_bootstrap_test database.')
}
const payload = await getPayload({ config })
try {
  const empty = process.argv.includes('--empty')
  const users = await payload.count({ collection: 'users', overrideAccess: true })
  assert.equal(users.totalDocs, empty ? 0 : 1)
  const migrations = await payload.db.execute({ drizzle: payload.db.drizzle, sql: sql`SELECT count(*)::int AS count FROM payload_migrations WHERE name = '20261022_000000_bootstrap_admin'` })
  assert.equal(migrations.rows[0].count, empty ? 0 : 1)
  if (!empty) {
    const credentials = { email: process.env.BOOTSTRAP_ADMIN_EMAIL!, password: process.env.BOOTSTRAP_ADMIN_PASSWORD! }
    const { rows } = await payload.db.execute({ drizzle: payload.db.drizzle, sql: sql`SELECT email, salt, hash FROM users` })
    assert.equal(rows[0].email, credentials.email.toLowerCase())
    assert.ok(rows[0].salt?.length > 0 && rows[0].hash?.length > 0)
    assert.notEqual(rows[0].hash, credentials.password)
    const login = await payload.login({ collection: 'users', data: credentials })
    assert.ok(login.token)
    // Never log the user object, token, password, hash or salt.
  }
  console.log(empty ? 'PASS: no account and no completed seed after failed bootstrap.' : 'PASS: one admin, hashed password, successful login and recorded migration.')
} finally {
  await payload.destroy()
}
// Payload imports can retain background handles after closing the database pool.
// Only exit successfully after every assertion and cleanup has completed.
process.exit(0)
