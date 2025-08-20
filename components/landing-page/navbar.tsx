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
import { Skeleton } from '@/components/ui/skeleton'

type Categorie = {
  id: number,
  nom: string,
}

const Navbar = () => {
  const [categories, setCategories] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const handleSearch = useCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())
    console.log(term)
    if (term) {
  params.set('search', term)
} else {
  params.delete('search')
}

    router.push(`/produits?${params.toString()}`)


  }, [searchParams, router])

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (!res.ok) setErrorMsg(data.error || 'Erreur lors du chargement.')
        else setCategories(data.categorie || [])
      } catch (err) {
        setErrorMsg('Erreur de connexion au serveur.' + err)
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
    }

    checkSession()
  }, [])

  const handleUserClick = () => {
    router.push(isLoggedIn ? '/dashboard' : '/login')
  }

  const handlePanierClick = () => {
    if (!isLoggedIn) router.push('/login')
  }

  if(errorMsg) return <p>Erreur</p>

  return (
    <header className="w-full shadow-sm sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 md:p-6 flex items-center justify-between gap-4">

        <Link href="/" className="text-xl font-bold text-primary">
          ElectroShop
        </Link>

        <div className="hidden md:flex items-center gap-4 flex-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="gap-1">
                  <Menu className="h-5 w-5" />
                  Catégories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4 md:w-[200px]">
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <li key={i}>
                          <Skeleton className="h-6 w-full rounded-md" />
                        </li>
                      ))
                    ) : (
                      categories.map((cat) => (
                        <li key={cat.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/produits/categorie/${cat.id}`}
                              className="block rounded-md px-2 py-1 text-sm hover:bg-gray-100"
                            >
                              {cat.nom}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))
                    )}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex-1 max-w-md">
            <Input
              placeholder="Rechercher un produit"
              onChange={(e) => handleSearch(e.target.value)}
              defaultValue={searchParams.get('search') || ''}
            />
          </div>
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

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <Input
            placeholder="Rechercher un produit"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('search') || ''}
          />
          <div className="flex flex-col gap-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-md" />
              ))
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/produits/categorie/${cat.id}`}
                  className="block px-2 py-1 rounded-md text-sm text-gray-800 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat.nom}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar