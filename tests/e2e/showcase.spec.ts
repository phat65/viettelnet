import { test, expect } from '@playwright/test'
import { randomBytes } from 'node:crypto'
import { readFileSync } from 'node:fs'
import sharp from 'sharp'
import { getPayload, type Payload } from 'payload'
import config from '../../src/payload.config'
import { catalog } from '../../src/data/catalog'

const provinces: { code: string; name: string }[] = JSON.parse(readFileSync(new URL('../../src/data/locations/provinces.json', import.meta.url), 'utf8'))
const wardCatalog: Record<string, { code: string; name: string }[]> = JSON.parse(readFileSync(new URL('../../src/data/locations/wards.json', import.meta.url), 'utf8'))
const getWards = (code: string) => wardCatalog[code]

test.describe.configure({ mode: 'serial' })
let cms: Payload
let adminID: number
const email = 'showcase-test@example.test'
const password = randomBytes(24).toString('hex')

test.beforeAll(async () => {
  if (new URL(process.env.DATABASE_URL!).port !== '5434') throw new Error('Fixtures require the isolated test PostgreSQL on port 5434.')
  cms = await getPayload({ config })
  const admin = await cms.create({ collection: 'users', data: { email, password, name: 'Showcase test' }, overrideAccess: true })
  adminID = admin.id
  await cms.updateGlobal({
    slug: 'site-settings', overrideAccess: true,
    data: { contacts: [
      { name: 'Tư vấn thử A', phone: '0912345678', enabled: true, zaloEnabled: true },
      { name: 'Tư vấn thử B', phone: '0987654321', zaloUrl: 'https://zalo.me/0987000000', enabled: true, zaloEnabled: true },
      { name: 'Số đã ẩn', phone: '0900000000', enabled: false, zaloEnabled: true },
    ] },
  })
})

test.afterAll(async () => {
  if (!cms) return
  await cms.delete({ collection: 'leads', overrideAccess: true, where: { name: { equals: 'Showcase browser test' } } })
  await cms.delete({ collection: 'packages', overrideAccess: true, where: { slug: { equals: 'browser-test-package' } } })
  await cms.updateGlobal({ slug: 'site-settings', overrideAccess: true, data: { contacts: [] } })
  if (adminID) await cms.delete({ collection: 'users', id: adminID, overrideAccess: true })
  await cms.destroy()
})

test('shows 18 packages, six groups, and a distinct detail page for every package', async ({ page, request }) => {
  await page.goto('/')
  await expect(page.locator('.package-card')).toHaveCount(18)
  await expect(page.locator('.catalog-section')).toHaveCount(6)
  for (const selector of ['.connection-image img', '.mesh-inner img']) {
    const picture = page.locator(selector)
    await picture.scrollIntoViewIfNeeded()
    await expect.poll(() => picture.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: 'test-results/showcase-desktop.png', fullPage: true })
  await page.screenshot({ path: 'test-results/showcase-desktop-top.png' })
  await page.locator('#offers').screenshot({ path: 'test-results/packages-offers.png' })
  await page.locator('#camera').screenshot({ path: 'test-results/packages-camera.png' })
  for (const entry of catalog) {
    const response = await request.get(`/goi-cuoc/${entry.slug}`)
    expect(response.status(), entry.slug).toBe(200)
    expect(await response.text()).toContain(entry.name)
  }
  await page.locator('.package-card').filter({ has: page.getByRole('heading', { name: 'NETVT1', exact: true }) }).getByRole('link', { name: /Khám phá chi tiết/ }).click()
  await expect(page).toHaveURL(/\/goi-cuoc\/netvt1/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gói Internet NETVT1')
  await expect(page.getByText('1 Modem WiFi 6', { exact: true })).toBeVisible()
  expect((await request.get('/goi-cuoc/khong-co-goi-nay')).status()).toBe(404)
})

test('chooses the matching Zalo link and telephone, with keyboard dismissal', async ({ page, context }) => {
  await context.route('https://zalo.me/**', (route) => route.fulfill({ status: 200, body: 'Test contact target' }))
  await page.goto('/')
  await page.locator('.contact-buttons').getByRole('button', { name: /Chat Zalo/ }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('link')).toHaveCount(2)
  await expect(dialog.getByRole('link', { name: /Tư vấn thử A/ })).toHaveAttribute('href', 'https://zalo.me/0912345678')
  const popupEvent = page.waitForEvent('popup')
  await dialog.getByRole('link', { name: /Tư vấn thử B/ }).click()
  const popup = await popupEvent
  await popup.waitForLoadState()
  expect(popup.url()).toBe('https://zalo.me/0987000000')
  await popup.close()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await page.locator('.contact-buttons').getByRole('button', { name: /Gọi tư vấn/ }).click()
  await expect(page.getByRole('dialog').getByRole('link', { name: /Tư vấn thử B/ })).toHaveAttribute('href', 'tel:0987654321')
})

test('each card changes regional price independently and keeps the selection on its detail page', async ({ page }) => {
  await page.goto('/')
  const card = page.locator('.package-card').filter({ has: page.getByRole('heading', { name: 'NETVT1', exact: true }) })
  const secondCard = page.locator('.package-card').filter({ has: page.getByRole('heading', { name: 'NETVT2', exact: true }) })
  await expect(card.locator('.price')).toContainText('195.000')
  await card.getByRole('radio', { name: 'Hà Nội & TP.HCM' }).check()
  await expect(card.locator('.price')).toContainText('235.000')
  await expect(secondCard.locator('.price')).toContainText('240.000')
  await card.getByRole('link', { name: /Khám phá chi tiết/ }).click()
  await expect(page).toHaveURL(/khu-vuc=metro/)
  await expect(page.locator('.price-details')).toContainText('235.000')
  await page.locator('.article-prices').getByRole('radio', { name: 'Tỉnh / thành khác' }).check()
  await expect(page.locator('.price-details')).toContainText('195.000')
  await page.goto('/goi-cuoc/giga1?khu-vuc=other')
  await expect(page.locator('.article-prices')).toContainText('Chưa có giá cho khu vực này')
})

test('a registration is attached to the selected package and visible to admin', async ({ page }) => {
  await page.goto('/goi-cuoc/meshvt1-cam1?khu-vuc=other')
  await expect(page.locator('.consultation-form')).toHaveCount(0)
  await page.getByRole('button', { name: 'Đăng ký gói MESHVT1_CAM1' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.locator('.registration-package')).toContainText('MESHVT1_CAM1')
  await page.getByLabel('Họ tên', { exact: true }).fill('Showcase browser test')
  await page.getByLabel('Số điện thoại *', { exact: true }).fill('0933333333')
  await page.getByRole('combobox', { name: 'Tỉnh / thành phố *', exact: true }).selectOption('48')
  const ward = getWards('48')[0]
  await expect(page.getByRole('combobox', { name: 'Phường / xã *', exact: true })).toBeEnabled()
  await page.getByRole('combobox', { name: 'Phường / xã *', exact: true }).selectOption(ward.code)
  await page.getByLabel('Địa chỉ cụ thể *', { exact: true }).fill('12 Đường thử nghiệm')
  await page.screenshot({ path: 'test-results/registration-desktop.png' })
  await page.getByRole('button', { name: 'Xác nhận', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã nhận đăng ký')
  const leads = await cms.find({ collection: 'leads', overrideAccess: true, depth: 1, where: { name: { equals: 'Showcase browser test' } } })
  expect(leads.totalDocs).toBe(1)
  expect(leads.docs[0].status).toBe('new')
  expect(leads.docs[0].region).toBeNull()
  expect(leads.docs[0].provinceName).toBe(provinces.find(item => item.code === '48')!.name)
  expect(leads.docs[0].wardName).toBe(ward.name)
  expect(leads.docs[0].addressLine).toBe('12 Đường thử nghiệm')
  expect(leads.docs[0].area).toBe(`12 Đường thử nghiệm, ${ward.name}, ${leads.docs[0].provinceName}`)
  const selectedPackage = leads.docs[0].package
  expect(typeof selectedPackage === 'object' && selectedPackage?.slug).toBe('meshvt1-cam1')
})

test('shared registration modal resets package and dependent wards, retries loading and restores focus', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.consultation-form')).toHaveCount(0)
  await expect(page.locator('#tu-van')).toHaveCount(0)
  const trigger = page.getByRole('navigation', { name: 'Điều hướng chính' }).getByRole('button', { name: 'Đăng ký tư vấn' })
  await trigger.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('.registration-package')).toHaveCount(0)
  await expect(dialog.getByRole('radio')).toHaveCount(0)
  await expect(dialog.locator('input[name="packageId"]')).toHaveValue('')
  const province = dialog.getByRole('combobox', { name: 'Tỉnh / thành phố *', exact: true })
  const ward = dialog.getByRole('combobox', { name: 'Phường / xã *', exact: true })
  await expect(ward).toBeDisabled()
  await province.selectOption('1')
  await expect(ward).toBeEnabled()
  await ward.selectOption(getWards('1')[0].code)
  await page.route('**/api/locations/48', route => route.fulfill({ status: 503, body: '{}' }), { times: 1 })
  await province.selectOption('48')
  await expect(ward).toHaveValue('')
  await expect(dialog.getByRole('alert')).toContainText('Chưa tải được phường/xã')
  await expect(dialog.getByRole('button', { name: 'Xác nhận' })).toBeDisabled()
  await dialog.getByRole('button', { name: 'Thử lại' }).click()
  await expect(ward).toBeEnabled()
  await ward.selectOption(getWards('48')[0].code)
  await expect(ward.locator('option')).toHaveCount(getWards('48').length + 1)
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
  const card = page.locator('.package-card').filter({ has: page.getByRole('heading', { name: 'NETVT1', exact: true }) })
  await card.getByRole('button', { name: 'Đăng ký', exact: true }).click()
  await expect(dialog.locator('.registration-package')).toHaveText('Gói quan tâm: NETVT1')
  await expect(province).toHaveValue('')
  await dialog.locator('.registration-actions').getByRole('button', { name: 'Đóng', exact: true }).click()
  await page.locator('.installation-cta').click()
  await expect(dialog.locator('.registration-package')).toHaveCount(0)
  await page.keyboard.press('Escape')
})

test('FAQ expands with the keyboard and mobile registration fits a narrow screen', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.faq-list details')).toHaveCount(8)
  const first = page.locator('.faq-list details').first()
  await first.locator('summary').focus()
  await page.keyboard.press('Enter')
  await expect(first).toHaveAttribute('open', '')
  await expect(first.locator('p')).toBeVisible()
  const illustration = page.locator('.faq-illustration img')
  await illustration.scrollIntoViewIfNeeded()
  await expect.poll(() => illustration.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await page.locator('.faq-section').screenshot({ path: 'test-results/faq-desktop.png' })
  await page.setViewportSize({ width: 320, height: 640 })
  await page.getByRole('button', { name: 'Mở menu gói cước' }).click()
  await page.getByRole('navigation', { name: 'Điều hướng chính' }).getByRole('button', { name: 'Đăng ký tư vấn' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('button', { name: 'Mở menu gói cước' })).toHaveAttribute('aria-expanded', 'false')
  const bounds = await dialog.boundingBox()
  expect(bounds!.x).toBeGreaterThanOrEqual(0)
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320)
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy()
  await page.screenshot({ path: 'test-results/registration-mobile.png' })
  await dialog.locator('.dialog-close').click()
  await expect(dialog).not.toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
})

test('admin creates and edits grouped packages, prices and rich detail; public writes are denied', async ({ page, request }) => {
  const loggedIn = await page.request.post('/api/users/login', { data: { email, password } })
  expect(loggedIn.ok()).toBeTruthy()
  const { token } = await loggedIn.json()
  const headers = { Authorization: `JWT ${token}` }
  const list = await request.get('/api/packages?limit=100', { headers })
  const packages = await list.json()
  expect(packages.totalDocs).toBe(18)
  expect((await request.patch(`/api/packages/${packages.docs[0].id}`, { data: { name: 'Must not change' } })).status()).toBe(403)
  expect((await request.post('/api/packages', { data: {} })).status()).toBe(403)
  const created = await request.post('/api/packages', { headers, data: {
    name: 'BROWSER TEST', slug: 'browser-test-package', catalogGroup: 'mesh', speed: 500,
    prices: [{ region: 'metro', monthlyPrice: 310000 }, { region: 'other', monthlyPrice: 250000 }],
    description: 'Gói thử nghiệm trình duyệt', conditions: 'Điều kiện thử nghiệm', status: 'draft',
  } })
  expect(created.status(), await created.text()).toBe(201)
  const createdPackage = (await created.json()).doc
  expect((await request.get('/goi-cuoc/browser-test-package')).status()).toBe(404)
  const saved = await request.patch(`/api/packages/${createdPackage.id}`, { headers, data: { status: 'published', detailContent: {
    root: { type: 'root', version: 1, format: '', indent: 0, direction: 'ltr', children: [
      { type: 'heading', tag: 'h2', version: 1, format: '', indent: 0, direction: 'ltr', children: [{ type: 'text', version: 1, text: 'Nội dung riêng từ admin', format: 0, detail: 0, mode: 'normal', style: '' }] },
    ] },
  } } })
  expect(saved.ok(), await saved.text()).toBeTruthy()
  await page.goto(`/admin/collections/packages/${createdPackage.id}`)
  await expect(page.getByText('Bài viết chi tiết gói cước', { exact: true })).toBeVisible()
  await expect(page.locator('[contenteditable="true"]').first()).toBeVisible()
  await page.locator('[contenteditable="true"]').first().fill('Nội dung được sửa trong trình soạn thảo')
  await page.getByLabel('Giá / tháng (VNĐ)', { exact: false }).first().fill('315000')
  const saveResponse = page.waitForResponse((response) => response.url().includes(`/api/packages/${createdPackage.id}`) && response.request().method() === 'PATCH')
  await page.getByRole('button', { name: /Lưu|Save/, exact: false }).last().click()
  expect((await saveResponse).ok()).toBeTruthy()
  await expect.poll(async () => {
    const result = await request.get(`/api/packages/${createdPackage.id}`, { headers })
    return JSON.stringify((await result.json()).detailContent)
  }).toContain('Nội dung được sửa trong trình soạn thảo')
  await page.goto('/goi-cuoc/browser-test-package')
  await expect(page.locator('.package-article')).toContainText('Nội dung được sửa trong trình soạn thảo')
  await expect(page.locator('.price-details')).toContainText('315.000')
  await page.locator('.article-prices').getByRole('radio', { name: 'Tỉnh / thành khác' }).check()
  await expect(page.locator('.price-details')).toContainText('250.000')
  await page.goto('/')
  await expect(page.locator('#mesh .package-card').filter({ hasText: 'BROWSER TEST' })).toBeVisible()
  expect((await request.delete(`/api/packages/${createdPackage.id}`, { headers })).ok()).toBeTruthy()
  await page.goto('/admin/collections/packages')
  await expect(page.getByRole('heading', { name: 'Gói cước', exact: true })).toBeVisible()
  await page.goto('/admin/collections/leads')
  await expect(page.getByText('Showcase browser test', { exact: true })).toBeVisible()
  await page.goto('/admin/globals/site-settings')
  await expect(page.getByText('Danh sách liên hệ', { exact: true }).first()).toBeVisible()
})

test('mobile page and contact selector stay inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.locator('.package-card')).toHaveCount(18)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
  await page.getByRole('button', { name: 'Mở menu gói cước' }).click()
  await page.getByRole('navigation', { name: 'Điều hướng chính' }).getByRole('link', { name: 'TV360', exact: true }).click()
  await expect(page).toHaveURL(/#entertainment/)
  await expect(page.getByRole('button', { name: 'Mở menu gói cước' })).toHaveAttribute('aria-expanded', 'false')
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: 'test-results/showcase-mobile.png', fullPage: true })
  await page.screenshot({ path: 'test-results/showcase-mobile-top.png' })
  await page.locator('.contact-buttons').getByRole('button', { name: /Chat Zalo/ }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Đóng', exact: true }).click()
  await page.goto('/goi-cuoc/giga4')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gói Internet GIGA4')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
  await page.screenshot({ path: 'test-results/detail-mobile.png', fullPage: true })
})

test('production protections keep customer data private and bound image uploads', async ({ request }) => {
  const home = await request.get('/')
  expect(home.headers()['x-content-type-options']).toBe('nosniff')
  expect(home.headers()['x-frame-options']).toBe('SAMEORIGIN')
  expect(home.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin')
  for (const collection of ['users', 'leads']) {
    expect((await request.get(`/api/${collection}`)).status()).toBe(403)
    expect((await request.post(`/api/${collection}`, { data: {} })).status()).toBe(403)
  }
  const login = await request.post('/api/users/login', { data: { email, password } })
  expect(login.ok()).toBeTruthy()
  const { token } = await login.json()
  const headers = { Authorization: `JWT ${token}` }
  const buffer = await sharp({ create: { width: 800, height: 600, channels: 3, background: '#e51c39' } }).png().toBuffer()
  let mediaID: number | undefined
  try {
    const upload = await request.post('/api/media', {
      headers, multipart: { _payload: JSON.stringify({ alt: 'Deployment image test' }), file: { name: 'deployment-test.png', mimeType: 'image/png', buffer } },
    })
    expect(upload.status(), await upload.text()).toBe(201)
    const media = (await upload.json()).doc
    mediaID = media.id
    for (const url of [media.url, media.sizes.card.url]) {
      const response = await request.get(url)
      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain('image/png')
    }
    const oversized = Buffer.alloc(5 * 1024 * 1024 + 1)
    buffer.copy(oversized)
    const rejected = await request.post('/api/media', {
      headers, multipart: { _payload: JSON.stringify({ alt: 'Oversized test' }), file: { name: 'oversized.png', mimeType: 'image/png', buffer: oversized } },
    })
    expect(rejected.status(), await rejected.text()).toBe(413)
  } finally {
    if (mediaID) await request.delete(`/api/media/${mediaID}`, { headers })
  }
})
