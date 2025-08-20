// /app/api/facture/route.ts

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { commandeId } = body

  try {
    // Recuperer la commande avec ses lignes
    const commande = await prisma.commande.findUnique({
      where: { id: commandeId },
      include: { LigneCommande: true },
    })

    if (!commande) {
      return NextResponse.json({ message: 'Commande non trouvée' }, { status: 404 })
    }

    // Calcul du total
    const total = commande.LigneCommande.reduce(
      (acc, ligne) => acc + ligne.quantite * ligne.prix_unitaire,
      0
    )

    // Creation de la facture + lien avec commande
    const facture = await prisma.$transaction(async (tx) => {
      const createdFacture = await tx.facture.create({
        data: {
          numero: `FAC-${Date.now()}-${commandeId}`,
          date: new Date(),
          total
        }
      })

      await tx.commandeFacture.create({
        data: {
          commande_id: commandeId,
          facture_id: createdFacture.id
        }
      })

      return createdFacture
    })

    return NextResponse.json(facture, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Erreur lors de la création de la facture' },
      { status: 500 }
    )
  }
}

//get pour recuperer les factures d'un client

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 })
  }

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { supabase_user_id: user.id, },
  })
  if (!utilisateur) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
  }

  const client = await prisma.client.findUnique({
    where: { utilisateur_id: utilisateur.id,},
  })

  if (!client) {
    return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })
  }

  const factures = await prisma.facture.findMany({
    where: {
      commandes: {
        some: {
          commande: {
            client_id: client.id,
          },
        },
      },
    },
    include: {
      commandes: {
        include: {
          commande: true,
        },
      },
      paiements: true,
    },
  })

  return NextResponse.json(factures)
}