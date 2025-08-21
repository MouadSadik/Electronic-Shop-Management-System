import { prisma } from '@/lib/prisma'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { AjouterAuPanierButton } from '@/app/dashboard/_components/ajout-au-panier'
import { Produit } from '@/app/generated/prisma'

const TopSellers = async () => {

    const produits = await prisma.produit.findMany({
        include: {
            _count: {
                select: { lignes: true, },
            },
        },
    })

    const topProduits = produits.sort((a, b) => b._count.lignes - a._count.lignes).slice(0, 5)

    return (
        <div className='mt-24 md:mx-10'>
            <h2 className='font-bold text-primary text-3xl text-center '>
                Top Sellers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 p-10">
                {topProduits.map((produit: Produit) => (
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

export default TopSellers