import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await (await supabase).auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const utilisateur = await prisma.utilisateur.findUnique({
            where: { supabase_user_id: user.id },
        })
        if (!utilisateur || utilisateur.role != "ADMIN") {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
        }

        const categories = await prisma.categorie.findMany({
            select: {
                id: true,
                nom: true,
            },
        })
        return NextResponse.json(categories)
    }
    catch (err) {
        console.error('Erreur API /categorie:', err)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }

}