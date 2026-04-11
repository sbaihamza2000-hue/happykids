import { NextResponse } from 'next/server'
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

export async function POST(request: Request) {
  const auth = requireAdmin(request)
  if (auth) return auth

  try {
    const body: unknown = await request.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    const name = 'name' in body ? (body as { name: unknown }).name : undefined
    const ingredients = 'ingredients' in body ? (body as { ingredients: unknown }).ingredients : undefined
    const sizes = 'sizes' in body ? (body as { sizes: unknown }).sizes : undefined
    const price = 'price' in body ? (body as { price: unknown }).price : undefined
    const image = 'image' in body ? (body as { image: unknown }).image : undefined

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      (typeof ingredients !== 'string' && ingredients !== null) ||
      (typeof price !== 'number' && typeof price !== 'string') ||
      typeof image !== 'string' ||
      !image.trim()
    ) {
      return NextResponse.json(
        { error: 'name, ingredients, price and image are required' },
        { status: 400 }
      )
    }

    const sizesArr = Array.isArray(sizes)
      ? (sizes as unknown[]).map(String).filter(Boolean)
      : []

    const parsedPrice =
      typeof price === 'number' ? price : Number(String(price).trim())
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    const unit =
      'unit' in body && typeof (body as { unit: unknown }).unit === 'string'
        ? String((body as { unit: string }).unit)
        : 'À définir'


    const product = await db.product.create({
      data: {
        name: name.trim(),
        description: 'À définir',
        price: parsedPrice,
        unit: unit.trim() || 'À définir',
        image: image.trim(),
        ingredients: (ingredients as string | null) ?? null,
        sizes: sizesArr,
        available: true,
        onOffer: false,
        originalPrice: null,
      },
      select: {
        id: true,
        name: true,
        ingredients: true,
        price: true,
        unit: true,
        image: true,
        sizes: true,
        available: true,
        onOffer: true,
        originalPrice: true,
      },
    })

    return NextResponse.json({ product })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

