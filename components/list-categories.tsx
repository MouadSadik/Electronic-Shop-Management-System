'use client'

import React, { useEffect, useState } from 'react'
import {
  Card, CardContent, CardHeader, CardTitle, } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Alert, AlertDescription, } from '@/components/ui/alert'
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger, } from '@/components/ui/alert-dialog'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger, } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Trash2, Pencil } from 'lucide-react'

type Categorie = {
  id: number
  nom: string
}

const ListCategories = () => {
  const [categories, setCategories] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editCategorie, setEditCategorie] = useState<Categorie | null>(null)
  const [editNom, setEditNom] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (!res.ok) {
          setErrorMsg(data.error || 'Erreur lors du chargement.')
        } else {
          setCategories(data.categorie || [])
        }
      } catch (err) {
        setErrorMsg('Erreur de connexion au serveur.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleDelete = async (id: number) => {
    setErrorMsg('')
    setSuccessMsg('')
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Erreur de suppression.')
      } else {
        setCategories(categories.filter((cat) => cat.id !== id))
        setSuccessMsg('Catégorie supprimée avec succès.')
      }
    } catch (err) {
      setErrorMsg('Erreur serveur lors de la suppression.')
    } finally {
      setDeleteId(null)
    }
  }

  const handleUpdate = async () => {
    if (!editCategorie) return
    try {
      const res = await fetch(`/api/categories/${editCategorie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: editNom }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Erreur de mise à jour.')
      } else {
        setCategories((prev) =>
          prev.map((c) => (c.id === data.categorie.id ? data.categorie : c))
        )
        setSuccessMsg('Catégorie mise à jour avec succès.')
        setEditCategorie(null)
        setEditNom('')
      }
    } catch (err) {
      setErrorMsg('Erreur serveur lors de la mise à jour.')
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Chargement...</p>

  return (
    <div className="mt-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardHeader className="flex items-center justify-between space-x-2">
              <CardTitle className="text-base">Catégorie #{cat.id}</CardTitle>
              <div className="flex items-center gap-2">
                {/* Modifier */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon"
                      onClick={() => {
                        setEditCategorie(cat)
                        setEditNom(cat.nom)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier Catégorie</DialogTitle>
                    </DialogHeader>
                    <Input
                      value={editNom}
                      onChange={(e) => setEditNom(e.target.value)}
                      placeholder="Nom de catégorie"
                    />
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setEditCategorie(null)}>Annuler</Button>
                      <Button onClick={handleUpdate}>Enregistrer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Supprimer */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setDeleteId(cat.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression ?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <p className="text-sm text-muted-foreground mb-4">
                      Cette action est irréversible.
                    </p>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={() => deleteId && handleDelete(deleteId)}
                      >
                        Supprimer
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Nom: {cat.nom}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ListCategories