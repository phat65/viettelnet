'use client'

import { useId } from 'react'
import { regionLabels, type Region } from '@/lib/format'

export function RegionPicker({ value, onChange, compact = false }: { value: Region; onChange: (region: Region) => void; compact?: boolean }) {
  const name = useId()
  return <fieldset className="region-picker"><legend>Khu vực lắp đặt</legend>
    {Object.entries(regionLabels).map(([region, label]) => <label key={region}>
      <input type="radio" name={name} value={region} aria-label={label} checked={value === region} onChange={() => onChange(region as Region)} />{compact ? (region === 'metro' ? 'HN & TP.HCM' : 'Tỉnh/TP khác') : label}
    </label>)}
  </fieldset>
}
