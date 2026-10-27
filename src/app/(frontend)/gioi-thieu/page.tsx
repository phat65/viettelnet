import { SupportPage, supportMetadata } from '@/components/layout/SupportPage'
export const generateMetadata = () => supportMetadata('about')
export default function Page() { return <SupportPage kind="about" /> }
