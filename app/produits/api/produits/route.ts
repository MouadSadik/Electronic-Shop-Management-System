import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)

    const nom = searchParams.get('nom') || undefined
    const categorie = searchParams.get('categorie') || undefined
    const prixMin = searchParams.get('prixMin') ? parseFloat(searchParams.get('prixMin')!) : undefined
    const prixMax = searchParams.get('prixMax') ? parseFloat(searchParams.get('prixMax')!) : undefined

    try {
        const produits = await prisma.produit.findMany({
            where: {
                ...(nom && {
                    nom: {
                        contains: nom,
                        mode: 'insensitive',
                    },
                }),
                ...(categorie && {
                    categorie: {
                        nom: {
                            contains: categorie,
                            mode: 'insensitive',
                        },
                    },
                }),
                ...(prixMin !== undefined || prixMax !== undefined
                    ? {
                        prix: {
                            ...(prixMin !== undefined && { gte: prixMin }),
                            ...(prixMax !== undefined && { lte: prixMax }),
                        },
                    }
                    : {}),
            },
        })

        return NextResponse.json(produits)
    } catch (error) {
        console.error('Erreur de filtrage des produits:', error)
        return NextResponse.json({ error: 'Erreur de récupération des produits' }, { status: 500 })
    }
}