import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
        return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    const body = await req.json()
    const { ligneCommandeId, quantite } = body

    if (!ligneCommandeId || typeof quantite !== 'number') {
        return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    try {
        const ligneCommande = await prisma.ligneCommande.update({
            where: { id: ligneCommandeId },
            data: { quantite },
        })
        return NextResponse.json({ success: true, ligneCommande })
    } catch (err) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}