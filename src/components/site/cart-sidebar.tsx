'use client'

import { Cookie, MessageCircle, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCartStore, type CartItem } from '@/store/cart'

export function CartSidebar() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCartStore()

  const itemCount = totalItems()
  const total = totalPrice()

  const handleWhatsApp = () => {
    const itemsText = items
      .map(
        (item: CartItem) =>
          `- ${item.name} x${item.quantity} (${(item.price * item.quantity).toFixed(2)} TND)`
      )
      .join('\n')
    const message = `Bonjour Happy Kids ! Je souhaite commander :\n\n${itemsText}\n\nTotal : ${total.toFixed(2)} TND`
    window.open(`https://wa.me/21628886302?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-cream border-golden/20">
        <SheetHeader className="pb-4">
          <SheetTitle
            className="text-xl font-bold text-dark-brown flex items-center gap-2"
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            <ShoppingCart className="h-5 w-5 text-warm-orange" />
            Mon Panier
            {itemCount > 0 && (
              <Badge className="bg-warm-orange text-white ml-2">
                {itemCount} article{itemCount > 1 ? 's' : ''}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Vos douceurs sélectionnées
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Cookie className="h-16 w-16 text-golden/30 mb-4" />
              <p className="text-muted-foreground font-medium">Votre panier est vide</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Ajoutez des délicieux cookies !
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex gap-3 rounded-xl bg-white p-3 shadow-sm">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark-brown text-sm truncate">{item.name}</p>
                    <p className="text-warm-orange font-bold text-sm">{item.price.toFixed(2)} TND</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-golden/30 hover:bg-cream"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-golden/30 hover:bg-cream"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <p className="text-sm font-bold text-dark-brown">
                      {(item.price * item.quantity).toFixed(2)} TND
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t border-golden/20 pt-4 space-y-3">
            <div className="flex items-center justify-between w-full">
              <span className="text-muted-foreground font-medium">Total</span>
              <span
                className="text-2xl font-bold text-dark-brown"
                style={{ fontFamily: 'var(--font-fredoka)' }}
              >
                {total.toFixed(2)} TND
              </span>
            </div>
            <Button
              onClick={handleWhatsApp}
              className="w-full bg-green-500 hover:bg-green-500/90 text-white font-bold rounded-full py-5 text-base"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Commander via WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={clearCart}
              className="w-full border-golden/30 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Vider le panier
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
