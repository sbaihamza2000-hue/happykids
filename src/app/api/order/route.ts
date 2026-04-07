import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function notifyDiscord(message: string) {
  const url = process.env.DISCORD_WEBHOOK_URL
  if (!url) return

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    })
  } catch {
  }
}

const sizeMinBoxes: Record<string, number> = {
  '500g': 5,
  '800g': 3,
  '1.5kg': 1,
  '2.5kg': 1,
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    const {
      customerName,
      phone,
      location,
      productId,
      size,
      boxes,
    } = body as {
      customerName?: unknown
      phone?: unknown
      location?: unknown
      productId?: unknown
      size?: unknown
      boxes?: unknown
    }

    if (
      typeof customerName !== 'string' ||
      typeof phone !== 'string' ||
      typeof location !== 'string' ||
      typeof productId !== 'string' ||
      typeof size !== 'string'
    ) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const minBoxes = sizeMinBoxes[size] ?? 1
    const parsedBoxes = typeof boxes === 'number' ? Math.floor(boxes) : Number(boxes)
    if (!Number.isFinite(parsedBoxes) || parsedBoxes < minBoxes) {
      return NextResponse.json(
        { error: `Minimum boxes for ${size} is ${minBoxes}` },
        { status: 400 }
      )
    }

    const product = await db.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const order = await db.order.create({
      data: {
        customerName: customerName.trim(),
        phone: phone.trim(),
        location: location.trim(),
        items: {
          create: [
            {
              productId: product.id,
              size,
              boxes: parsedBoxes,
            },
          ],
        },
      },
      select: { id: true },
    })

    void notifyDiscord(
      [
        `Nouvelle commande: ${order.id}`,
        `Nom: ${customerName.trim()}`,
        `Téléphone: ${phone.trim()}`,
        `Localisation: ${location.trim()}`,
        `Produit: ${product.name}`,
        `Taille: ${size}`,
        `Boîtes: ${parsedBoxes}`,
      ].join('\n')
    )

    return NextResponse.json({ orderId: order.id })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
