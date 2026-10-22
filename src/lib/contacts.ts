export type Contact = {
  id?: string | null
  name: string
  phone: string
  zaloUrl?: string | null
  zaloEnabled?: boolean | null
  enabled?: boolean | null
}

export function normalizePhone(phone: string) {
  return phone.trim().replace(/[\s().-]/g, '').replace(/^\+?84(?=\d{9,10}$)/, '0')
}

export function validContactPhone(value: string) {
  return /^(0\d{9,10}|1[89]00\d{4,6})$/.test(normalizePhone(value))
}

export function validZaloUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === 'zalo.me' &&
      !url.username && !url.password && !url.port && url.pathname.length > 1
  } catch { return false }
}

export function contactZaloUrl(contact: Contact) {
  if (contact.zaloEnabled === false) return null
  if (contact.zaloUrl) return validZaloUrl(contact.zaloUrl) ? contact.zaloUrl : null
  const phone = normalizePhone(contact.phone)
  return /^0[35789]\d{8}$/.test(phone) ? `https://zalo.me/${phone}` : null
}

export function activeContacts(contacts?: Contact[] | null) {
  return (contacts ?? []).filter((contact) => contact.enabled !== false && validContactPhone(contact.phone))
}
