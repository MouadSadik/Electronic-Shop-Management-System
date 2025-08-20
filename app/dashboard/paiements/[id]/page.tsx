import PaiementPage from '@/app/dashboard/_components/paiement-page'
import React from 'react'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params
  const commandeId = Number(resolvedParams.id)
  
  if (isNaN(commandeId)) return <p>ID invalide</p>
  
  return (
    <div>
      <PaiementPage commandeId={commandeId} />
    </div>
  )
}

export default page