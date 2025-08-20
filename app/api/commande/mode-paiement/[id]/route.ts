import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT( req: Request, { params }: { params: Promise<{ id: string }> } ) {
  try {
    const { mode_paiement } = await req.json()
    const resolvedParams = await params
    const commandeId = parseInt(resolvedParams.id)

    if (!mode_paiement) {
      return NextResponse.json({ error: 'Mode de paiement requis' }, { status: 400 })
    }

    const commande = await prisma.commande.update({
      where: { id: commandeId },
      data: { mode_paiement },
    })

    return NextResponse.json( { message: 'Mode de paiement mis à jour', commande }, { status: 200 } )
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mode de paiement :', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}   