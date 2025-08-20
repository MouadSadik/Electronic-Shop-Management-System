'use client'

import useSWR from 'swr'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogAction
} from '@/components/ui/alert-dialog'
import { ShoppingCart, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface LigneCommande {
  id: number
  quantite: number
  produit: {
    id: number
    nom: string
    prix: number
  }
}



const fetcher = async (url: string) => {
  const res = await fetch(url, { method: 'POST' })
  if (!res.ok) throw new Error('Erreur lors du chargement du panier')
  return res.json()
}

export default function PanierSheet() {
  const [open, setOpen] = useState(false)
  const [ligneASupprimer, setLigneASupprimer] = useState<LigneCommande | null>(null)

  const { data, error, isLoading, mutate } = useSWR(
    open ? '/api/commande/devis' : null,
    fetcher
  )

  const lignes = data?.lignes || []
  const commandeId = data?.commandeId || null

  const updateQuantite = async (ligneId: number, quantite: number) => {
    await fetch('/api/panier/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ligneCommandeId: ligneId, quantite }),
    })
    mutate() // refresh panier
  }

  const supprimer = async (ligneId: number) => {
    await fetch('/api/panier/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ligneCommandeId: ligneId }),
    })
    setLigneASupprimer(null)
    mutate() // refresh panier
  }

  const totalProduits = lignes.reduce((acc: any, l: { quantite: any }) => acc + l.quantite, 0)
  const totalPrix = lignes.reduce((acc: number, l: { quantite: number; produit: { prix: number } }) => acc + l.quantite * l.produit.prix, 0)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative">
          <ShoppingCart className="h-10 w-10" />
          {totalProduits > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {totalProduits}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-md w-full p-5">
        <SheetHeader>
          <SheetTitle>Votre Panier</SheetTitle>
          <SheetDescription>Vos produits commandes</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        ) : lignes.length === 0 ? (
          <p className="text-center py-4">Panier vide</p>
        ) : (
          <div className="space-y-4 mt-4">
            {lignes.map((ligne: LigneCommande) => (
              <div
                key={ligne.id}
                className="flex justify-between mx-5 items-center border p-2 rounded-md gap-4"
              >
                <div className="flex-1">
                  <p className="font-semibold">{ligne.produit.nom}</p>
                  <p className="text-sm text-muted-foreground">
                    {ligne.produit.prix} MAD x {ligne.quantite}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantite(ligne.id, ligne.quantite - 1)}
                    disabled={ligne.quantite <= 1}
                  >
                    -
                  </Button>
                  <span>{ligne.quantite}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantite(ligne.id, ligne.quantite + 1)}
                  >
                    +
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setLigneASupprimer(ligne)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer ce produit du panier ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter className="flex justify-end gap-2">
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (ligneASupprimer) supprimer(ligneASupprimer.id)
                          }}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                </div>
              </div>
            ))}

            <div className="text-right font-semibold text-lg border-t pt-4">
              Total : {totalPrix.toFixed(2)} MAD
            </div>

            {commandeId && (
              <Link href={`/dashboard/paiements/${commandeId}`}>
                <Button className="w-full " onClick={() => setOpen(false)}>
                  Confirmer la commande
                </Button>
              </Link>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
