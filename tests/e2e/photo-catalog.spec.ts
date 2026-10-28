import { test, expect } from '@playwright/test'
import { storagePackageSlugs } from '../../src/migrations/20261028_234000_remove_storage_packages'

test('catalog keeps Internet camera combos and removes standalone storage packages and URLs', async ({ page, request }) => {
  await page.goto('/internet/camera')
  await expect(page.getByRole('heading', { name: 'Xem gói Internet theo tỉnh / thành phố' })).toHaveCount(0)
  await expect(page.locator('.package-card')).toHaveCount(5)
  for (const slug of storagePackageSlugs) {
    await expect(page.locator(`a[href*="/internet/${slug}"]`)).toHaveCount(0)
    expect((await request.get(`/internet/${slug}`)).status(), slug).toBe(404)
  }
  await page.goto('/internet/netvt1-cam1?khu-vuc=da-nang')
  await expect(page.locator('.price-details')).toContainText('200.000')
  await page.locator('.article-prices').getByRole('combobox').selectOption('ha-noi')
  await expect(page.locator('.price-details')).toContainText('240.000')
  for (const [slug, price] of [['gigapro1', '500.000'], ['gigavip1', '1.300.000']]) {
    await page.goto(`/internet/${slug}`)
    await expect(page.locator('.price-details')).toContainText(price)
  }
  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const slug of ['gigapro1', 'gigavip1', 'meshvt3-cam1']) expect(sitemap).toContain(`/internet/${slug}</loc>`)
  for (const slug of storagePackageSlugs) expect(sitemap).not.toContain(`/internet/${slug}</loc>`)
})

test('arrows scroll groups with four or more packages and remain usable on mobile', async ({ page }) => {
  await page.goto('/internet/ultra-speed')
  const group = page.locator('#ultra')
  await expect(group.locator('.package-card')).toHaveCount(6)
  const track = group.locator('.package-grid')
  const next = group.getByRole('button', { name: 'Xem gói tiếp theo', exact: true })
  const previous = group.getByRole('button', { name: 'Xem gói trước', exact: true })
  await expect(previous).toBeDisabled()
  await expect(next).toBeEnabled()
  await next.click()
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(100)
  await expect(previous).toBeEnabled()
  await previous.click()
  await expect(previous).toBeDisabled()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (let index = 0; index < 6 && await next.isEnabled(); index++) await next.click()
  await expect(next).toBeDisabled()
  await page.screenshot({ path: 'test-results/catalog-arrows-desktop.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/internet/camera')
  await page.getByRole('button', { name: 'Xem gói tiếp theo', exact: true }).click()
  await expect.poll(() => page.locator('#camera .package-grid').evaluate((element) => element.scrollLeft)).toBeGreaterThan(100)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
  await page.screenshot({ path: 'test-results/catalog-arrows-mobile.png', fullPage: true })
  await page.goto('/internet/ca-nhan')
  await expect(page.getByRole('button', { name: 'Xem gói tiếp theo', exact: true })).toHaveCount(0)
})
