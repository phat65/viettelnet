'use client'

import { useRouter } from 'next/navigation'
import { provincePath } from '@/lib/provinces'
import { ProvincePicker } from './ProvincePicker'

export function ProvinceNavigation({ slug }: { slug: string }) {
  const router = useRouter()
  return <ProvincePicker value={slug} onChange={(value) => router.push(provincePath(value))} />
}
