'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
    Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Skeleton } from './ui/skeleton'
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

const AllCommandes = () => {
    const [commandes, setCommandes] = useState<Commande[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchCommandes = async () => {
            try {
                const res = await fetch('/api/admin/commandes')
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

    const updateStatus = async (id: string, status: string) => {
        const res = await fetch(`/api/admin/commandes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        })

        if (res.ok) {
            setCommandes((prev) =>
                prev.map((cmd) => (cmd.id === id ? { ...cmd, status } : cmd))
            )
            toast.success('Statut mis à jour')
        } else {
            toast.error('Erreur lors de la mise à jour')
        }
    }

    if (loading) return <Skeleton className="h-44 w-full" />
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Toutes les commandes</CardTitle>
            </CardHeader>
            <CardContent>
                {commandes.length === 0 ? (
                    <p>Aucune commande trouvée.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Produits</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Paiement</TableHead>
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
                                                className="text-blue-600 underline"
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
                                                            className="text-blue-600 underline"
                                                        >
                                                            {ligne.produit.nom} x {ligne.quantite}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell>{total.toFixed(2)} MAD</TableCell>
                                        <TableCell>
                                            <Select
                                                value={commande.status}
                                                onValueChange={(value) =>
                                                    updateStatus(commande.id, value)
                                                }
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
                                                    href={`/admin/facture?commandeId=${commande.id}`}
                                                    className="text-green-600 underline font-medium"
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
            </CardContent>
        </Card>
    )
}

export default AllCommandes