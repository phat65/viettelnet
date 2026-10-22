import type { InputHTMLAttributes } from 'react'

export function Input({ label, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; id: string }) {
  return <label htmlFor={id} className="field">{label}<input id={id} {...props} /></label>
}
