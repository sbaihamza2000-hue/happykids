'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Cookie, PartyPopper, ShoppingCart } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useCartStore } from '@/store/cart'

type Product = {
  id: string
  name: string
  description: string
  ingredients?: string | null
  sizes?: string[]
  price: number
  onOffer?: boolean
  originalPrice?: number | null
  unit: string
  image: string
  available: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()
  const { toast } = useToast()
  const [justAddedId, setJustAddedId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch('/api/products')
        const data: unknown = await response.json()
        if (
          !cancelled &&
          typeof data === 'object' &&
          data !== null &&
          'products' in data &&
          Array.isArray((data as { products: unknown }).products)
        ) {
          setProducts((data as { products: Product[] }).products)
        }
      } catch {
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-pink/20 text-pink border-pink/30 px-4 py-1 text-sm font-semibold">
          <Cookie className="mr-1 h-3 w-3" />
          Nos Spécialités
        </Badge>
        <h1
          className="text-3xl font-bold text-dark-brown sm:text-4xl md:text-5xl mb-4"
          style={{ fontFamily: 'var(--font-fredoka)' }}
        >
          Tous les Produits
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
          Cliquez sur un produit pour voir les détails, ingrédients et options de commande.
        </p>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
            >
              <a
                href={`/products/${encodeURIComponent(product.id)}`}
                aria-label={`Voir détails: ${product.name}`}
                className="relative aspect-square overflow-hidden bg-cream block"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = '/images/logo.png'
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <Badge
                    className={cn(
                      'font-bold shadow-md',
                      product.available ? 'bg-green-600 text-white' : 'bg-muted text-foreground'
                    )}
                  >
                    {product.available ? 'Disponible' : 'Indisponible'}
                  </Badge>
                </div>
              </a>

              <CardHeader className="pb-2 pt-4">
                <CardTitle
                  className="text-lg font-bold text-dark-brown"
                  style={{ fontFamily: 'var(--font-fredoka)' }}
                >
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                {(() => {
                  const ingredientsText = (product.ingredients ?? '').trim()
                  const cleaned = ingredientsText
                    .split(/[,\n]/g)
                    .map((s) => s.trim())
                    .filter((s) => {
                      if (!s) return false
                      const n = s.toLowerCase()
                      return n !== 'à définir' && n !== 'a definire'
                    })
                    .join(', ')
                  const missing = cleaned.length === 0
                  return (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                      {missing ? 'À définir' : cleaned}
                    </p>
                  )
                })()}
                {(() => {
                  const unitText = (product.unit ?? '').trim()
                  const normalized = unitText.toLowerCase()
                  const show = unitText.length > 0 && normalized !== 'à définir' && normalized !== 'a definire'
                  return show ? (
                    <p className="text-xs font-medium text-golden-dark">{unitText}</p>
                  ) : null
                })()}
                <div className="mt-3 flex items-baseline gap-2">
                  {product.onOffer && product.originalPrice ? (
                    <>
                      <span className="text-lg font-bold text-warm-orange">
                        {product.price.toFixed(2)} TND
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {Number(product.originalPrice).toFixed(2)} TND
                      </span>
                      <Badge className="bg-warm-orange text-white font-bold">Promo</Badge>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-dark-brown">
                      {product.price.toFixed(2)} TND
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pb-4">
                <div className="flex w-full gap-2">
                  <Button asChild variant="outline" className="flex-1 font-bold rounded-full">
                    <a href={`/products/${encodeURIComponent(product.id)}`}>
                      Voir détails
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    className={cn(
                      'flex-1 font-bold rounded-full',
                      justAddedId === product.id
                        ? 'bg-green-500 hover:bg-green-500'
                        : 'bg-warm-orange hover:bg-warm-orange/90'
                    )}
                    disabled={!product.available}
                    onClick={() => {
                      if (!product.available) {
                        toast({
                          title: 'Indisponible',
                          description: `${product.name} n'est pas disponible pour le moment.`,
                          className: 'bg-white border-destructive text-dark-brown',
                        })
                        return
                      }
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      })
                      setJustAddedId(product.id)
                      toast({
                        title: 'Ajouté au panier !',
                        description: `${product.name} a été ajouté à votre panier.`,
                        className: 'bg-white border-golden text-dark-brown',
                      })
                      setTimeout(() => setJustAddedId((curr) => (curr === product.id ? null : curr)), 900)
                    }}
                  >
                    {justAddedId === product.id ? (
                      <>
                        <PartyPopper className="mr-2 h-4 w-4" />
                        Ajouté
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Panier
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
