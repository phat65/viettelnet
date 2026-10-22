'use client'

import { useState } from 'react'
import Link from 'next/link'
import { catalogGroups } from '@/data/catalog'
import { RegistrationButton } from '@/components/forms/RegistrationButton'

export function Header() {
  const [open, setOpen] = useState(false)
  return <header className="site-header"><div className="container header-inner">
    <Link className="brand" href="/" aria-label="Internet Viettel — Trang chủ" onClick={() => setOpen(false)}>
      <img className="brand-logo" src="/images/viettel.svg" alt="viettel" width="98" height="23" />
    </Link>
    <button type="button" className="menu-toggle" aria-label={open ? 'Đóng menu' : 'Mở menu gói cước'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}><span /><span /><span /></button>
    <nav id="main-navigation" className={open ? 'is-open' : ''} aria-label="Điều hướng chính" onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false) }}>
      {catalogGroups.map((group) => <Link key={group.id} title={group.title} href={`/#${group.id}`} onClick={() => setOpen(false)}>{group.label}</Link>)}
      <RegistrationButton className="header-register" onOpen={() => setOpen(false)}>Đăng ký tư vấn</RegistrationButton>
    </nav>
  </div></header>
}
