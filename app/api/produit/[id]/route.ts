import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user }, error: authError, } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { supabase_user_id: user.id },
  })

  if (!utilisateur || utilisateur.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
  }

  const body = await req.json()
  const { nom, description, prix, stock, promo, image_url, categorie_id, } = body

  if (
    nom === undefined &&
    description === undefined &&
    prix === undefined &&
    stock === undefined &&
    promo === undefined &&
    image_url === undefined &&
    categorie_id === undefined
  ) {
    return NextResponse.json(
      { error: 'Aucun champ fourni pour la mise à jour.' },
      { status: 400 }
    )
  }

  const updateData: any = {}
  if (nom !== undefined) updateData.nom = nom
  if (description !== undefined) updateData.description = description
  if (prix !== undefined) updateData.prix = parseFloat(prix)
  if (stock !== undefined) updateData.stock = parseInt(stock)
  if (promo !== undefined) updateData.promo = promo
  if (image_url !== undefined) updateData.image_url = image_url
  if (categorie_id !== undefined) updateData.categorie_id = parseInt(categorie_id)

  try {
    const produit = await prisma.produit.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json({ produit }, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

//delete
export async function DELETE(req: Request, {params}: {params: {id: string}}) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const id = Number(params.id)
    if(isNaN(id)){
        return NextResponse.json({error: 'Id invalid'}, {status: 400})
    }

    try {
        // Option 1: Check for related records before deletion
        const relatedLignes = await prisma.ligneCommande.findMany({
            where: { 
                produit_id: id
            }
        })

        if (relatedLignes.length > 0) {
            return NextResponse.json({ 
                error: 'Impossible de supprimer ce produit car il est utilisé dans des commandes existantes' 
            }, { status: 400 })
        }

        const deletedProduit = await prisma.produit.delete({
            where: { id }
        })

        return NextResponse.json({ 
            message: 'Produit supprimé avec succès',
            produit: deletedProduit 
        }, { status: 200 })

    } catch (error) {
        console.error('Erreur lors de la suppression de produit:', error)
        
        return NextResponse.json({ 
            error: 'Erreur serveur lors de la suppression',
        }, { status: 500 })
    }
}