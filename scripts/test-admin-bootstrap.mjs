import { spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'

const project = `viettel-bootstrap-test-${Date.now()}`
const args = ['compose', '-p', project, '-f', 'compose.yaml', '-f', 'compose.migration-test.yaml']
const base = {
  ...process.env,
  POSTGRES_USER: 'bootstrap_test', POSTGRES_DB: 'viettel_bootstrap_test',
  POSTGRES_PASSWORD: randomBytes(24).toString('hex'), PAYLOAD_SECRET: randomBytes(48).toString('hex'),
  TEST_BOOTSTRAP_ADMIN_EMAIL: 'bootstrap-test@example.test', TEST_BOOTSTRAP_ADMIN_PASSWORD: randomBytes(24).toString('hex'),
}
function run(command, env = base, shouldSucceed = true) {
  const result = spawnSync('docker', [...args, ...command], { env, encoding: 'utf8', maxBuffer: 5 * 1024 * 1024, windowsHide: true, timeout: 120_000 })
  if (result.error) throw result.error
  // Redact test credentials too, including in an unexpected underlying error.
  const secrets = [base.POSTGRES_PASSWORD, base.PAYLOAD_SECRET, base.TEST_BOOTSTRAP_ADMIN_PASSWORD, env.TEST_BOOTSTRAP_ADMIN_PASSWORD].filter(Boolean)
  let output = `${result.stdout || ''}\n${result.stderr || ''}`
  for (const secret of secrets) output = output.replaceAll(secret, '[redacted]')
  if ((result.status === 0) !== shouldSucceed) throw new Error(`Unexpected Docker exit ${result.status}:\n${output}`)
  return output
}
function verify(empty = false) {
  const output = run(['run', '--rm', '-T', '--no-deps', '-e', 'BOOTSTRAP_TEST_MODE=1', 'migrate', 'pnpm', 'exec', 'tsx', 'scripts/verify-bootstrap-admin.ts', ...(empty ? ['--empty'] : [])])
  console.log(output.split('\n').filter(line => line.startsWith('PASS:')).join('\n'))
}
console.log(`Testing bootstrap in isolated project ${project}; main volumes are not used.`)
try {
  run(['up', '-d', '--wait', 'postgres'])
  const missing = run(['run', '--rm', '-T', '--no-deps', 'migrate'], { ...base, TEST_BOOTSTRAP_ADMIN_EMAIL: '', TEST_BOOTSTRAP_ADMIN_PASSWORD: '' }, false)
  if (!missing.includes('BOOTSTRAP_ADMIN_EMAIL')) throw new Error('Missing credentials failed for an unexpected reason.')
  verify(true)
  const weak = run(['run', '--rm', '-T', '--no-deps', 'migrate'], { ...base, TEST_BOOTSTRAP_ADMIN_PASSWORD: 'short' }, false)
  if (!weak.includes('BOOTSTRAP_ADMIN_PASSWORD')) throw new Error('Weak password failed for an unexpected reason.')
  verify(true)
  run(['run', '--rm', '-T', '--no-deps', 'migrate'])
  verify()
  run(['run', '--rm', '-T', '--no-deps', 'migrate'], { ...base, TEST_BOOTSTRAP_ADMIN_EMAIL: 'changed@example.test', TEST_BOOTSTRAP_ADMIN_PASSWORD: randomBytes(24).toString('hex') })
  verify()
  console.log('PASS: migrations reject missing/weak credentials, seed once and preserve the original login on rerun.')
} finally {
  run(['down'])
  console.log(`Stopped ${project}. Its test volume is retained; production volumes are untouched.`)
}
