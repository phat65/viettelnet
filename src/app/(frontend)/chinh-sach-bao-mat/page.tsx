import { SupportPage, supportMetadata } from '@/components/layout/SupportPage'
export const generateMetadata = () => supportMetadata('privacy')
export default function Page() { return <SupportPage kind="privacy" /> }
