import { NextResponse } from 'next/server'
import crypto from 'node:crypto'

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

function hashBuffer(buffer: Buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

function sha1(input: string) {
  return crypto.createHash('sha1').update(input).digest('hex')
}

export async function POST(request: Request) {
  const auth = requireAdmin(request)
  if (auth) return auth

  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    if (buffer.length === 0) {
      return NextResponse.json({ error: 'Empty file' }, { status: 400 })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary env not configured' },
        { status: 500 }
      )
    }

    const hash = hashBuffer(buffer)
    const short = hash.slice(0, 12)

    const timestamp = Math.floor(Date.now() / 1000)
    const folder = 'happy-kids'
    const publicId = `upload-${short}`

    const signature = sha1(
      [`folder=${folder}`, `public_id=${publicId}`, `timestamp=${timestamp}`].join('&') +
        apiSecret
    )

    const formData = new FormData()
    formData.set('file', file)
    formData.set('api_key', apiKey)
    formData.set('timestamp', String(timestamp))
    formData.set('folder', folder)
    formData.set('public_id', publicId)
    formData.set('signature', signature)

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const uploadData: unknown = await uploadRes.json().catch(() => ({}))
    const secureUrl =
      typeof uploadData === 'object' &&
      uploadData !== null &&
      'secure_url' in uploadData &&
      typeof (uploadData as { secure_url: unknown }).secure_url === 'string'
        ? (uploadData as { secure_url: string }).secure_url
        : ''

    if (!uploadRes.ok || !secureUrl) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    return NextResponse.json({ image: secureUrl })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

