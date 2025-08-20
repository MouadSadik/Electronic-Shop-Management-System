'use client'

import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Link from 'next/link'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

type Client = {
  id: string
  utilisateur: { nom: string }
}

type LigneCommande = {
  id: string
  produit: { id: string, nom: string }
  quantite: number
  prix_unitaire: number
}

type Commande = {
  id: string
  client: Client
  date_creation: string
  status: string
  LigneCommande: LigneCommande[]
}

const statusOptions = ['DEVIS', 'CONFIRMEE', 'LIVREE', 'FACTUREE', 'ANNULEE']

// Fetcher function pour useSWR
const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors du chargement des commandes.')
  }
  
  return data.commandes || []
}

const AllCommandes = () => {
  const { data: commandes, error, isLoading } = useSWR<Commande[]>('/api/admin/commandes', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000, // 30 secondes
  })

  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const updateStatus = async (id: string, status: string) => {
    setUpdatingStatus(id)
    
    try {
      const res = await fetch(`/api/admin/commandes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        // Optimistic update du cache local
        mutate('/api/admin/commandes', (currentData: Commande[] | undefined) => {
          if (!currentData) return currentData
          return currentData.map((cmd) => (cmd.id === id ? { ...cmd, status } : cmd))
        }, false)
        
        toast.success('Statut mis à jour')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (err) {
      toast.error('Erreur lors de la mise à jour' + err)
    } finally {
      setUpdatingStatus(null)
    }
  }

  if (isLoading) return (
  <div>
<Skeleton className="h-12 w-full mb-2 mt-10" />
<Skeleton className="h-12 w-full mb-2" />
<Skeleton className="h-12 w-full" />
  </div>)
  
  if (error) {
    return (
      <div className="mt-6">
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-bold mb-6">Toutes les commandes</h1>
      
      {!commandes || commandes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aucune commande trouvée.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-primary">Client</TableHead>
              <TableHead className="text-primary">Date</TableHead>
              <TableHead className="text-primary">Produits</TableHead>
              <TableHead className="text-primary">Total</TableHead>
              <TableHead className="text-primary">Statut</TableHead>
              <TableHead className="text-primary">Paiement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commandes.map((commande) => {
              const total = commande.LigneCommande.reduce(
                (acc, ligne) =>
                  acc + ligne.prix_unitaire * ligne.quantite,
                0
              )

              return (
                <TableRow key={commande.id}>
                  <TableCell>
                    <Link
                      href={`/admin/clientt/${commande.client.id}`}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {commande.client.utilisateur.nom}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {new Date(commande.date_creation).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc ml-4">
                      {commande.LigneCommande.map((ligne) => (
                        <li key={ligne.id}>
                          <Link
                            href={`/admin/produits/${ligne.produit.id}`}
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            {ligne.produit.nom} x {ligne.quantite}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="font-medium">
                    {total.toFixed(2)} MAD
                  </TableCell>
                  <TableCell>
                    <Select
                      value={commande.status}
                      onValueChange={(value) => updateStatus(commande.id, value)}
                      disabled={updatingStatus === commande.id}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {commande.status === 'CONFIRMEE' ? (
                      <Link
                        href={`/admin/facture-paiement?commandeId=${commande.id}`}
                        className="text-green-600 underline hover:text-green-800 font-medium"
                      >
                        Ajouter Paiement
                      </Link>
                    ) : commande.status === 'FACTUREE' ? (
                      <span className="text-green-700 font-semibold">Payé</span>
                    ) : (
                      <span className="text-gray-400 italic">-</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default AllCommandes