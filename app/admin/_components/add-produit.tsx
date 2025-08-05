'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'

const AddProduit = () => {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [prix, setPrix] = useState(0)
  const [stock, setStock] = useState(0)
  const [promo, setPromo] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [categorieId, setCategorieId] = useState(1)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('produit-image')
      .upload(fileName, file)

    if (error) throw new Error("Erreur upload: " + error.message)

    const { data: publicUrlData } = supabase.storage
      .from('produit-image')
      .getPublicUrl(fileName)

    if (!publicUrlData?.publicUrl) throw new Error("Pas d'URL publique.")
    return publicUrlData.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      let uploadedImageUrl = imageUrl
      if (imageFile) {
        uploadedImageUrl = await uploadImage(imageFile)
        setImageUrl(uploadedImageUrl)
      }

      const res = await fetch('/api/produit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom,
          description,
          prix: Number(prix),
          stock: Number(stock),
          promo,
          image_url: uploadedImageUrl,
          categorie_id: Number(categorieId),
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l’ajout.')

      setSuccessMsg('Produit ajouté avec succès !')

      // Réinitialisation des champs
      setNom('')
      setDescription('')
      setPrix(0)
      setStock(0)
      setPromo(false)
      setImageFile(null)
      setImageUrl('')
      setCategorieId(1)

      // Optionnel : cacher le formulaire après ajout
      setShowForm(false)
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!showForm) {
    return (
      <div className="max-w-2xl mx-auto text-center mt-10">
        <Button onClick={() => setShowForm(true)}>Ajouter Produit</Button>
      </div>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className='flex justify-between items-center'>
          <h1>
          Ajouter un produit
          </h1>
          <Button
          onClick={() => setShowForm(false)}
          className="mb-6"
        >
          Fermer
        </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className='mb-3'>Nom</Label>
            <Input value={nom} onChange={(e) => setNom(e.target.value)} required />
          </div>

          <div>
            <Label className='mb-3'>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <Label className='mb-3'>Prix</Label>
              <Input
                type="number"
                value={prix}
                onChange={(e) => setPrix(Number(e.target.value))}
                required
              />
            </div>
            <div className="w-1/2">
              <Label className='mb-3'>Stock</Label>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label className='mb-3'>Promo</Label>
            <Switch checked={promo} onCheckedChange={setPromo} />
          </div>

          <div>
            <Label className='mb-3'>Image</Label>
            <Input
              className='h-40'
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <Label className='mb-3'>ID Catégorie</Label>
            <Input
              type="number"
              value={categorieId}
              onChange={(e) => setCategorieId(Number(e.target.value))}
              required
            />
          </div>

          {errorMsg && (
            <Alert variant="destructive">
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}
          {successMsg && (
            <Alert variant="default">
              <AlertDescription>{successMsg}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Ajout en cours...' : 'Ajouter'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddProduit
