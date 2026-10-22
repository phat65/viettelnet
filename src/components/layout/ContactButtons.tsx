'use client'

import { useState } from 'react'
import { activeContacts, contactZaloUrl, normalizePhone, type Contact } from '@/lib/contacts'
import { Modal } from '@/components/ui/Modal'
import { Icon } from '@/components/ui/Icon'

export function ContactButtons({ contacts, inline = false }: { contacts?: Contact[] | null; inline?: boolean }) {
  const [channel, setChannel] = useState<'phone' | 'zalo' | null>(null)
  const people = activeContacts(contacts)
  const zaloPeople = people.filter((person) => contactZaloUrl(person))
  if (!people.length) return null
  const options = channel === 'zalo' ? zaloPeople : people
  return <>
    <div className={inline ? 'contact-inline' : 'contact-buttons'} aria-label="Liên hệ tư vấn">
      <button type="button" className="contact-trigger contact-trigger--phone" onClick={() => setChannel('phone')} aria-haspopup="dialog" aria-label="Gọi tư vấn">
        <Icon name="phone" /><span>Gọi tư vấn</span>
      </button>
      {zaloPeople.length > 0 && <button type="button" className="contact-trigger contact-trigger--zalo" onClick={() => setChannel('zalo')} aria-haspopup="dialog" aria-label="Chat Zalo">
        <span className="zalo-mark">Zalo</span><span>Chat Zalo</span>
      </button>}
    </div>
    <Modal open={channel !== null} onClose={() => setChannel(null)} title={channel === 'zalo' ? 'Bạn muốn chat với ai?' : 'Chọn số để gọi tư vấn'}>
      <p className="muted">Chọn người liên hệ phù hợp để được hỗ trợ về gói cước và lắp đặt.</p>
      <div className="contact-options">
        {options.map((person, index) => <a key={person.id ?? `${person.phone}-${index}`} className="contact-option"
          href={channel === 'zalo' ? contactZaloUrl(person)! : `tel:${normalizePhone(person.phone)}`}
          target={channel === 'zalo' ? '_blank' : undefined} rel={channel === 'zalo' ? 'noopener noreferrer' : undefined}>
          <span className="contact-avatar">{person.name.charAt(0).toUpperCase()}</span>
          <span><strong>{person.name}</strong><span>{person.phone}</span></span>
          <Icon name={channel === 'zalo' ? 'chat' : 'phone'} />
        </a>)}
      </div>
      {channel === 'zalo' && <p className="contact-note">Zalo sẽ mở cuộc trò chuyện theo số hoặc link bạn đã chọn.</p>}
    </Modal>
  </>
}
