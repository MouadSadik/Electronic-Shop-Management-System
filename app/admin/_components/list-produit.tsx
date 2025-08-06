'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Switch } from '../../../components/ui/switch'

interface Produit {
  id: number
  nom: string
  description: string
  prix: number
  stock: number
  promo: boolean
  image_url: string
}

// Fetcher function pour useSWR
const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors du chargement.')
  }
  
  return data.produits || []
}

export default function ListProduits() {
  const { data: produits, error, isLoading } = useSWR<Produit[]>('/api/produit', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
  })

  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null)

  const handleUpdate = async () => {
    if (!selectedProduit) return
    setErrorMsg('')
    setSuccessMsg('')
    
    try {
      const res = await fetch(`/api/produit/${selectedProduit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedProduit),
      })

      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Erreur inconnue')
      } else {
        setSuccessMsg('Produit mis à jour.')
        
        // Mettre à jour le cache local avec optimistic update
        mutate('/api/produit', (currentData: Produit[] | undefined) => {
          if (!currentData) return currentData
          return currentData.map((p) => (p.id === data.produit.id ? data.produit : p))
        }, false)
        
        setEditMode(false)
        setSelectedProduit(null)
      }
    } catch (err) {
      setErrorMsg("Erreur serveur lors de la mise à jour.")
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = confirm("Voulez-vous vraiment supprimer ce produit ?")
    if (!confirmed) return
    
    try { 
      const res = await fetch(`/api/produit/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      
      if (!res.ok) {
        setErrorMsg(data.error || 'Erreur de suppression.')
      } else {
        setSuccessMsg('Produit supprimé avec succès.')
        
        // Mettre à jour le cache local avec optimistic update
        mutate('/api/produit', (currentData: Produit[] | undefined) => {
          if (!currentData) return currentData
          return currentData.filter((p) => p.id !== id)
        }, false)
      }
    } catch (err) {
      setErrorMsg("Erreur serveur lors de la suppression.")
    }
  }

  // Gestion des erreurs de useSWR
  if (error) {
    return (
      <div className="max-w-5xl mx-auto mt-6 mb-10">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-10">
      <h1 className="text-2xl font-bold mb-6">Liste des Produits</h1>
      
      {errorMsg && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}
      {successMsg && (
        <Alert variant="default" className="mb-4">
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-primary'>Image</TableHead>
              <TableHead className='text-primary'>Nom</TableHead>
              <TableHead className='text-primary'>Description</TableHead>
              <TableHead className='text-primary'>Prix</TableHead>
              <TableHead className='text-primary'>Stock</TableHead>
              <TableHead className='text-primary'>Promo</TableHead>
              <TableHead className='text-primary'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produits?.map((produit) => (
              <TableRow key={produit.id}>
                <TableCell>
                  <img
                    src={produit.image_url}
                    alt={produit.nom}
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/produits/${produit.id}`}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {produit.nom}
                  </Link>
                </TableCell>
                <TableCell>{produit.description}</TableCell>
                <TableCell>{produit.prix} MAD</TableCell>
                <TableCell>{produit.stock}</TableCell>
                <TableCell>{produit.promo ? 'Oui' : 'Non'}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedProduit(produit)
                      setEditMode(true)
                    }}
                  >
                    <Pencil className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(produit.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {editMode && selectedProduit && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleUpdate()
          }}
          className="mt-8 space-y-4 border rounded-lg p-6"
        >
          <h2 className="text-xl font-bold">Modifier le produit</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nom</Label>
              <Input
                value={selectedProduit.nom}
                onChange={(e) =>
                  setSelectedProduit({ ...selectedProduit, nom: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={selectedProduit.description}
                onChange={(e) =>
                  setSelectedProduit({ ...selectedProduit, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Prix</Label>
              <Input
                type="number"
                value={selectedProduit.prix}
                onChange={(e) =>
                  setSelectedProduit({ ...selectedProduit, prix: parseFloat(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Stock</Label>
              <Input
                type="number"
                value={selectedProduit.stock}
                onChange={(e) =>
                  setSelectedProduit({ ...selectedProduit, stock: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Label>Promo</Label>
              <Switch
                checked={selectedProduit.promo}
                onCheckedChange={(val) =>
                  setSelectedProduit({ ...selectedProduit, promo: val })
                }
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit">Enregistrer</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditMode(false)
                setSelectedProduit(null)
              }}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}