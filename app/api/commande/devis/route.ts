import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { supabase_user_id: user.id },
  })

  if (!utilisateur) {
    return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
  }

  const client = await prisma.client.findUnique({
    where: { utilisateur_id: utilisateur.id },
  })

  if (!client) {
    return NextResponse.json({ error: "Client non trouvé" }, { status: 404 })
  }

  const commande = await prisma.commande.findFirst({
    where: {
      client_id: client.id,
      status: 'DEVIS',
    },
    include: {
      LigneCommande: {
        include: { produit: true },
      },
    },
  })

  if (!commande) {
    return NextResponse.json({ lignes: [], commandeId: null })
  }

  return NextResponse.json({
    lignes: commande.LigneCommande,
    commandeId: commande.id,
  })
}
