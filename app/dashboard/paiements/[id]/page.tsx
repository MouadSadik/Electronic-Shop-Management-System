import PaiementPage from '@/components/paiement-page'
import React from 'react'

const page = ({ params }: { params: { id: string } }) => {

  const commandeId = Number(params.id)
  if (isNaN(commandeId)) return <p>ID invalide</p>
  return (
    <div>
      <PaiementPage commandeId={commandeId} />
    </div>
  )
}

export default page