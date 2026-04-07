import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
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

    const { id } = await context.params
    if (!id) {
      return NextResponse.json({ error: 'Missing product id' }, { status: 400 })
    }

    const body: unknown = await request.json()
    if (
      !body ||
      typeof body !== 'object' ||
      !('available' in body) ||
      typeof (body as { available: unknown }).available !== 'boolean'
    ) {
      return NextResponse.json(
        { error: 'Body must include boolean "available"' },
        { status: 400 }
      )
    }

    const available = (body as { available: boolean }).available

    const product = await db.product.update({
      where: { id },
      data: { available },
      select: { id: true, available: true },
    })

    return NextResponse.json({ product })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
