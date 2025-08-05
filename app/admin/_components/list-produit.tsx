'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Switch } from '../../../components/ui/switch'

export default function ListProduits() {
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null)

  useEffect(() => {
    const fetchProduits = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/produit')
        const data = await res.json()

        if (!res.ok) {
          setErrorMsg(data.error || 'Erreur lors du chargement.')
        } else {
          setProduits(data.produits || [])
        }
      } catch (err) {
        setErrorMsg("Erreur de connexion au serveur.")
      } finally {
        setLoading(false)
      }
    }
    fetchProduits()
  }, [])

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
        setProduits((prev) =>
          prev.map((p) => (p.id === data.produit.id ? data.produit : p))
        )
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
        setProduits(produits.filter((p) => p.id !== id))
        setSuccessMsg('Produit supprimé avec succès.')
      }
    } catch (err) {
      setErrorMsg("Erreur serveur lors de la suppression.")
    }
  }
  

  return (
    <Card className="max-w-5xl mx-auto mt-6 mb-10">
      <CardHeader>
        <CardTitle>Liste des Produits</CardTitle>
      </CardHeader>
      <CardContent>
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

        {loading ? (<p>Chargement...</p>) : (
          <Table>
            <TableHeader>
              <TableRow >
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
              {produits.map((produit) => (
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
                  <TableCell >
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
            className="mt-8 space-y-4"
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
      </CardContent>
    </Card>
  )
}
