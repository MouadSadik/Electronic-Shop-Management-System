'use client'

import React, { useState } from 'react'
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Trash2, Pencil, Loader2, RefreshCw } from 'lucide-react'
import useSWR from 'swr'

type Categorie = {
  id: number
  nom: string
}

// Fetcher function for categories
const fetcher = async (url: string): Promise<Categorie[]> => {
  const res = await fetch(url)
  const data = await res.json()

  if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement.')
  return data.categorie || []
}

const ListCategories = () => {
  const { data: categories, error, isLoading, mutate: mutateCategories } = useSWR<Categorie[]>(
    '/api/categories',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  )

  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editCategorie, setEditCategorie] = useState<Categorie | null>(null)
  const [editNom, setEditNom] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Clear messages after timeout
  React.useEffect(() => {
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('')
        setSuccessMsg('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMsg, successMsg])

  const handleDelete = async (id: number) => {
    setErrorMsg('')
    setSuccessMsg('')
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Erreur de suppression.')
      } else {
        // Optimistic update - remove from cache immediately
        await mutateCategories(
          (currentData) => currentData?.filter((cat) => cat.id !== id),
          false // Don't revalidate immediately
        )

        // Revalidate after optimistic update
        await mutateCategories()

        setSuccessMsg('Catégorie supprimée avec succès.')
      }
    } catch (err) {
      setErrorMsg(`Erreur serveur lors de la suppression. ${err instanceof Error ? err.message : String(err)}`)
      // Revalidate to ensure data consistency
      await mutateCategories()
    } finally {
      setDeleteId(null)
      setIsDeleting(false)
    }
  }

  const handleUpdate = async () => {
    if (!editCategorie || !editNom.trim()) return

    setErrorMsg('')
    setSuccessMsg('')
    setIsUpdating(true)

    try {
      const res = await fetch(`/api/categories/${editCategorie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: editNom.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Erreur de mise à jour.')
      } else {
        // Optimistic update
        await mutateCategories(
          (currentData) =>
            currentData?.map((c) =>
              c.id === data.categorie.id ? data.categorie : c
            ),
          false // Don't revalidate immediately
        )

        // Revalidate after optimistic update
        await mutateCategories()

        setSuccessMsg('Catégorie mise à jour avec succès.')
        setEditCategorie(null)
        setEditNom('')
        setIsDialogOpen(false)
      }
    } catch (err) {
      setErrorMsg(`Erreur serveur lors de la mise à jour. ${err instanceof Error ? err.message : String(err)}`)
      // Revalidate to ensure data consistency
      await mutateCategories()
    } finally {
      setIsUpdating(false)
    }
  }

  const openEditDialog = (cat: Categorie) => {
    setEditCategorie(cat)
    setEditNom(cat.nom)
    setIsDialogOpen(true)
    setErrorMsg('')
    setSuccessMsg('')
  }

  const closeEditDialog = () => {
    setEditCategorie(null)
    setEditNom('')
    setIsDialogOpen(false)
    setErrorMsg('')
    setSuccessMsg('')
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-6 p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p className="text-sm text-muted-foreground">Chargement des catégories...</p>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="mt-6">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {error.message || 'Erreur lors du chargement des catégories.'}
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => mutateCategories()}
            >
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Handle empty state
  if (!categories || categories.length === 0) {
    return (
      <div className="mt-6 text-center p-8">
        <p className="text-sm text-muted-foreground">Aucune catégorie trouvée.</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => mutateCategories()}
        >
          Actualiser
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-6">
      {/* Messages */}
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

      {/* Header with title and refresh button */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Catégories ({categories.length})</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => mutateCategories()}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Catégorie #{cat.id}</CardTitle>
              <div className="flex items-center gap-2">
                {/* Edit Dialog */}
                <Dialog open={isDialogOpen && editCategorie?.id === cat.id} onOpenChange={(open) => {
                  if (!open) closeEditDialog()
                }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(cat)}
                      disabled={isUpdating || isDeleting}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier Catégorie</DialogTitle>
                      <DialogDescription>
                        Modifiez le nom de la catégorie ci-dessous.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Input
                        value={editNom}
                        onChange={(e) => setEditNom(e.target.value)}
                        placeholder="Nom de catégorie"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isUpdating) {
                            handleUpdate()
                          }
                        }}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={closeEditDialog}
                        disabled={isUpdating}
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={handleUpdate}
                        disabled={isUpdating || !editNom.trim()}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Mise à jour...
                          </>
                        ) : (
                          'Enregistrer'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setDeleteId(cat.id)}
                      disabled={isUpdating || isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer la catégorie &ldquo;<strong>{cat.nom}</strong>&rdquo; ?
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>
                        Annuler
                      </AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={() => deleteId && handleDelete(deleteId)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Suppression...
                          </>
                        ) : (
                          'Supprimer'
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Nom:</span> {cat.nom}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ListCategories