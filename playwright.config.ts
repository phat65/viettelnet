import { defineConfig } from '@playwright/test'
import { loadEnvFile } from 'node:process'

loadEnvFile('.env')
// Matches the dedicated Compose test stack; never point fixtures at the app's database.
const database = new URL(process.env.DATABASE_URL!)
database.hostname = '127.0.0.1'
database.port = '5434'
process.env.DATABASE_URL = database.toString()
process.env.PAYLOAD_DB_PUSH = 'false'
process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3100'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3100',
    browserName: 'chromium',
    channel: process.platform === 'win32' ? 'msedge' : undefined,
    headless: true,
    viewport: { width: 1440, height: 1000 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
})
