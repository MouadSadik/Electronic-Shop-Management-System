import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const { ligneCommandeId } = body

    if (!ligneCommandeId) {
        return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }

    try {
        await prisma.ligneCommande.delete({
            where: { id: ligneCommandeId },
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: 'Erreur serveur' + err}, { status: 500 })
    }
}