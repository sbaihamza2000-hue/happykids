import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { db } from '@/lib/db'

function hashBuffer(buffer: Buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

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

  const url = new URL(request.url)
  const source = url.searchParams.get('source') || 'whatsapp'
  const downloadDir = path.join(process.cwd(), 'download', 'images')

  const sourceDir =
    source === 'download'
      ? downloadDir
      : process.env.WHATSAPP_IMAGES_PATH ||
        'C:\\\\Users\\\\sbaih\\\\Downloads\\\\WhatsApp Unknown 2026-04-03 at 7.37.40 AM'

  const destDir = path.join(process.cwd(), 'public', 'images', 'imported')

  try {
    await fs.mkdir(destDir, { recursive: true })

    const existingIds = new Set(
      (await db.product.findMany({ select: { id: true } })).map((p) => p.id)
    )

    const entries = await fs.readdir(sourceDir, { withFileTypes: true })
    const allFiles = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
      .sort((a, b) => a.localeCompare(b))

    const logoFiles =
      source === 'download'
        ? allFiles.filter((name) => /^logo\.(jpe?g|png|webp)$/i.test(name))
        : []

    let logoCopied = false
    if (logoFiles.length > 0) {
      try {
        const logoPath = path.join(sourceDir, logoFiles[0])
        const buffer = await fs.readFile(logoPath)
        const publicLogoPath = path.join(process.cwd(), 'public', 'images', 'logo.jpg')
        await fs.writeFile(publicLogoPath, buffer)
        logoCopied = true
      } catch {
      }
    }

    const files =
      source === 'download'
        ? allFiles.filter((name) => !/^logo\.(jpe?g|png|webp)$/i.test(name))
        : allFiles

    const seen = new Set<string>()
    const imported: Array<{
      id: string
      image: string
      name: string
    }> = []

    let deletedDuplicates = 0
    let deletedAlreadyInDb = 0
    let skippedAlreadyInDb = 0

    for (const filename of files) {
      const srcPath = path.join(sourceDir, filename)
      const buffer = await fs.readFile(srcPath)
      const hash = hashBuffer(buffer)
      if (seen.has(hash)) {
        if (source === 'download') {
          try {
            await fs.unlink(srcPath)
            deletedDuplicates += 1
          } catch {
          }
        }
        continue
      }
      seen.add(hash)

      const short = hash.slice(0, 12)
      const destFileName = `import-${short}.jpg`
      const destPath = path.join(destDir, destFileName)

      const id = `import-${short}`
      const alreadyInDb = existingIds.has(id)

      try {
        await fs.access(destPath)
      } catch {
        await fs.writeFile(destPath, buffer)
      }

      if (alreadyInDb) {
        skippedAlreadyInDb += 1
        if (source === 'download') {
          try {
            await fs.unlink(srcPath)
            deletedAlreadyInDb += 1
          } catch {
          }
        }
        continue
      }

      imported.push({
        id,
        image: `/images/imported/${destFileName}`,
        name: `Produit ${imported.length + 1}`,
      })
    }

    await db.$transaction(
      imported.map((p) =>
        db.product.upsert({
          where: { id: p.id },
          create: {
            id: p.id,
            name: p.name,
            description: 'À définir',
            ingredients: 'À définir',
            price: 0,
            unit: 'À définir',
            image: p.image,
            available: true,
          },
          update: {
            image: p.image,
          },
        })
      )
    )

    return NextResponse.json({
      sourceDir,
      source,
      importedCount: imported.length,
      skippedAlreadyInDb,
      deletedDuplicates,
      deletedAlreadyInDb,
      logoCopied,
      ids: imported.map((p) => p.id),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Import failed',
        sourceDir,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
