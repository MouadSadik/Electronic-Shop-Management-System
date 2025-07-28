'use client'

import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"

export default function SignOut() {
    const router = useRouter()
    const supabase = createClient()

    const handleSignout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error("Erreur de déconnexion :", error.message)
            return
        }
        router.push('/login')
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="w-full mt-8" variant="destructive">
                    Se déconnecter
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Voulez-vous vraiment vous déconnecter ?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSignout}>
                        Confirmer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
