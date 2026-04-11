'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ProductOrderForm } from '@/components/order/product-order-form'

type Product = {
  id: string
  name: string
  description: string
  ingredients?: string | null
  price: number
  onOffer?: boolean
  originalPrice?: number | null
  unit: string
  image: string
  sizes?: string[]
  available: boolean
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!id) return
      try {
        const response = await fetch('/api/products')
        const data: unknown = await response.json()
        if (
          typeof data === 'object' &&
          data !== null &&
          'products' in data &&
          Array.isArray((data as { products: unknown }).products)
        ) {
          const found = (data as { products: Product[] }).products.find(
            (p) => p.id === id
          )
          if (!cancelled) setProduct(found ?? null)
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
  }, [id])

  const ingredients = useMemo(() => {
    return (product?.ingredients ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }, [product?.ingredients])


  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-muted-foreground">
        Chargement...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="rounded-3xl bg-white shadow-lg p-6 md:p-8">
          <h1
            className="text-2xl font-bold text-dark-brown"
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            Produit introuvable
          </h1>
          <p className="mt-2 text-muted-foreground">
            Ce produit n&apos;existe pas ou a été supprimé.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-3xl overflow-hidden bg-white shadow-lg">
          <div className="bg-cream">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = '/images/logo.png'
              }}
              className="w-full h-auto object-contain"
            />
            <div className="absolute top-4 left-4">
              <Badge
                className={
                  product.available
                    ? 'bg-green-600 text-white font-bold'
                    : 'bg-muted text-foreground font-bold'
                }
              >
                {product.available ? 'Disponible' : 'Indisponible'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold text-dark-brown"
              style={{ fontFamily: 'var(--font-fredoka)' }}
            >
              {product.name}
            </h1>
            <div className="mt-4 flex items-baseline gap-3">
              {product.onOffer && product.originalPrice ? (
                <>
                  <span className="text-2xl font-bold text-warm-orange">
                    {product.price.toFixed(2)} TND
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {Number(product.originalPrice).toFixed(2)} TND
                  </span>
                  <Badge className="bg-warm-orange text-white font-bold">Promo</Badge>
                </>
              ) : (
                <span className="text-2xl font-bold text-dark-brown">
                  {product.price.toFixed(2)} TND
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-medium text-golden-dark">
              {product.unit}
            </p>
          </div>

          <Separator className="bg-golden/20" />

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-dark-brown">Ingrédients</h2>
            {ingredients.length === 0 ? (
              <p className="text-sm text-muted-foreground">À définir</p>
            ) : (
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                {ingredients.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            )}
          </div>

          <ProductOrderForm
            productId={product.id}
            productName={product.name}
            sizes={product.sizes}
            disabled={!product.available}
          />
        </div>
      </div>
    </div>
  )
}
