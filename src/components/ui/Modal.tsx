'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Icon } from './Icon'

export function Modal({ open, onClose, title, children, className = '' }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal()
    if (!open && ref.current?.open) ref.current?.close()
  }, [open])
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])
  return (
    <dialog ref={ref} className={`contact-dialog ${className}`} onClose={onClose} aria-labelledby={titleId}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="dialog-body">
      <button type="button" className="dialog-close" onClick={onClose} aria-label="Đóng"><Icon name="close" /></button>
      <h2 id={titleId}>{title}</h2>{children}
      </div>
    </dialog>
  )
}
