'use client'

import { Facebook, MapPin, MessageCircle, Phone } from 'lucide-react'

import { Separator } from '@/components/ui/separator'
import { navLinks } from '@/components/site/nav-links'

export function Footer({ showWhatsApp = true }: { showWhatsApp?: boolean }) {
  return (
    <footer className="bg-dark-brown text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.jpg"
                alt="Happy Kids"
                onError={(e) => {
                  e.currentTarget.src = '/images/logo.png'
                }}
                className="h-12 w-12 rounded-full border-2 border-golden"
              />
              <span
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-fredoka)' }}
              >
                Happy Kids
              </span>
            </div>
            <p className="text-white/60 leading-relaxed text-sm">
              Cookies et pâtisseries tunisiennes préparés avec soin pour les petits et les grands. Fabriqué par la société Happy Kids Confectionery. Nos produits peuvent contenir des traces d&apos;allergènes.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-golden">Liens Rapides</h4>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-white/60 hover:text-golden transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-golden">Suivez-nous</h4>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/people/Happy-Kids/100092726604069/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-blue-600 text-white transition-all hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>
              {showWhatsApp ? (
                <a
                  href="https://wa.me/21628886302"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-green-500 text-white transition-all hover:scale-110"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              ) : null}
            </div>
            <div className="mt-6 space-y-2 text-sm text-white/60">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-golden" />
                +216 28 886 302
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-golden" />
                +216 26 906 333
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-golden" />
                Zone industrielle Souassi, Mahdia, 5140 Tunisie
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="text-center text-sm text-white/40">
          <p>&copy; 2025 Happy Kids - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  )
}
