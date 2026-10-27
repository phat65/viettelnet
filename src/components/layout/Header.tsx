'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { catalogNavigation } from '@/lib/catalogRoutes'
import { RegistrationButton } from '@/components/forms/RegistrationButton'

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return <header className="site-header"><div className="container header-inner">
    <Link className="brand" href="/" aria-label="Internet Viettel — Trang chủ" onClick={() => setOpen(false)}>
      <img className="brand-logo" src="/images/viettel.svg" alt="viettel" width="98" height="23" />
    </Link>
    <button type="button" className="menu-toggle" aria-label={open ? 'Đóng menu' : 'Mở menu gói cước'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}><span /><span /><span /></button>
    <nav id="main-navigation" className={open ? 'is-open' : ''} aria-label="Điều hướng chính" onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false) }}>
      {catalogNavigation.map((entry) => <Link key={entry.href} href={entry.href} aria-current={pathname === entry.href ? 'page' : undefined} onClick={() => setOpen(false)}>{entry.label}</Link>)}
      <RegistrationButton className="header-register" onOpen={() => setOpen(false)}>Đăng ký tư vấn</RegistrationButton>
    </nav>
  </div></header>
}
