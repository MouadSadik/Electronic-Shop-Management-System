import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }
        
        const resolvedParams = await params
        const id = Number(resolvedParams.id)
        
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
        }
        
        const body = await req.json()
        const { status } = body
        
        // Validate status if needed
        if (!status) {
            return NextResponse.json({ error: 'Status requis' }, { status: 400 })
        }
        
        const updatedCommande = await prisma.commande.update({
            where: { id },
            data: { status },
        })
        
        return NextResponse.json({ updatedCommande }, { status: 200 })
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error)
        return NextResponse.json({ 
            error: 'Erreur serveur',
            details: process.env.NODE_ENV === 'development' ? error : undefined
        }, { status: 500 })
    }
}

// Add runtime configuration to prevent static analysis issues
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'