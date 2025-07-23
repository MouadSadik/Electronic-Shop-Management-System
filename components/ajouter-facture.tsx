'use client'

import { useState } from 'react'
import { Button } from './ui/button'

type Props = {
  commandeId: number
  onCreated?: (factureId: number) => void
}

export default function CreateFactureButton({ commandeId, onCreated }: Props) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleCreate = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/facture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ commandeId }),
      })

      if (!res.ok) throw new Error('Erreur lors de la création de la facture')

      const data = await res.json()
      setMessage('Facture créée avec succès.')

      if (onCreated) onCreated(data.id)
    } catch (err) {
      console.error(err)
      setMessage('Échec de la création de la facture.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={handleCreate} disabled={loading}>
        {loading ? 'Création...' : 'Créer la facture'}
      </Button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  )
}
