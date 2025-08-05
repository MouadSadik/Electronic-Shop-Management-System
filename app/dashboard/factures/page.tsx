'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

type Facture = {
  id: string
  numero: string
  date: string
  total: number
  commandes: {
    commande: {
      id: string
      status: string
    }
  }[]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function FacturesClient() {
  const { data: factures, error, isLoading } = useSWR<Facture[]>('/api/facture', fetcher)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">Erreur lors du chargement des factures.</p>
  }

  if (!factures || factures.length === 0) {
    return <p className="text-muted-foreground">Aucune facture trouvée.</p>
  }

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-bold mb-4 text-primary">Mes Factures</h1>
      <div className="grid grid-cols-1 gap-4">
        {factures.map((facture) => (
          <Card key={facture.id} className="shadow-md">
            <CardHeader>
              <CardTitle>Facture #{facture.numero}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Date : {new Date(facture.date).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <p className="font-medium">Montant total : {facture.total} MAD</p>
              <Separator className="my-2" />
              <p className="text-sm font-semibold">Commandes associées :</p>
              <ul className="list-disc list-inside text-sm">
                {facture.commandes.map((item, i) => (
                  <li key={i}>
                    Commande #{item.commande.id} – Statut : {item.commande.status}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
