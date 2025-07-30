'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { User } from 'lucide-react'
import PanierSheet from '@/app/dashboard/_components/panier-dialog'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const Navbar = () => {
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
      setLoading(false)
    }

    checkSession()
  }, [])

  const handleClick = () => {
    if(!isLoggedIn) {
      router.push("/login")
    }
    else{
      router.push("/dashboard")
    }
  }

  return (
    <header className="w-full shadow-sm bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        <Link href="/" className="text-xl font-bold text-primary">
          LOGO
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <Input
            placeholder="Rechercher un produit"
            className="w-full border-gray-300 focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
            <User onClick={handleClick} className="w-6 h-6 cursor-pointer text-gray-600 hover:text-primary transition" />
        
          <div onClick={() => {
  if (!loading) {
    if (isLoggedIn) {
      //le panier s’ouvre normalement
    } else {
      router.push("/login")
    }
  }
}}>
  <PanierSheet />
</div>

        </div>
      </div>
    </header>
  )
}

export default Navbar