import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

//get tout les categories
export async function GET() {
    try {
        /*const { data: { user }, error: authError } = await (await supabase).auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const utilisateur = await prisma.utilisateur.findUnique({
            where: { supabase_user_id: user.id },
        })
        if (!utilisateur || utilisateur.role != "ADMIN") {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
        }*/

        const categories = await prisma.categorie.findMany({
            select: {
                id: true,
                nom: true,
            },
        })
        return NextResponse.json({ categorie: categories }, { status: 200 })
    }
    catch (err) {
        console.error('Erreur API /categorie:', err)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}

//ajouter une categorie
export async function POST(req: Request) {
    const supabase = createClient()
    const {data: {user}, error: authError} = await (await supabase).auth.getUser()

    if(authError || !user) {
        return NextResponse.json({error: 'Non autorisé'}, {status: 401})
    }
    const body = await req.json()
    const { nom } = body
    if(!nom){
        return NextResponse.json({error: 'Champs manquant'}, {status: 400})
    }
    try{
        const categorie = await prisma.categorie.create({
            data: {
                nom,
            }
        })
        return NextResponse.json({categorie}, {status: 201})
    } catch(err) {
        console.error('Erreur création categorie:', err)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}