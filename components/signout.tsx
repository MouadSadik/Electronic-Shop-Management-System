'use client'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const SignOut = () => {
    const router = useRouter()
    const supabase = createClient()
    
    const handleSignout = async () => {
        const confirmed = confirm("Se déconnecter")
        if(!confirmed) return
        const { error } = await supabase.auth.signOut()

        if(error){
            console.error('Erreur de déconnexion :', error.message)
            return
        }
        router.push('/login')
    }


  return (
    <div>
        <Button className='w-full mt-8' variant="destructive" onClick={handleSignout}>
            Se déconnecter 
        </Button>
    </div>
  )
}

export default SignOut
