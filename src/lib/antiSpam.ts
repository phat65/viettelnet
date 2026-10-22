import type { Payload } from 'payload'

// Shared database check survives restarts. This limits repeat submissions per phone,
// not a replacement for an edge/WAF rate limit against deliberate bulk spam.
export async function hasRecentConsultation(payload: Payload, phone: string) {
  const result = await payload.count({
    collection: 'leads', overrideAccess: true,
    where: { and: [
      { phone: { equals: phone } },
      { createdAt: { greater_than: new Date(Date.now() - 10 * 60 * 1000).toISOString() } },
    ] },
  })
  return result.totalDocs > 0
}
