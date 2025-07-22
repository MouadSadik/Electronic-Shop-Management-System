//POST to add adresse
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const utilisateur = await prisma.utilisateur.findUnique({
        where: { supabase_user_id: user.id },
    })

    if (!utilisateur) {
        return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    const body = await req.json()
    const nouvelleAdresse = body.adresse

    if (!nouvelleAdresse) {
        return NextResponse.json({ error: 'Adresse manquante' }, { status: 400 })
    }   

    const updatedClient = await prisma.client.update({
        where: { utilisateur_id: utilisateur.id },
        data: { adresse: nouvelleAdresse },
    })

    return NextResponse.json({ client: updatedClient })
}