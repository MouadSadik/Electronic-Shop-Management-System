import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const { commandeId } = body

    if (!commandeId) {
        return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }

    try {
        const commande = await prisma.commande.findUnique({
            where: { id: commandeId },
        })

        if (!commande || commande.status !== "DEVIS") {
            return NextResponse.json({ error: 'Commande invalide ou déjà confirmée' }, { status: 400 })
        }

        await prisma.commande.update({
            where: { id: commandeId },
            data: { status: "CONFIRMEE" }
        })
        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: 'Erreur serveur' + err}, { status: 500 })
    }
}