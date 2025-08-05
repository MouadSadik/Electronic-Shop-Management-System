'use client'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const router = useRouter()
    const supabase = createClient()


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setErrorMsg(error.message)
                return
            }

            const res = await fetch('/api/utilisateur')
            const result = await res.json()

            if (!res.ok) {
                setErrorMsg(result.error || 'Erreur lors de la récupération du profil.')
                return
            }

            const role = result.utilisateur?.role

            if (role === 'CLIENT') {
                router.push('/dashboard')
            } else if (role === 'ADMIN') {
                router.push('/admin')
            } else {
                setErrorMsg('Rôle inconnu.')
            }

        } catch (err) {
            console.error(err)
            setErrorMsg('Une erreur inconnue est survenue.')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className='flex justify-center items-center mt-24 px-4'>
            <Card className='w-full max-w-md shadow-xl'>
                <CardHeader>
                    <CardTitle className='text-2xl'>Connexion</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className='space-y-4'>
                        <div>
                            <Label className='mb-3' htmlFor='email'>Adress Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label className='mb-3' htmlFor='password'>Mot de passe</Label>
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

                        <Button type="submit" className='w-full' disabled={loading} >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </form>

                    <CardAction className='mt-3'>
                        Pas de compte ?
                        <Button variant="link"><Link href="/signup">Inscription</Link></Button>
                    </CardAction>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginForm