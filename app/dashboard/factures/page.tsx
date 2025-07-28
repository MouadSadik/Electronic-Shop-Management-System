'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export default function FacturesClient() {
  const [factures, setFactures] = useState<Facture[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const res = await fetch('/api/facture')
        if (!res.ok) throw new Error('Erreur lors du chargement des factures.')
        const data = await res.json()
        setFactures(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchFactures()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (factures.length === 0) {
    return <p className="text-muted-foreground">Aucune facture trouvée.</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mes Factures</h1>
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
                  <li key={i}>Commande #{item.commande.id} - Statut : {item.commande.status}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}