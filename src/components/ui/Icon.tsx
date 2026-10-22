import type { SVGProps } from 'react'

const paths = {
  wifi: ['M2 8.8a16 16 0 0 1 20 0', 'M5 12.2a11 11 0 0 1 14 0', 'M8.5 15.5a5.5 5.5 0 0 1 7 0', 'M12 19h.01'],
  arrow: ['M4 12h16', 'm14 6 6 6-6 6'],
  check: ['m5 12 4 4L19 6'],
  phone: ['M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z'],
  chat: ['M21 11.5a9 9 0 0 1-9 9 10 10 0 0 1-4-.8L3 21l1.3-4.5A9 9 0 1 1 21 11.5Z', 'M8 11h8', 'M8 14h5'],
  sparkles: ['m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8L12 2Z'],
  gift: ['M3 8h18v4H3z', 'M5 12v9h14v-9', 'M12 8v13', 'M12 8H8a3 3 0 1 1 3-3l1 3Z', 'M12 8h4a3 3 0 1 0-3-3l-1 3Z'],
  tv: ['M3 7h18v13H3z', 'm8 2 4 5 4-5'],
  camera: ['M4 7h4l2-3h4l2 3h4v14H4z', 'M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'],
  home: ['m3 11 9-8 9 8', 'M5 9v12h14V9', 'M9 21v-8h6v8'],
  bolt: ['m13 2-9 12h7l-1 8 10-13h-7l1-7Z'],
  shield: ['M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Z', 'm8 12 3 3 5-6'],
  users: ['M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', 'M5 21v-3a7 7 0 0 1 14 0v3', 'M19 3a4 4 0 0 1 0 8', 'M22 21v-3a6 6 0 0 0-3-5'],
  game: ['M7 7h10l4 12c.5 2-2 3-3 1l-3-3H9l-3 3c-1 2-3.5 1-3-1L7 7Z', 'M6 12h5', 'M8.5 9.5v5', 'M16 11h.01', 'M18 14h.01'],
  work: ['M3 7h18v14H3z', 'M8 7V3h8v4', 'M3 12a18 18 0 0 0 18 0', 'M12 11v4'],
  close: ['m6 6 12 12', 'M6 18 18 6'],
  chevron: ['m9 5 7 7-7 7'],
} as const

export type IconName = keyof typeof paths
export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {paths[name].map((d, index) => <path d={d} key={index} />)}
  </svg>
}
