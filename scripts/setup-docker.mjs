import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { parseEnv } from 'node:util'

const filename = new URL('../.env', import.meta.url)
let text = existsSync(filename) ? readFileSync(filename, 'utf8') : ''
const values = parseEnv(text)

function set(key, value) {
  const line = `${key}=${value}`
  const expression = new RegExp(`^${key}=.*$`, 'm')
  text = expression.test(text) ? text.replace(expression, () => line) : `${text.trimEnd()}\n${line}\n`
  values[key] = value
}

for (const [key, fallback] of Object.entries({
  POSTGRES_USER: 'viettel',
  POSTGRES_DB: 'viettel_sale_web',
  POSTGRES_PORT: '5432',
  APP_PORT: '3000',
})) {
  if (!values[key]) set(key, fallback)
}

if (!values.POSTGRES_PASSWORD || values.POSTGRES_PASSWORD.startsWith('replace-')) {
  set('POSTGRES_PASSWORD', randomBytes(24).toString('hex'))
}
// Compose interpolates the password into a connection URI.
if (!/^[A-Za-z0-9_-]+$/.test(values.POSTGRES_PASSWORD)) {
  throw new Error('POSTGRES_PASSWORD must use URI-safe letters, numbers, _ or -. Existing .env has not been written.')
}
for (const key of ['POSTGRES_USER', 'POSTGRES_DB']) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(values[key])) throw new Error(`Invalid ${key}; use a simple database identifier.`)
}
for (const key of ['POSTGRES_PORT', 'APP_PORT']) {
  if (!/^\d+$/.test(values[key]) || Number(values[key]) < 1 || Number(values[key]) > 65535) throw new Error(`Invalid ${key}.`)
}
if (!values.PAYLOAD_SECRET || values.PAYLOAD_SECRET.startsWith('replace-')) {
  set('PAYLOAD_SECRET', randomBytes(48).toString('hex'))
}
if (values.PAYLOAD_SECRET.length < 32) throw new Error('PAYLOAD_SECRET must have at least 32 characters.')
if (!values.NEXT_PUBLIC_SERVER_URL) set('NEXT_PUBLIC_SERVER_URL', `http://localhost:${values.APP_PORT}`)

// Preserve a custom database URL. Replace only the original scaffold's placeholder.
if (!values.DATABASE_URL || values.DATABASE_URL === 'postgresql://postgres:postgres@localhost:5432/viettel_sale_web') {
  set('DATABASE_URL', `postgresql://${values.POSTGRES_USER}:${values.POSTGRES_PASSWORD}@localhost:${values.POSTGRES_PORT}/${values.POSTGRES_DB}`)
}
// Use migrations consistently when local code and Docker share the same database.
set('PAYLOAD_DB_PUSH', 'false')
// Leave the account identity and password to the operator; never create a known default.
for (const key of ['BOOTSTRAP_ADMIN_EMAIL', 'BOOTSTRAP_ADMIN_PASSWORD', 'BOOTSTRAP_ADMIN_NAME']) {
  if (!(key in values)) set(key, '')
}
writeFileSync(filename, text.trimStart(), { mode: 0o600 })
console.log('Docker environment prepared in .env. Existing secrets preserved; credentials are not printed.')
console.log('For a new database, set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD in .env before starting Docker.')
