import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user }, error: authError, } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const resolvedParams = await params
  const id = Number(resolvedParams.id) 

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
  }

  const body = await req.json()
  const { nom } = body

  if (nom === undefined) {
    return NextResponse.json({ error: 'Le nom pas fourni pour la mise à jour.' }, { status: 400 }
    )
  }
  try {
    const categorie = await prisma.categorie.update({
      where: { id },
      data: { nom },
    })
    return NextResponse.json({ categorie }, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

//delete
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user }, error: authError, } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const resolvedParams = await params
  const id = Number(resolvedParams.id)
  
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Id invalid' }, { status: 400 })
  }

  try {
    const deletedCategorie = await prisma.categorie.delete({
      where: { id },
    })
    return NextResponse.json({ categorie: deletedCategorie }, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la suppression de produit:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}