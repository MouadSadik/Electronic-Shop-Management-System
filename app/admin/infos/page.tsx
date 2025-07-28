
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function AdminInfos() {
  const supabase = await createClient()
  const { data: { user }, error: authError, } = await supabase.auth.getUser()

  if (!user) notFound()

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { supabase_user_id: user.id },
    include: { client: true },
  })

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
