'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Pencil, UserCircle } from 'lucide-react'

type Utilisateur = {
  nom: string
  email: string
  client?: {
    telephone: string
  }
}

export default function AdminProfile() {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null)
  const [error, setError] = useState('')
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/utilisateur')
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur inconnue')
      } else {
        setUtilisateur(data.utilisateur)
      }
    }

    fetchData()
  }, [])

  

  if (error) {
    return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
  }

  if (!utilisateur) {
    return <p>Chargement...</p>
  }

  return (
    <main className="max-w-2xl mx-auto py-10 px-4 space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <UserCircle className="w-8 h-8 text-gray-700" />
            <h1 className="text-2xl font-semibold">
              Bienvenue, {utilisateur.nom}
            </h1>
          </div>
          <p><strong>Email :</strong> {utilisateur.email}</p>
        </CardContent>
      </Card>
    </main>
  )
}
