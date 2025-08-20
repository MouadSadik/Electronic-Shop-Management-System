'use client'

import useSWR from 'swr'
import { AjouterAuPanierButton } from '@/app/dashboard/_components/ajout-au-panier'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'



const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()

  if (!res.ok) throw new Error(data.errorMsg || 'Erreur lors du chargement.')
  return data.produits
}

const ProduitsList = () => {
  const { data, error, isLoading } = useSWR<Produit[]>('/api/produit', fetcher)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  const produitsEnStock = (data || []).filter((produit) => produit.stock > 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 p-10">
      {produitsEnStock.map((produit: Produit) => (
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

  )
}

export default ProduitsList
