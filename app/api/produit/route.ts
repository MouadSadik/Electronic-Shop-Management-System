import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

//pour add a produit
export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const utilisateur = await prisma.utilisateur.findUnique({
        where: { supabase_user_id: user.id },
    })
    if (!utilisateur || utilisateur.role != "ADMIN") {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await req.json()
    const { nom, description, prix, promo, stock, image_url, categorie_id } = body

    if (!nom || !description || !prix || !stock || !image_url || !categorie_id) {
        return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }
    try {
        const produit = await prisma.produit.create({
            data: {
                nom,
                description,
                prix: parseFloat(prix),
                promo: promo ?? false,
                stock: parseInt(stock),
                image_url,
                categorie_id: parseInt(categorie_id),
            },
        })
        return NextResponse.json({ produit }, { status: 201 })
    } catch (err) {
        console.error('Erreur création produit:', err)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}

//get all products 
export async function GET() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const utilisateur = await prisma.utilisateur.findUnique({
        where: { supabase_user_id: user.id }
    })

    if (!utilisateur) {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }
    try {
        const produits = await prisma.produit.findMany({
            select: {
                id: true,
                nom: true,
                description: true,
                prix: true,
                promo: true,
                stock: true,
                image_url: true,
            },
        })
        return NextResponse.json({ produits })
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}