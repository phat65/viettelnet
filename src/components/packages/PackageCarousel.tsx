'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'

export function PackageCarousel({ count, label, children }: { count: number; label: string; children: ReactNode }) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ start: true, end: false })
  const carousel = count >= 4

  useEffect(() => {
    const element = ref.current
    if (!element || !carousel) return
    const update = () => setPosition({ start: element.scrollLeft <= 2, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 })
    update()
    element.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(element)
    for (const child of element.children) observer.observe(child)
    return () => { element.removeEventListener('scroll', update); observer.disconnect() }
  }, [carousel, count])

  function move(direction: number) {
    const element = ref.current
    if (!element) return
    const card = element.firstElementChild
    const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap || '0') : element.clientWidth
    element.scrollBy({ left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return <div className="package-carousel">
    {carousel && <div className="carousel-controls" role="group" aria-label={`Chuyển gói: ${label}`}>
      <button type="button" aria-label="Xem gói trước" aria-controls={id} disabled={position.start} onClick={() => move(-1)}><Icon name="chevron" className="carousel-previous" /></button>
      <button type="button" aria-label="Xem gói tiếp theo" aria-controls={id} disabled={position.end} onClick={() => move(1)}><Icon name="chevron" /></button>
    </div>}
    <div ref={ref} id={id} className={`package-grid package-grid--${count}${carousel ? ' package-grid--carousel' : ''}`} role="region" aria-label={label} tabIndex={0}>{children}</div>
  </div>
}
