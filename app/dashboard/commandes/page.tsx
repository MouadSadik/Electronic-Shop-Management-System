import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import React from 'react'

const statusColors: Record<string, string> = {
    DEVIS: 'bg-yellow-100 text-yellow-800',
    CONFIRMEE: 'bg-blue-100 text-blue-800',
    LIVREE: 'bg-green-100 text-green-800',
    FACTUREE: 'bg-purple-100 text-purple-800',
    ANNULEE: 'bg-red-100 text-red-800',
}

const CommandesForClient = async () => {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const utilisateur = await prisma.utilisateur.findUnique({
        where: { supabase_user_id: user.id },
    })
    if (!utilisateur) {
        return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 401 })
    }

    const client = await prisma.client.findUnique({
        where: { utilisateur_id: utilisateur.id },
    })
    if (!client) {
        return NextResponse.json({ error: "Client non trouvé" }, { status: 401 })
    }

    const commandes = await prisma.commande.findMany({
        where: { client_id: client.id },
        include: {
            LigneCommande: {
                include: { produit: true },
            }
        },
        orderBy: { date_creation: 'desc' }
    })

    return (
        <Card className="mt-10">
            <CardHeader>
                <CardTitle className="text-primary">Toutes mes Commandes</CardTitle>
            </CardHeader>
            <CardContent>
                {commandes.length === 0 ? (
                    <p className="text-s">Vous n’avez passé aucune commande.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="text-secondary">
                                <TableHead>Commande</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Produits</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {commandes.map((commande) => {
                                const total = commande.LigneCommande.reduce(
                                    (sum, p) => sum + p.produit.prix * p.quantite,
                                    0
                                )
                                return (
                                    <TableRow key={commande.id}>
                                        <TableCell className="font-medium">#{commande.id}</TableCell>
                                        <TableCell>{new Date(commande.date_creation).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <ul className="text-sm  list-disc ml-4">
                                                {commande.LigneCommande.map((p) => (
                                                    <li key={p.id}>{p.produit.nom} x{p.quantite}</li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell>{total.toFixed(2)} DH</TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[commande.status] || ''}>
                                                {commande.status}
                                            </Badge>
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

export default CommandesForClient