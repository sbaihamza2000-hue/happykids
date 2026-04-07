'use client'

import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type SizeOption = {
  value: string
  label: string
  minBoxes: number
}

const sizeOptions: SizeOption[] = [
  { value: '500g', label: '500g', minBoxes: 5 },
  { value: '800g', label: '800g', minBoxes: 3 },
  { value: '1.5kg', label: '1.5kg', minBoxes: 1 },
  { value: '2.5kg', label: '2.5kg', minBoxes: 1 },
]

export function ProductOrderForm({
  productId,
  productName,
  disabled = false,
}: {
  productId: string
  productName: string
  disabled?: boolean
}) {
  const { toast } = useToast()
  const [size, setSize] = useState<SizeOption>(sizeOptions[0])
  const [boxes, setBoxes] = useState<number>(sizeOptions[0].minBoxes)
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const minBoxes = useMemo(() => size.minBoxes, [size])

  const normalizeBoxes = (value: number) => {
    if (!Number.isFinite(value)) return minBoxes
    if (value < minBoxes) return minBoxes
    return Math.floor(value)
  }

  const handleSubmit = async () => {
    const cleanName = customerName.trim()
    const cleanPhone = phone.trim()
    const cleanLocation = location.trim()
    const cleanBoxes = normalizeBoxes(boxes)

    if (!cleanName || !cleanPhone || !cleanLocation) {
      toast({
        title: 'Champs requis',
        description: 'Nom, numéro et localisation sont obligatoires.',
        className: 'bg-white border-destructive text-dark-brown',
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: cleanName,
          phone: cleanPhone,
          location: cleanLocation,
          productId,
          size: size.value,
          boxes: cleanBoxes,
        }),
      })

      const data: unknown = await response.json().catch(() => ({}))
      const orderId =
        typeof data === 'object' && data !== null && 'orderId' in data
          ? String((data as { orderId: unknown }).orderId)
          : undefined

      if (!response.ok) {
        toast({
          title: 'Erreur',
          description: "Impossible d'enregistrer la commande.",
          className: 'bg-white border-destructive text-dark-brown',
        })
        return
      }

      toast({
        title: 'Commande envoyée',
        description: `Commande enregistrée${orderId ? ` (ID: ${orderId})` : ''}. Nous vous contacterons bientôt.`,
        className: 'bg-white border-golden text-dark-brown',
      })

      setCustomerName('')
      setPhone('')
      setLocation('')
      setSize(sizeOptions[0])
      setBoxes(sizeOptions[0].minBoxes)
    } catch {
      toast({
        title: 'Erreur',
        description: "Impossible de préparer la commande pour l'instant.",
        className: 'bg-white border-destructive text-dark-brown',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-3xl bg-white shadow-lg p-6 md:p-8">
      <h3
        className="text-xl font-bold text-dark-brown mb-4"
        style={{ fontFamily: 'var(--font-fredoka)' }}
      >
        Commander
      </h3>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-dark-brown font-semibold">Taille</Label>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((opt) => (
              <Button
                key={opt.value}
                type="button"
                variant="outline"
                className={cn(
                  'rounded-full border-golden/30',
                  opt.value === size.value
                    ? 'bg-warm-orange text-white border-warm-orange'
                    : 'bg-white text-dark-brown'
                )}
                onClick={() => {
                  setSize(opt)
                  setBoxes((current) => normalizeBoxes(current))
                }}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Minimum: {minBoxes} boîte{minBoxes > 1 ? 's' : ''} pour {size.value}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="boxes" className="text-dark-brown font-semibold">
            Nombre de boîtes
          </Label>
          <Input
            id="boxes"
            type="number"
            min={minBoxes}
            value={boxes}
            onChange={(e) => setBoxes(Number(e.target.value))}
            className="bg-white border-golden/30 focus:border-warm-orange focus:ring-warm-orange/20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName" className="text-dark-brown font-semibold">
              Nom
            </Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="bg-white border-golden/30 focus:border-warm-orange focus:ring-warm-orange/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-dark-brown font-semibold">
              Numéro
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white border-golden/30 focus:border-warm-orange focus:ring-warm-orange/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-dark-brown font-semibold">
            Localisation
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-white border-golden/30 focus:border-warm-orange focus:ring-warm-orange/20"
          />
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || disabled}
          className="w-full bg-warm-orange hover:bg-warm-orange/90 text-white font-bold rounded-full py-6 text-lg"
        >
          {disabled ? 'Indisponible' : submitting ? 'Préparation...' : 'Finaliser la commande'}
        </Button>
      </div>
    </div>
  )
}
