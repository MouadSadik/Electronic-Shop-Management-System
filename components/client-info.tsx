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

export default function ClientInfos() {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null)
  const [error, setError] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/utilisateur')
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur inconnue')
      } else {
        setUtilisateur(data.utilisateur)
        setNom(data.utilisateur.nom)
        setTelephone(data.utilisateur.client?.telephone || '')
      }
    }

    fetchData()
  }, [])

  const handleUpdate = async () => {
    setError('')
    setSuccessMsg('')

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, telephone }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Erreur inconnue')
    } else {
      setUtilisateur(data.utilisateur)
      setSuccessMsg('Infos mises à jour.')
      setEditMode(false)
    }
  }

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
            <Button variant="ghost" size="icon" onClick={() => setEditMode(!editMode)}>
              <Pencil className="w-5 h-5" />
            </Button>
          </div>

          <p><strong>Email :</strong> {utilisateur.email}</p>

          {editMode && (
            <div className="space-y-2">
              <Input
                placeholder="Nom complet"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
              <Input
                placeholder="Téléphone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
              <Button onClick={handleUpdate}>Enregistrer</Button>
            </div>
          )}

          {successMsg && <p className="text-green-600">{successMsg}</p>}
        </CardContent>
      </Card>
    </main>
  )
}