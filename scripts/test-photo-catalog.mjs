import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { appendFileSync, writeFileSync } from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'

const container = `viettel-catalog-test-${Date.now()}`
const password = randomBytes(24).toString('hex')
const env = {
  ...process.env, NODE_ENV: 'production', POSTGRES_PASSWORD: password,
  DATABASE_URL: `postgresql://catalog_test:${password}@127.0.0.1:5434/viettel_catalog_test`,
  PAYLOAD_SECRET: randomBytes(48).toString('hex'), PAYLOAD_DB_PUSH: 'false', CATALOG_TEST_MODE: '1',
  NEXT_PUBLIC_SERVER_URL: 'http://localhost:3100', PAYLOAD_SERVER_URL: 'http://localhost:3100',
  BOOTSTRAP_ADMIN_EMAIL: 'catalog-test@example.test', BOOTSTRAP_ADMIN_PASSWORD: randomBytes(24).toString('hex'),
}
const redact = (text) => [password, env.PAYLOAD_SECRET, env.BOOTSTRAP_ADMIN_PASSWORD].reduce((value, secret) => value.replaceAll(secret, '[redacted]'), text)
async function run(command, args, timeout = 180000) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { env, windowsHide: true, timeout, stdio: ['ignore', 'pipe', 'pipe'] })
    let output = ''
    process.stdout.on('data', (data) => { output += data })
    process.stderr.on('data', (data) => { output += data })
    process.on('error', reject)
    process.on('close', (code) => code === 0 ? resolve(redact(output)) : reject(new Error(`${command} exited ${code}:\n${redact(output)}`)))
  })
}
let server
let created = false
try {
  console.log(`Starting isolated PostgreSQL: ${container} (port 5434).`)
  await run('docker', ['run', '--rm', '-d', '--name', container, '-e', 'POSTGRES_USER=catalog_test', '-e', 'POSTGRES_DB=viettel_catalog_test', '-e', 'POSTGRES_PASSWORD', '-p', '127.0.0.1:5434:5432', 'postgres:17-bookworm'])
  created = true
  let ready = false
  for (let attempt = 0; attempt < 30; attempt++) {
    try { await run('docker', ['exec', container, 'pg_isready', '-U', 'catalog_test', '-d', 'viettel_catalog_test'], 5000); ready = true; break } catch { await delay(1000) }
  }
  if (!ready) throw new Error('Isolated PostgreSQL did not become ready.')
  console.log('Running the complete migration chain on an empty database.')
  console.log(await run(process.execPath, ['node_modules/payload/bin.js', 'migrate']))
  console.log('Verifying prices, repeatability and preservation of administrator edits.')
  console.log(await run(process.execPath, ['--import', 'tsx', 'scripts/verify-photo-catalog.ts']))
  console.log('Verifying the migration runner skips completed migrations.')
  console.log(await run(process.execPath, ['node_modules/payload/bin.js', 'migrate']))
  console.log('Starting the test website on port 3100.')
  writeFileSync('catalog-test-server.log', '')
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--webpack', '-p', '3100'], { env: { ...env, NODE_ENV: 'development' }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
  server.stdout.on('data', (data) => appendFileSync('catalog-test-server.log', redact(data.toString())))
  server.stderr.on('data', (data) => appendFileSync('catalog-test-server.log', redact(data.toString())))
  let webReady = false
  for (let attempt = 0; attempt < 90; attempt++) {
    if (server.exitCode != null) throw new Error('Test website exited; see catalog-test-server.log.')
    try { if ((await fetch('http://localhost:3100/api/health', { signal: AbortSignal.timeout(2000) })).ok) { webReady = true; break } } catch {}
    await delay(1000)
  }
  if (!webReady) throw new Error('Test website did not become ready; see catalog-test-server.log.')
  console.log('Running browser checks for the catalog, province flow, pricing and carousel controls.')
  console.log(await run(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', '--timeout=120000'], 1200000))
} finally {
  if (server?.pid) {
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { windowsHide: true, stdio: 'ignore' })
    else server.kill('SIGTERM')
  }
  if (created) await run('docker', ['stop', container], 30000)
  console.log('Stopped the temporary test services; application containers and data were not modified.')
}
