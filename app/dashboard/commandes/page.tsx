import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import React from 'react'

const CommandesForClient = async () => {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: "Non autorize" }, { status: 401 })
    }

    const utilisateur = await prisma.utilisateur.findUnique({
        where: { supabase_user_id: user.id },
    })
    if (!utilisateur) {
        return NextResponse.json({ error: "Utilisateur non trouve" }, { status: 401 })
    }

    const client = await prisma.client.findUnique({
        where: { utilisateur_id: utilisateur.id },
        include: {
            utilisateur: true,
            commande: true,
        },
    })
    if (!client) {
        return NextResponse.json({ error: "Client non trouve" }, { status: 401 })
    }

    const commandes = await prisma.commande.findMany({
        where: { client_id: client.id },
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mes Commandes</CardTitle>
            </CardHeader>
            <CardContent>
                {commandes.length == 0 ? (<p>Vous n’a passé aucune commande.</p>) :
                    (
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {commandes.map((commande) => (
                                <li key={commande.id}>
                                    Commande #{commande.id} –
                                    <span className="italic">{commande.status}</span>
                                    – {new Date(commande.date_creation).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    )}
            </CardContent>
        </Card>
    )
}

export default CommandesForClient