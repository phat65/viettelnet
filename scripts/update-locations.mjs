import { mkdir, writeFile } from 'node:fs/promises'

// Snapshot the two-level address catalog; customer registration never depends on an external API.
const source = 'https://provinces.open-api.vn/api/v2/?depth=2'
const response = await fetch(source)
if (!response.ok) throw new Error(`Location download failed: ${response.status}`)
const data = await response.json()
if (!Array.isArray(data) || data.length < 30 || data.some(p => !p.name || !p.code || !p.wards?.length)) throw new Error('Incomplete location data')
const provinces = data.map(p => ({ code: String(p.code), name: p.name }))
const wards = Object.fromEntries(data.map(p => [String(p.code), p.wards.map(w => ({ code: String(w.code), name: w.name }))]))
const allWardCodes = Object.values(wards).flat().map(w => w.code)
if (new Set(allWardCodes).size !== allWardCodes.length || allWardCodes.length < 1000) throw new Error('Invalid ward codes')
await mkdir('src/data/locations', { recursive: true })
await writeFile('src/data/locations/provinces.json', JSON.stringify(provinces, null, 2) + '\n')
await writeFile('src/data/locations/wards.json', JSON.stringify(wards) + '\n')
await writeFile('src/data/locations/SOURCE.md', `# Address catalog\n\nSource: ${source}\n\nDownloaded: ${new Date().toISOString()}\n\n${provinces.length} provinces/cities and ${allWardCodes.length} wards/communes. API v2 uses the two-level administrative catalog after July 2025.\n\nRefresh with \`node scripts/update-locations.mjs\`, review changes, then rebuild the app. Existing leads retain their address names at registration time.\n`)
console.log(`${provinces.length} provinces/cities; ${allWardCodes.length} wards/communes`)
