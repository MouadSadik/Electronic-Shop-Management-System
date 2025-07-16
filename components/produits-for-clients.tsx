'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Skeleton } from './ui/skeleton'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

const ProduitsList = () => {
  const [produits, setProduits] = useState<Produit[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProduits = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/produit')
        const data = await res.json()

        if (!res.ok) {
          setErrorMsg(data.errorMsg || "Erreur lors du chargement.")
        } else {
          // Filtrer uniquement les produits en stock
          const produitsEnStock = (data.produits || []).filter(
            (produit: Produit) => produit.stock > 0
          )
          setProduits(produitsEnStock)
        }
      } catch (err) {
        setErrorMsg("Erreur de connexion au serveur")
      } finally {
        setLoading(false)
      }
    }
    fetchProduits()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (errorMsg) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{errorMsg}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <Button type='submit' className='w-full'>
              Ajouter au Panier
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default ProduitsList