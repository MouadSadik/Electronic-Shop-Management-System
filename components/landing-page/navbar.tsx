'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Input } from '../ui/input'
import { Menu, User, ShoppingCart } from 'lucide-react'
import PanierSheet from '@/app/dashboard/_components/panier-dialog'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from '@/components/ui/navigation-menu'

type Categorie = {
  id: number,
  nom: string,
}

const Navbar = () => {
  const [categories, setCategories] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const handleSearch = useCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    router.push(`/?${params.toString()}`)

  }, [searchParams, router])


  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (!res.ok) {
          setErrorMsg(data.error || 'Erreur lors du chargement.')
        } else {
          setCategories(data.categorie || [])
        }
      } catch (err) {
        setErrorMsg('Erreur de connexion au serveur.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])




  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
      setLoading(false)
    }

    checkSession()
  }, [])

  const handleUserClick = () => {
    router.push(isLoggedIn ? '/dashboard' : '/login')
  }

  const handlePanierClick = () => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }

  if (loading) return <p>Chargement...</p>

  return (
    <header className="w-full shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        <Link href="/" className="text-xl font-bold text-primary">
          LOGO
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Menu className="h-6 w-6 mr-2" /> Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[200px] ">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/produit/categories/${cat.id}`}
                          className="block select-none rounded-md p-1 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                        >
                          {cat.nom}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex-1 max-w-xl">
          <Input
            placeholder="Rechercher un produit"
            className=""
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('search') || ''}
          />
        </div>

        <div className="flex items-center gap-4">
          <User
            onClick={handleUserClick}
            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-primary transition"
          />

          {isLoggedIn ? (
            <PanierSheet />
          ) : (
            <ShoppingCart
              onClick={handlePanierClick}
              className="w-6 h-6 cursor-pointer text-gray-600 hover:text-primary transition"
            />
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
