import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

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