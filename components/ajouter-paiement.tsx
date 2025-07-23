'use client'

import { useEffect, useState } from 'react'

type Props = {
  factureId: number
}

export default function CreatePaiement({ factureId }: Props) {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Création du paiement en cours...')

  useEffect(() => {
    const createPaiement = async () => {
      try {
        const res = await fetch('/api/paiement', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ factureId }),
        })

        if (!res.ok) {
          setMessage('Échec de la création du paiement.')
          return
        }

        setMessage('Paiement créé avec succès.')
      } catch (err) {
        console.error(err)
        setMessage('Erreur lors de la création du paiement.')
      } finally {
        setLoading(false)
      }
    }

    createPaiement()
  }, [factureId])

  return (
    <div className={`text-sm mt-4 ${loading ? 'text-gray-600' : message.includes('succès') ? 'text-green-600' : 'text-red-600'}`}>
      {message}
    </div>
  )
}
