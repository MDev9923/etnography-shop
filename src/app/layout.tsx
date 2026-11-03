import './globals.css'
import { Josefin_Sans } from 'next/font/google'
import { AppProvider } from '@/lib/context'
import { AudioProvider } from '@/contexts/AudioContext';
import { CartProvider } from '@/contexts/CartContext';

const josefinSans = Josefin_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap'
})

export const metadata = {
  title: 'Etnography - Professional Photography Equipment',
  description: 'Discover premium analog and digital cameras, lenses, and accessories for professional and amateur photographers in Skopje, Macedonia.',
  keywords: 'camera, photography, lenses, analog, digital, photo equipment, etnography, skopje, macedonia',
  openGraph: {
    title: 'Etnography - Professional Photography Equipment',
    description: 'Discover premium analog and digital cameras, lenses, and accessories in Skopje, Macedonia.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'mk_MK',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={josefinSans.className}>
        <AppProvider>
          <AudioProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AudioProvider>
        </AppProvider>
      </body>
    </html>
  )
}
