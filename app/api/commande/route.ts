import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { stat } from 'fs'

export async function POST(req: Request) {
    const supabase = createClient()
    const { data: { user }, error: authError } = await (await supabase).auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const { produitId } = body

    if (!produitId) {
        return NextResponse.json({ error: 'Produit manquant' }, { status: 400 })
    }

    try {
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { supabase_user_id: user.id }
        })

        if (!utilisateur) {
            return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
        }

        const client = await prisma.client.findUnique({
            where: { utilisateur_id: utilisateur.id }
        })

        if (!client) {
            return NextResponse.json({ error: 'Client introuvable' }, { status: 404 })
        }

        // Verifie si une commande "Devis" existe deja pour ce client
        let commande = await prisma.commande.findFirst({
            where: { client_id: client.id, status: 'DEVIS' }
        })
        // Sinon, creer une commande "Devis"
        if (!commande) {
            commande = await prisma.commande.create({
                data: { client_id: client.id, status: 'DEVIS' }
            })
        }

        // Recuperer le produit a ajouter
        const produit = await prisma.produit.findUnique({
            where: { id: produitId }
        })
        if (!produit) {
            return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })
        }

        // Verifier si le produit est deja dans la commande
        const ligneExistante = await prisma.ligneCommande.findFirst({
            where: { commande_id: commande.id, produit_id: produit.id
            }
        })

        if (ligneExistante) {
            // Produit deja dans le panier -> incrimenter la quantite
            await prisma.ligneCommande.update({
                where: { id: ligneExistante.id },
                data: {
                    quantite: ligneExistante.quantite + 1
                }
            })
        } else {
            // Sinon, ajouter une nouvelle ligne
            await prisma.ligneCommande.create({
                data: {
                    commande_id: commande.id,
                    produit_id: produit.id,
                    quantite: 1,
                    prix_unitaire: produit.prix
                }
            })
        }
 
        return NextResponse.json({ message: 'Produit ajouté au panier.' })
    } catch (error) {
        console.error('Erreur ajout panier:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}

//get pour obtenir tout les commandes pour afficher a l'admin
export async function GET() {
  const supabase = createClient()
  const { data: { user }, error: authError, } = await (await supabase).auth.getUser()

  if (!user || authError) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const commandes = await prisma.commande.findMany({
      include: {
        client: {
          include: {
            utilisateur: true,
          },
        },
        LigneCommande: {
          include: {
            produit: true,
          },
        },
      },
      orderBy: { date_creation: 'desc' },
    })

    return NextResponse.json({ commandes }, { status: 201 })
  } catch (err) {
    console.error('Erreur de récupération des commandes', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
