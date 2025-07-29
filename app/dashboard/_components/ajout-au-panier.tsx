'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface AddToCartButtonProps {
  produitId: number
}

export function AjouterAuPanierButton({ produitId }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAddToCart = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/commande', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ produitId })
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Erreur lors de l’ajout.')
      } else {
        setMessage('Produit ajouté au panier.')
      }
    } catch (err) {
      console.error(err)
      setMessage('Erreur réseau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleAddToCart} disabled={loading}>
        {loading ? 'Ajout en cours...' : 'Ajouter au panier'}
      </Button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  )
}