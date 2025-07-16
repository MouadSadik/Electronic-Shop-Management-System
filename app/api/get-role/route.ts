import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = createClient()

    const { data: { user }, error: authError } = await (await supabase).auth.getUser()
    if (!user || authError) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    try {
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { supabase_user_id: user.id },
            select: { role: true },
        })

        if (!utilisateur) {
            return NextResponse.json({ error: 'Utilisateur non trouve' }, { status: 404 })
        }
        return NextResponse.json({ role: utilisateur.role })
    } catch (err) {
        console.error('Erreur API get-role:', err)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}