'use client'

//this is not used for the moment

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit } from 'lucide-react' 

export default function DashboardClient() {
    const supabase = createClient()

    const [nom, setNom] = useState('')
    const [telephone, setTelephone] = useState('')
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        async function fetchUser() {
            setLoading(true)
            setErrorMsg('')

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser()

            if (userError || !user) {
                setErrorMsg('Utilisateur non connecté.')
                setLoading(false)
                return
            }

            const { data: utilisateurData, error: utilisateurError } = await supabase
                .from('Utilisateur')
                .select('id, nom')
                .eq('supabase_user_id', user.id)
                .single()

            if (utilisateurError || !utilisateurData) {
                setErrorMsg('Impossible de récupérer les informations utilisateur.')
                setLoading(false)
                return
            }

            setNom(utilisateurData.nom)

            const { data: clientData, error: clientError } = await supabase
                .from('Client')
                .select('telephone')
                .eq('utilisateur_id', utilisateurData.id)
                .single()

            if (clientError) {
                setErrorMsg('Impossible de récupérer le téléphone client.')
            } else if (clientData) {
                setTelephone(clientData.telephone)
            }

            setLoading(false)
        }

        fetchUser()
    }, [supabase])

    async function handleSave() {
        setSaving(true)
        setErrorMsg('')

        try {
            // récupérer utilisateur pour id
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) throw new Error('Utilisateur non connecté')

            const { data: utilisateurData, error: utilisateurError } = await supabase
                .from('Utilisateur')
                .select('id')
                .eq('supabase_user_id', user.id)
                .single()

            if (utilisateurError || !utilisateurData) throw utilisateurError || new Error('Utilisateur non trouvé')

            // update nom
            const { error: updateUtilisateurError } = await supabase
                .from('Utilisateur')
                .update({ nom })
                .eq('id', utilisateurData.id)

            if (updateUtilisateurError) throw updateUtilisateurError

            // update téléphone
            const { error: updateClientError } = await supabase
                .from('Client')
                .update({ telephone })
                .eq('utilisateur_id', utilisateurData.id)

            if (updateClientError) throw updateClientError

            setEditing(false)
        } catch (error: any) {
            setErrorMsg('Erreur lors de la sauvegarde : ' + error.message)
        }

        setSaving(false)
    }

    if (loading) return <p>Chargement...</p>
    if (errorMsg) return <p className="text-red-600">{errorMsg}</p>

    return (
        <div className="max-w-md mx-auto py-10 px-4 space-y-4">
            {!editing ? (
                <>
                    <h1 className="text-2xl font-semibold">
                        Bonjour, {nom}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="ml-3"
                            onClick={() => setEditing(true)}
                            aria-label="Modifier profil"
                        >
                            <Edit className="w-5 h-5" />
                        </Button>
                    </h1>
                    <p>Téléphone : {telephone || '—'}</p>
                </>
            ) : (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSave()
                    }}
                    className="space-y-4"
                >
                    <div>
                        <Label htmlFor="nom">Nom complet</Label>
                        <Input
                            id="nom"
                            type="text"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="telephone">Téléphone</Label>
                        <Input
                            id="telephone"
                            type="tel"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                        />
                    </div>
                    {errorMsg && <p className="text-red-600">{errorMsg}</p>}
                    <div className="flex space-x-2">
                        <Button type="submit" disabled={saving} className="flex-1">
                            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditing(false)}
                            disabled={saving}
                            className="flex-1"
                        >
                            Annuler
                        </Button>
                    </div>
                </form>
            )}
        </div>
    )
}
