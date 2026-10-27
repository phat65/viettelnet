import { SupportPage, supportMetadata } from '@/components/layout/SupportPage'
export const generateMetadata = () => supportMetadata('contact')
export default function Page() { return <SupportPage kind="contact" /> }
