'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { Modal } from '@/components/ui/Modal'
import { ConsultationForm } from './ConsultationForm'

type Selection = { packageId?: number; packageName?: string }
const ConsultationContext = createContext<((selection?: Selection) => void) | null>(null)

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection | null>(null)
  const close = () => setSelection(null)
  return <ConsultationContext.Provider value={(value = {}) => setSelection(value)}>
    {children}
    <Modal open={selection !== null} onClose={close} title="Thông tin đăng ký" className="registration-dialog">
      {selection && <ConsultationForm {...selection} onClose={close} />}
    </Modal>
  </ConsultationContext.Provider>
}

export function useConsultation() {
  const open = useContext(ConsultationContext)
  if (!open) throw new Error('Registration must be inside ConsultationProvider')
  return open
}
