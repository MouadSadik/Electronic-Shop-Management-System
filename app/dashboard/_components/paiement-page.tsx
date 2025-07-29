'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type Props = {
    commandeId: number
}

const modes = [
    { label: 'Espèce', value: 'ESPECE' },
    { label: 'Carte Bancaire', value: 'CARTE_BANCAIRE' },
    { label: 'Chèque', value: 'CHEQUE' },
    { label: 'Virement', value: 'VIREMENT' },
]

const PaiementPage = ({ commandeId }: Props) => {
    const [adresse, setAdresse] = useState('')
    const [modePaiement, setModePaiement] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text })
        setTimeout(() => setMessage(null), 4000)
    }

    const handleAdresseUpdate = async () => {
        if (!adresse) return showMessage('error', 'Adresse vide')

        setLoading(true)
        try {
            const res = await fetch('/api/profile/adresse', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adresse }),
            })

            const data = await res.json()
            if (!res.ok) {
                showMessage('error', data.error || 'Erreur lors de la mise à jour')
            } else {
                showMessage('success', 'Adresse mise à jour')
            }
        } catch {
            showMessage('error', 'Erreur réseau')
        } finally {
            setLoading(false)
        }
    }

    const handlePaiementType = async () => {
        if (!modePaiement) return showMessage('error', 'Veuillez choisir un mode de paiement')

        setLoading(true)
        try {
            const res = await fetch(`/api/commande/mode-paiement/${commandeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode_paiement: modePaiement }),
            })

            const data = await res.json()
            if (!res.ok) {
                showMessage('error', data.error || 'Erreur lors du choix du paiement')
            } else {
                showMessage('success', 'Type de paiement choisi avec succès')
            }
        } catch {
            showMessage('error', 'Erreur réseau')
        } finally {
            setLoading(false)
        }
    }

    const handleConfirm = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/commande/confirmer/${commandeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CONFIRMEE' }),
            })

            const data = await res.json()
            if (!res.ok) {
                showMessage('error', data.error || 'Erreur lors de la confirmation')
            } else {
                showMessage('success', 'Commande confirmée')
            }
        } catch {
            showMessage('error', 'Erreur réseau')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="space-y-6 p-6 max-w-xl mx-auto">
            {message && (
                <div
                    className={`text-sm p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Adresse */}
            <div className="space-y-2">
                <Label htmlFor="adresse">Votre Adresse</Label>
                <Input
                    id="adresse"
                    placeholder="Saisir votre adresse"
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                />
                <Button onClick={handleAdresseUpdate} disabled={loading}>
                    Confirmer l&apos;adresse
                </Button>
            </div>

            {/* Paiement */}
            <div className="space-y-2">
                <Label>Mode de Paiement</Label>
                <Select
                    value={modePaiement}
                    onValueChange={(value) => setModePaiement(value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir un mode de paiement" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Méthodes</SelectLabel>
                            {modes.map((mode) => (
                                <SelectItem key={mode.value} value={mode.value}>
                                    {mode.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button
                    onClick={handlePaiementType}
                    disabled={loading || !modePaiement}
                >
                    Confirmer le paiement
                </Button>
            </div>

            {/* Confirmation commande */}
            <div>
                <Button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700"
                >
                    Confirmer votre commande
                </Button>
            </div>
        </Card>
    )
}

export default PaiementPage
