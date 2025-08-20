import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT( 
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params; 

    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const id = Number(params.id);
    if (isNaN(id)) {
        return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
        return NextResponse.json(
            { error: "Le status n'est pas fourni pour la mise à jour." },
            { status: 400 }
        );
    }

    try {
        const commande = await prisma.commande.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json({ commande }, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}