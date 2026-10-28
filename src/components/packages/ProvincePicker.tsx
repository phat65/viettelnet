'use client'

import { useId } from 'react'
import { internetProvinces } from '@/lib/provinces'

export function ProvincePicker({ value, onChange }: { value: string; onChange: (slug: string) => void }) {
  const id = useId()
  return <div className="province-picker">
    <label htmlFor={id}>Tỉnh / thành phố lắp đặt</label>
    <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="" disabled>Chọn tỉnh / thành phố</option>
      {internetProvinces.map((province) => <option key={province.code} value={province.slug}>{province.name}</option>)}
    </select>
  </div>
}
