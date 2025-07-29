'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Alert, AlertDescription } from './ui/alert'
import { Button } from './ui/button'

const AddCategorie = () => {
    const [nom, setNom] = useState("")
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')
        setSuccessMsg('')

        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nom,
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Erreur lors de l’ajout.')

            setSuccessMsg("Ajout avec succes")
            setNom('')
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className='w-full max-w-sm mt-20'>
            <CardHeader>
                <CardTitle>Ajouter Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className='grid gap-2'>
                        <Label className='mb-3'>Nom de Catégorie</Label>
                        <Input placeholder='Ex: PC' className='mb-3' value={nom} onChange={(e) => setNom(e.target.value)} required />
                    </div>

                    {errorMsg && (
                        <Alert variant="destructive">
                            <AlertDescription>{errorMsg}</AlertDescription>
                        </Alert>
                    )}
                    {successMsg && (
                        <Alert variant="default">
                            <AlertDescription>{successMsg}</AlertDescription>
                        </Alert>
                    )}

                    <Button  type="submit" disabled={loading} className="w-full mt-3">
                        {loading ? 'Ajout en cours...' : 'Ajouter'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
export default AddCategorie