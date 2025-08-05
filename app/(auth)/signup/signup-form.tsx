'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function SignupForm() {
    const router = useRouter()
    const supabase = createClient()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')

        try {
            //Inscription
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        fullName,
                    },
                },
            })

            if (signUpError) {
                setErrorMsg(signUpError.message)
                return
            }

            const user = signUpData?.user
            if (!user) {
                setErrorMsg('Utilisateur non trouvé après inscription.')
                return
            }

            //Ajouter dans Utilisateur
            const { error: utilisateurError } = await supabase.from('Utilisateur').insert({
                supabase_user_id: user.id,
                email: user.email,
                nom: fullName,
                role: 'CLIENT',
            })

            if (utilisateurError) {
                console.error('Erreur ajout Utilisateur :', utilisateurError)
                setErrorMsg("Erreur lors de la création du compte.")
                return
            }

            const { data: utilisateurData, error: getUserError } = await supabase
                .from('Utilisateur')
                .select('id')
                .eq('supabase_user_id', user.id)
                .single()

            if (getUserError || !utilisateurData) {
                setErrorMsg("Impossible de récupérer l'utilisateur.")
                return
            }

            //Ajouter dans Client
            const { error: clientError } = await supabase.from('Client').insert({
                utilisateur_id: utilisateurData.id,
                telephone: '',
            })

            if (clientError) {
                console.error('Erreur ajout Client :', clientError)
                setErrorMsg("Erreur lors de la création du profil client.")
                return
            }

            router.push('/signup-success')
        } catch (err) {
            console.error(err)
            setErrorMsg('Une erreur inconnue est survenue.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center mt-20 px-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Créer un compte</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <Label className='mb-3' htmlFor="fullName">Nom complet</Label>
                            <Input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label className='mb-3' htmlFor="email">Adresse email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label className='mb-3' htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {errorMsg && (
                            <Alert variant="destructive">
                                <AlertDescription>{errorMsg}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Création...' : "S'inscrire"}
                        </Button>
                    </form>
                    <CardAction className='mt-3'>
                        Avez vous un compte ?
                        <Button variant="link"><Link href="/login">Connexion</Link></Button>
                    </CardAction>
                </CardContent>
            </Card>
        </div>
    )
}