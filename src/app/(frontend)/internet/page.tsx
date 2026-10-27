import { CatalogLanding, catalogMetadata } from '@/components/packages/CatalogLanding'

export const generateMetadata = () => catalogMetadata()
export default function InternetPage() {
  return <CatalogLanding />
}
