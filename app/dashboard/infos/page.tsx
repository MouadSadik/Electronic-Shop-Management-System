'use client'

import useSWR from 'swr'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Pencil, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'



const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ClientInfos() {
  const { data, error, isLoading, mutate } = useSWR('/api/utilisateur', fetcher)
  const [editMode, setEditMode] = useState(false)
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Mettre à jour les champs après le chargement
  useState(() => {
    if (data?.utilisateur) {
      setNom(data.utilisateur.nom)
      setTelephone(data.utilisateur.client?.telephone || '')
    }
  })

  const handleUpdate = async () => {
    setSuccessMsg('')
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, telephone }),
    })

    const updated = await res.json()

    if (!res.ok) return alert(updated.error || 'Erreur inconnue')

    mutate() // Met à jour automatiquement le cache SWR
    setSuccessMsg('Infos mises à jour.')
    setEditMode(false)
  }

  if (error) {
    return <Alert variant="destructive"><AlertDescription>{error.message || "Erreur"}</AlertDescription></Alert>
  }

  if (isLoading || !data) {
    return (
      <div className={cn("flex items-center justify-center h-screen")}>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  const utilisateur = data.utilisateur

  return (
    <main className="max-w-2xl mx-auto py-10 px-4 space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <UserCircle className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-semibold">
              Bienvenue, {utilisateur.nom}
            </h1>
            <Button variant="ghost" size="icon" onClick={() => setEditMode(!editMode)}>
              <Pencil className="w-5 h-5 text-primary" />
            </Button>
          </div>

          <p><strong className='text-primary'>Email :</strong> {utilisateur.email}</p>

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