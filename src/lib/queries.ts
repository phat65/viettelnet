import 'server-only'
import { cache } from 'react'
import { getCMS } from './payload'

export const getPackages = cache(async () => {
  const payload = await getCMS()
  const result = await payload.find({
    collection: 'packages', overrideAccess: false,
    where: { status: { equals: 'published' } }, sort: 'sortOrder',
    pagination: false, depth: 1,
  })
  return result.docs
})

export const getPackage = cache(async (slug: string) => {
  const payload = await getCMS()
  const result = await payload.find({
    collection: 'packages', overrideAccess: false,
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    limit: 1, depth: 1,
  })
  return result.docs[0] ?? null
})

export const getSiteSettings = cache(async () => {
  const payload = await getCMS()
  return payload.findGlobal({ slug: 'site-settings', overrideAccess: false, depth: 1 })
})

export const getCatalogContent = cache(async () => {
  const payload = await getCMS()
  return payload.findGlobal({ slug: 'catalog-content', overrideAccess: false, depth: 1 })
})
