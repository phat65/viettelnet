'use client'

import type { ReactNode } from 'react'
import { useConsultation } from './ConsultationProvider'

export function RegistrationButton({ packageId, packageName, children, className = 'button', onOpen }: {
  packageId?: number; packageName?: string; children: ReactNode; className?: string; onOpen?: () => void
}) {
  const open = useConsultation()
  return <button type="button" className={className} onClick={() => { open({ packageId, packageName }); onOpen?.() }}>{children}</button>
}
