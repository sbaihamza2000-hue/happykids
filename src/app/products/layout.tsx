import type { ReactNode } from 'react'

import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'
import { CartSidebar } from '@/components/site/cart-sidebar'
import { WhatsAppButton } from '@/components/site/whatsapp-button'

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <CartSidebar />
      <WhatsAppButton />
    </div>
  )
}
