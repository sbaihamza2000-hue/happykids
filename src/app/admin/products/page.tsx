'use client'

import { useCallback, useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'
import { CartSidebar } from '@/components/site/cart-sidebar'

type Product = {
  id: string
  name: string
  description: string
  ingredients?: string | null
  price: number
  onOffer: boolean
  originalPrice?: number | null
  unit: string
  image: string
  available: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [creating, setCreating] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPrice, setNewPrice] = useState<string>('')
  const [newImage, setNewImage] = useState<string>('')
  const [newFile, setNewFile] = useState<File | null>(null)
  const { toast } = useToast()

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/products', { cache: 'no-store' })
      const data: unknown = await response.json()
      if (
        typeof data === 'object' &&
        data !== null &&
        'products' in data &&
        Array.isArray((data as { products: unknown }).products)
      ) {
        setProducts(
          (data as { products: Array<Product & { onOffer?: unknown; originalPrice?: unknown }> })
            .products
            .map((p) => ({
              ...p,
              onOffer: typeof p.onOffer === 'boolean' ? p.onOffer : false,
              originalPrice:
                typeof p.originalPrice === 'number' ? p.originalPrice : null,
            }))
        )
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les produits' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('admin_password')
      if (stored) setAdminPassword(stored)
    } catch {
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const updateLocalProduct = (id: string, patch: Partial<Product>) => {
    setProducts((curr) => curr.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  async function toggleAvailability(id: string, nextValue: boolean) {
    const provided = adminPassword.trim()
    if (!provided) {
      toast({ title: 'Mot de passe requis', description: 'Entrez le mot de passe admin.' })
      return
    }

    setSavingId(id)
    const prev = products
    setProducts((curr) => curr.map((p) => (p.id === id ? { ...p, available: nextValue } : p)))
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': provided,
        },
        body: JSON.stringify({ available: nextValue }),
      })
      if (!res.ok) {
        throw new Error('failed')
      }
      toast({
        title: 'Sauvegardé',
        description: nextValue ? 'Produit marqué disponible' : 'Produit marqué indisponible',
      })
    } catch {
      setProducts(prev)
      toast({ title: 'Erreur', description: 'La mise à jour a échoué' })
    } finally {
      setSavingId(null)
    }
  }

  async function importFromDownloadImages() {
    const provided = adminPassword.trim()
    if (!provided) {
      toast({ title: 'Mot de passe requis', description: 'Entrez le mot de passe admin.' })
      return
    }

    setImporting(true)
    try {
      const res = await fetch('/api/admin/import-whatsapp?source=download', {
        headers: { 'x-admin-password': provided },
        cache: 'no-store',
      })
      const data: unknown = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error('failed')
      }

      const importedCount =
        typeof data === 'object' && data !== null && 'importedCount' in data
          ? Number((data as { importedCount: unknown }).importedCount)
          : 0

      const deletedDuplicates =
        typeof data === 'object' && data !== null && 'deletedDuplicates' in data
          ? Number((data as { deletedDuplicates: unknown }).deletedDuplicates)
          : 0

      const deletedAlreadyInDb =
        typeof data === 'object' && data !== null && 'deletedAlreadyInDb' in data
          ? Number((data as { deletedAlreadyInDb: unknown }).deletedAlreadyInDb)
          : 0

      const logoCopied =
        typeof data === 'object' && data !== null && 'logoCopied' in data
          ? Boolean((data as { logoCopied: unknown }).logoCopied)
          : false

      toast({
        title: 'Import terminé',
        description: `Nouveaux: ${importedCount} • Duplicatas supprimés: ${deletedDuplicates + deletedAlreadyInDb}${logoCopied ? ' • Logo mis à jour' : ''}`,
      })

      await load()
    } catch {
      toast({ title: 'Erreur', description: "Impossible d'importer depuis download/images" })
    } finally {
      setImporting(false)
    }
  }

  async function uploadImage(file: File) {
    const provided = adminPassword.trim()
    if (!provided) {
      toast({ title: 'Mot de passe requis', description: 'Entrez le mot de passe admin.' })
      return null
    }

    const form = new FormData()
    form.set('file', file)

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'x-admin-password': provided },
      body: form,
    })
    const data: unknown = await res.json().catch(() => ({}))
    if (!res.ok) {
      return null
    }
    const image =
      typeof data === 'object' && data !== null && 'image' in data
        ? String((data as { image: unknown }).image)
        : ''
    return image || null
  }

  async function createProduct() {
    const provided = adminPassword.trim()
    if (!provided) {
      toast({ title: 'Mot de passe requis', description: 'Entrez le mot de passe admin.' })
      return
    }

    const name = newName.trim()
    const description = newDescription.trim()
    const price = Number(String(newPrice).trim())

    if (!description || !Number.isFinite(price) || price < 0) {
      toast({
        title: 'Champs requis',
        description: 'Description et prix sont obligatoires.',
      })
      return
    }

    let image = newImage.trim()
    if (!image && newFile) {
      const uploaded = await uploadImage(newFile)
      if (!uploaded) {
        toast({ title: 'Erreur', description: "Impossible d'uploader l'image" })
        return
      }
      image = uploaded
    }

    if (!image) {
      toast({
        title: 'Champs requis',
        description: "L'image est obligatoire.",
      })
      return
    }

    setCreating(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': provided,
        },
        body: JSON.stringify({
          name: name || 'Nouveau produit',
          description,
          price,
          image,
        }),
      })
      const data: unknown = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error('failed')

      const product =
        typeof data === 'object' && data !== null && 'product' in data
          ? (data as { product: Product }).product
          : null

      if (product) {
        setProducts((curr) => [product, ...curr])
      } else {
        await load()
      }

      setNewName('')
      setNewDescription('')
      setNewPrice('')
      setNewImage('')
      setNewFile(null)

      toast({ title: 'Créé', description: 'Produit ajouté.' })
    } catch {
      toast({ title: 'Erreur', description: 'Création échouée.' })
    } finally {
      setCreating(false)
    }
  }

  async function saveProduct(id: string) {
    const provided = adminPassword.trim()
    if (!provided) {
      toast({ title: 'Mot de passe requis', description: 'Entrez le mot de passe admin.' })
      return
    }

    const p = products.find((x) => x.id === id)
    if (!p) return

    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': provided,
        },
        body: JSON.stringify({
          name: p.name,
          description: p.description,
          price: p.price,
          onOffer: p.onOffer,
          originalPrice: p.onOffer ? p.originalPrice ?? null : null,
          image: p.image,
        }),
      })
      if (!res.ok) throw new Error('failed')

      toast({ title: 'Sauvegardé', description: 'Modifications enregistrées.' })
    } catch {
      toast({ title: 'Erreur', description: 'Sauvegarde échouée.' })
    } finally {
      setSavingId(null)
    }
  }

  async function removeProduct(id: string) {
    const provided = adminPassword.trim()
    if (!provided) {
      toast({ title: 'Mot de passe requis', description: 'Entrez le mot de passe admin.' })
      return
    }

    const p = products.find((x) => x.id === id)
    const ok = window.confirm(
      `Supprimer définitivement ce produit ?\n\n${p?.name ?? id}`
    )
    if (!ok) return

    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': provided },
      })
      if (!res.ok) throw new Error('failed')
      setProducts((curr) => curr.filter((x) => x.id !== id))
      toast({ title: 'Supprimé', description: 'Produit supprimé.' })
    } catch {
      toast({ title: 'Erreur', description: 'Suppression échouée.' })
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-pink/20 text-pink border-pink/30 px-4 py-1 text-sm font-semibold">
              Admin
            </Badge>
            <h1
              className="text-3xl font-bold text-dark-brown sm:text-4xl md:text-5xl mb-4"
              style={{ fontFamily: 'var(--font-fredoka)' }}
            >
              Gestion des Produits
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Modifiez nom, description, prix, promo et disponibilité. Les changements sont enregistrés dans la base.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button variant="outline" onClick={load} disabled={loading}>
                Actualiser
              </Button>
              <Button
                variant="outline"
                onClick={importFromDownloadImages}
                disabled={!adminPassword.trim() || importing}
              >
                {importing ? 'Import...' : 'Importer download/images'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <Card className="border-none shadow-lg bg-white lg:col-span-1">
              <CardHeader>
                <CardTitle
                  className="text-lg font-bold text-dark-brown"
                  style={{ fontFamily: 'var(--font-fredoka)' }}
                >
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Mot de passe admin</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      const next = e.target.value
                      setAdminPassword(next)
                      try {
                        sessionStorage.setItem('admin_password', next)
                      } catch {
                      }
                    }}
                  />
                </div>
                <Badge className={adminPassword.trim() ? 'bg-green-600 text-white' : 'bg-muted'}>
                  {adminPassword.trim() ? 'Déverrouillé' : 'Verrouillé'}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle
                  className="text-lg font-bold text-dark-brown"
                  style={{ fontFamily: 'var(--font-fredoka)' }}
                >
                  Ajouter un produit
                </CardTitle>
                <Button onClick={createProduct} disabled={!adminPassword.trim() || creating}>
                  {creating ? 'Création...' : 'Créer'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-name">Nom</Label>
                    <Input
                      id="new-name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Nom du produit"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-price">Prix *</Label>
                    <Input
                      id="new-price"
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="new-description">Description *</Label>
                    <Textarea
                      id="new-description"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Description du produit"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="new-image">Image (URL)</Label>
                    <Input
                      id="new-image"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="/images/..."
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="new-file">Ou uploader une image *</Label>
                    <Input
                      id="new-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null
                        setNewFile(file)
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Image obligatoire (URL ou fichier).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground">Chargement...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-muted-foreground">Aucun produit</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {products.map((p) => (
                <Card key={p.id} className="border-none shadow-lg bg-white overflow-hidden">
                  <div className="flex gap-4 p-5">
                    <img
                      src={p.image}
                      alt={p.name}
                      onError={(e) => {
                        e.currentTarget.src = '/images/logo.png'
                      }}
                      className="size-24 rounded-2xl object-cover bg-cream"
                    />
                    <div className="flex-1">
                      <CardHeader className="p-0">
                        <CardTitle className="text-base">
                          <div className="space-y-1">
                            <Label htmlFor={`name-${p.id}`}>Nom</Label>
                            <Input
                              id={`name-${p.id}`}
                              value={p.name}
                              onChange={(e) => updateLocalProduct(p.id, { name: e.target.value })}
                              disabled={!adminPassword.trim()}
                            />
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 pt-3 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`image-${p.id}`}>Image (URL)</Label>
                          <Input
                            id={`image-${p.id}`}
                            value={p.image}
                            onChange={(e) => updateLocalProduct(p.id, { image: e.target.value })}
                            disabled={!adminPassword.trim()}
                          />
                          <Input
                            id={`image-file-${p.id}`}
                            type="file"
                            accept="image/*"
                            disabled={!adminPassword.trim() || savingId === p.id}
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              const url = await uploadImage(file)
                              if (!url) {
                                toast({
                                  title: 'Erreur',
                                  description: "Impossible d'uploader l'image",
                                })
                                return
                              }
                              updateLocalProduct(p.id, { image: url })
                              toast({ title: 'Image mise à jour', description: 'N’oubliez pas de sauvegarder.' })
                            }}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={p.available ? 'bg-green-600 text-white' : 'bg-muted'}>
                            {p.available ? 'Disponible' : 'Indisponible'}
                          </Badge>
                          <Switch
                            checked={p.available}
                            onCheckedChange={(checked) => toggleAvailability(p.id, Boolean(checked))}
                            disabled={savingId === p.id || !adminPassword.trim()}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor={`price-${p.id}`}>Prix</Label>
                            <Input
                              id={`price-${p.id}`}
                              type="number"
                              value={String(p.price)}
                              min={0}
                              onChange={(e) => {
                                const next = Number(e.target.value)
                                updateLocalProduct(p.id, { price: Number.isFinite(next) ? next : 0 })
                              }}
                              disabled={!adminPassword.trim()}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Offre</Label>
                            <div className="flex items-center gap-2 h-9">
                              <Switch
                                checked={p.onOffer}
                                onCheckedChange={(checked) =>
                                  updateLocalProduct(p.id, {
                                    onOffer: Boolean(checked),
                                    originalPrice: Boolean(checked) ? p.originalPrice ?? p.price : null,
                                  })
                                }
                                disabled={!adminPassword.trim()}
                              />
                              <Badge className={p.onOffer ? 'bg-warm-orange text-white' : 'bg-muted'}>
                                {p.onOffer ? 'Promo' : 'Normal'}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <Label htmlFor={`original-${p.id}`}>Ancien prix</Label>
                            <Input
                              id={`original-${p.id}`}
                              type="number"
                              value={p.originalPrice ?? ''}
                              min={0}
                              onChange={(e) => {
                                const raw = e.target.value
                                const next = raw === '' ? null : Number(raw)
                                updateLocalProduct(p.id, {
                                  originalPrice: next !== null && Number.isFinite(next) ? next : null,
                                })
                              }}
                              disabled={!adminPassword.trim() || !p.onOffer}
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <Label htmlFor={`desc-${p.id}`}>Description</Label>
                            <Textarea
                              id={`desc-${p.id}`}
                              value={p.description}
                              onChange={(e) => updateLocalProduct(p.id, { description: e.target.value })}
                              rows={3}
                              disabled={!adminPassword.trim()}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs text-muted-foreground">{p.unit}</p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              onClick={() => saveProduct(p.id)}
                              disabled={!adminPassword.trim() || savingId === p.id}
                            >
                              {savingId === p.id ? 'Sauvegarde...' : 'Sauvegarder'}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => removeProduct(p.id)}
                              disabled={!adminPassword.trim() || savingId === p.id}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer showWhatsApp={false} />
      <CartSidebar />
    </div>
  )
}
