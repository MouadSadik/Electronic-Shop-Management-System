'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import CreateFactureButton from '@/components/ajouter-facture'
import CreatePaiement from '@/components/ajouter-paiement'

export default function FacturePage() {
    const searchParams = useSearchParams()
    const commandeIdParam = searchParams.get('commandeId')
    const commandeId = commandeIdParam ? parseInt(commandeIdParam, 10) : null

    const [factureId, setFactureId] = useState<number | null>(null)

    if (!commandeId) {
        return <p className="text-red-600">Aucune commande sélectionnée pour la facture.</p>
    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Créer une Facture</h1>

            <CreateFactureButton commandeId={commandeId} onCreated={setFactureId} />

            {factureId && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Création du Paiement</h2>
                    <CreatePaiement factureId={factureId} />
                </div>
            )}
        </div>
    )
}
