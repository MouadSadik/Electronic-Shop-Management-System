import { AjouterAuPanierButton } from '@/app/dashboard/_components/ajout-au-panier'
import Navbar from '@/components/landing-page/navbar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import React from 'react'

interface Props {
    params: Promise<{ id: string }>
}

const CategorieProduits = async ({ params }: Props) => {
    const {id} = await params
    const categoryId = Number(id)

    if (isNaN(categoryId)) return notFound

    const categorie = await prisma.categorie.findUnique({
        where: { id: categoryId, },
    })

    if (!categorie) return notFound()

    const produits = await prisma.produit.findMany({
        where: { categorie_id: categoryId, },
    })

    if (!produits || produits.length === 0) {
        return <div>
            <Navbar />
            <p className="text-center mt-10 text-gray-500">Aucun produit trouvé dans cette catégorie.</p>
        </div>
    }


    return (
        <div>
            <Navbar />
            <h1 className='text-center mt-6 text-3xl font-bold'>{categorie.nom}</h1>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 p-10">
                {produits.map((produit) => (
                    <Card key={produit.id} className="overflow-hidden">
                        <img
                            src={produit.image_url}
                            alt={produit.nom}
                            className="w-full h-52 object-cover"
                        />
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {produit.nom}
                                {produit.promo && <Badge variant="outline">Promo</Badge>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm text-gray-600">{produit.description}</p>
                            <p className="text-lg font-semibold">{produit.prix} MAD</p>
                        </CardContent>
                        <CardFooter>
                            <AjouterAuPanierButton produitId={produit.id} />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default CategorieProduits