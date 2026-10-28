'use client'

import type { ReactNode } from 'react'
import { useConsultation } from './ConsultationProvider'

export function RegistrationButton({ packageId, packageName, provinceCode, children, className = 'button', onOpen }: {
  packageId?: number; packageName?: string; provinceCode?: string; children: ReactNode; className?: string; onOpen?: () => void
}) {
  const open = useConsultation()
  return <button type="button" className={className} onClick={() => { open({ packageId, packageName, provinceCode }); onOpen?.() }}>{children}</button>
}
