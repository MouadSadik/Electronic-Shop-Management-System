import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'

type Props = {
  params: { id: string }
}

export default async function ProductPage({ params }: Props) {
  const produit = await prisma.produit.findUnique({
    where: { id: parseInt(params.id) },
  })

  if (!produit) return notFound()

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card key={produit.id} className="overflow-hidden">
        <img
          src={produit.image_url}
          alt={produit.nom}
          className="w-full h-96 object-cover"
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
          <p>Quantite dans le stock : {produit.stock}</p>
        </CardContent>
      </Card>
    </div>
  )
}
