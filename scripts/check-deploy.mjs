import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'
import { z } from 'zod'

if (existsSync('.env')) loadEnvFile('.env')

// Checks configuration only; never print secrets or claim that hosting is verified.
const checks = []
function check(name, valid) { checks.push({ name, valid: Boolean(valid) }) }
let publicURL
try { publicURL = new URL(process.env.NEXT_PUBLIC_SERVER_URL || '') } catch {}
check('NEXT_PUBLIC_SERVER_URL is an HTTPS domain (not localhost)',
  publicURL?.protocol === 'https:' && publicURL.hostname.includes('.') &&
  !['localhost', '127.0.0.1', '0.0.0.0'].includes(publicURL.hostname) &&
  !publicURL.hostname.endsWith('.localhost'))
check('Public URL has no path, credentials, query or fragment',
  publicURL && publicURL.pathname === '/' && !publicURL.username && !publicURL.password && !publicURL.search && !publicURL.hash)
check('PAYLOAD_SERVER_URL matches the public origin when configured',
  !process.env.PAYLOAD_SERVER_URL || process.env.PAYLOAD_SERVER_URL.replace(/\/$/, '') === publicURL?.origin)
check('PAYLOAD_SECRET has at least 32 characters and is not a placeholder',
  process.env.PAYLOAD_SECRET?.length >= 32 && !/replace-|placeholder/i.test(process.env.PAYLOAD_SECRET))
check('POSTGRES_PASSWORD is non-placeholder, URI-safe and at least 24 characters',
  /^[A-Za-z0-9_-]{24,}$/.test(process.env.POSTGRES_PASSWORD || '') && !/replace-|password/i.test(process.env.POSTGRES_PASSWORD))
check('Schema push is disabled', process.env.PAYLOAD_DB_PUSH === 'false')
for (const key of ['POSTGRES_USER', 'POSTGRES_DB']) {
  check(`${key} is set to a valid database identifier`, /^[A-Za-z_][A-Za-z0-9_]*$/.test(process.env[key] || ''))
}
if (process.argv.includes('--first-deploy')) {
  check('Initial admin email is valid', z.email().safeParse(process.env.BOOTSTRAP_ADMIN_EMAIL?.trim()).success)
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD || ''
  check('Initial admin password is 8–128 characters and not a placeholder',
    password.length >= 8 && password.length <= 128 && password.trim() && !/^(replace-|change-me|your-password|example-password)/i.test(password))
  check('Initial admin name is at most 100 characters', (process.env.BOOTSTRAP_ADMIN_NAME?.trim().length || 0) <= 100)
}
for (const { name, valid } of checks) console.log(`${valid ? 'PASS' : 'FAIL'} ${name}`)
console.log('Also verify HTTPS/proxy, seeded admin login, backups and restore, request limits, contacts, and email recovery on the deployment host.')
if (checks.some(({ valid }) => !valid)) process.exitCode = 1
