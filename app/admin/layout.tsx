'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  User,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import SignOut from '@/components/signout'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

const navItems = [
  { href: '/admin/stats', label: 'Tableau de bord', icon: Home },
  { href: '/admin/produits', label: 'Les Produits', icon: Package },
  { href: '/admin/categories', label: 'Les catégories des produits', icon: Package },
  { href: '/admin/commandes', label: 'Les commandes', icon: ShoppingCart },
  { href: '/admin/clientt', label: 'Les Clients', icon: Users },
  { href: '/admin/infos', label: 'Admin', icon: User },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const renderNavLinks = (isMobile = false) =>
    navItems.map(({ href, label, icon: Icon }) => (
      <Link href={href} key={href} onClick={isMobile ? () => setOpen(false) : undefined}>
        <Button variant="ghost" className="w-full justify-start">
          <Icon className="mr-2 h-4 w-4 text-primary" /> {label}
        </Button>
      </Link>
    ))

  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <aside className="hidden md:block w-64 bg-white border-r p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">Espace Admin</h2>
        <nav className="space-y-2">{renderNavLinks()}</nav>
        <SignOut />
      </aside>

      {/* Sidebar mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden absolute top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6 hover:text-primary" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <SheetHeader>
            <SheetTitle>Espace Admin</SheetTitle>
            <SheetDescription>Accédez aux différentes sections d'administration.</SheetDescription>
          </SheetHeader>
          <div className=" space-y-2">{renderNavLinks(true)}</div>
          <div className="mt-6">
            <SignOut />
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1 p-4 md:p-6 bg-gray-50">{children}</main>
    </div>
  )
}
