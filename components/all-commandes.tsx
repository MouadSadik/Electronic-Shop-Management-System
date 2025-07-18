'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from './ui/skeleton'



type Client = {
    id: string
    utilisateur: Utilisateur
}

type LigneCommande = {
    id: string
    produit: Produit
    quantite: number
    prix_unitaire: number
}

type Commande = {
    id: string
    client: Client
    date_creation: string
    LigneCommande: LigneCommande[]
}

const AllCommandes = () => {
    const [commandes, setCommandes] = useState<Commande[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchCommandes = async () => {
            try {
                const res = await fetch('/api/commande')
                const data = await res.json()
                if (res.ok) {
                    setCommandes(data.commandes || [])
                } else {
                    setError(data.error || 'Erreur inconnue')
                }
            } catch (err) {
                setError('Erreur lors du chargement des commandes.')
            } finally {
                setLoading(false)
            }
        }

        fetchCommandes()
    }, [])

    if (loading) return <Skeleton className='h-10 w-full'></Skeleton>
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Toutes les commandes</CardTitle>
            </CardHeader>
            <CardContent>
                {commandes.length === 0 ? ( <p>Aucune commande trouvée.</p>) : 
                (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Produits</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {commandes.map((commande) => {
                                const total = commande.LigneCommande?.reduce(
                                    (acc, ligne) => acc + ligne.prix_unitaire * ligne.quantite,
                                    0
                                ) ?? 0

                                return (
                                    <TableRow key={commande.id}>
                                        <TableCell>
                                            <Link
                                                href={`/admin/clientt/${commande.client.id}`}
                                                className="text-blue-600 underline"
                                            >
                                                {commande.client.utilisateur.nom}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{new Date(commande.date_creation).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <ul className="list-disc ml-4">
                                                {commande.LigneCommande.map((ligne) => (
                                                    <li key={ligne.id}>
                                                        {ligne.produit.nom} x {ligne.quantite}
                                                    </li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell>{total.toFixed(2)} MAD</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}

export default AllCommandes