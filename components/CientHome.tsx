'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut, MapPin, ShoppingCart, LayoutDashboard } from 'lucide-react'

export default function Sidebar({ onSelect }: { onSelect: (view: string) => void }) {
  return (
    <div className="w-64 h-full border-r p-4 space-y-4 bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Mon Compte</h2>
      <nav className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onSelect('dashboard')}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Tableau de bord
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onSelect('commandes')}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Mes commandes
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onSelect('adresses')}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Mes adresses
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-red-500"
          onClick={() => onSelect('logout')}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </Button>
      </nav>
    </div>
  )
}
