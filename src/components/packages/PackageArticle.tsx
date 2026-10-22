import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Package } from '@/payload-types'

export function PackageArticle({ item }: { item: Package }) {
  return <>
    {item.detailContent && <RichText data={item.detailContent} />}
  </>
}
