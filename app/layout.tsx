import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'En · Futbolun Enleri',description:'Futbolun unutulmaz anlarını izle, her odada favorine oy ver.',icons:{icon:'/favicon.svg'},openGraph:{images:['/og.jpg']}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="tr"><body>{children}</body></html>}
