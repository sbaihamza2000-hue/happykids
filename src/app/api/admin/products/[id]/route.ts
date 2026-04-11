import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'

function requireAdmin(request: Request) {
  const configuredPassword = process.env.ADMIN_PASSWORD
  if (!configuredPassword) {
    return NextResponse.json(
      { error: 'Admin password not configured' },
      { status: 500 }
    )
  }

  const providedPassword = request.headers.get('x-admin-password')
  if (providedPassword !== configuredPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request)
  if (auth) return auth

  try {
    const { id } = await context.params
    if (!id) {
      return NextResponse.json({ error: 'Missing product id' }, { status: 400 })
    }

    const body: unknown = await request.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    const data: {
      name?: string
      description?: string
      price?: number
      onOffer?: boolean
      originalPrice?: number | null
    } = {}

    if ('name' in body) {
      const v = (body as { name: unknown }).name
      if (typeof v !== 'string' || !v.trim()) {
        return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
      }
      data.name = v.trim()
    }

    if ('description' in body) {
      const v = (body as { description: unknown }).description
      if (typeof v !== 'string' || !v.trim()) {
        return NextResponse.json({ error: 'Invalid description' }, { status: 400 })
      }
      data.description = v.trim()
    }

    if ('price' in body) {
      const v = (body as { price: unknown }).price
      const parsed = typeof v === 'number' ? v : Number(String(v).trim())
      if (!Number.isFinite(parsed) || parsed < 0) {
        return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
      }
      data.price = parsed
    }

    if ('onOffer' in body) {
      const v = (body as { onOffer: unknown }).onOffer
      if (typeof v !== 'boolean') {
        return NextResponse.json({ error: 'Invalid onOffer' }, { status: 400 })
      }
      data.onOffer = v
    }

    if ('originalPrice' in body) {
      const v = (body as { originalPrice: unknown }).originalPrice
      if (v === null) {
        data.originalPrice = null
      } else {
        const parsed = typeof v === 'number' ? v : Number(String(v).trim())
        if (!Number.isFinite(parsed) || parsed < 0) {
          return NextResponse.json(
            { error: 'Invalid originalPrice' },
            { status: 400 }
          )
        }
        data.originalPrice = parsed
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    if (data.onOffer === false && !('originalPrice' in body)) {
      data.originalPrice = null
    }

    const product = await db.product.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        onOffer: true,
        originalPrice: true,
      },
    })

    return NextResponse.json({ product })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request)
  if (auth) return auth

  try {
    const { id } = await context.params
    if (!id) {
      return NextResponse.json({ error: 'Missing product id' }, { status: 400 })
    }

    await db.$transaction([
      db.orderItem.deleteMany({ where: { productId: id } }),
      db.product.delete({ where: { id } }),
    ])

    return NextResponse.json({ id })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}