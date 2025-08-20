'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Home,
  Package,
  FileText,
  Menu,
  UserCircle,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import SignOut from '@/components/signout'
import PanierDialog from '@/app/dashboard/_components/panier-dialog'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const navLinks = (isMobile = false) => (
    <nav className="space-y-2 mt-4">
      <Link href="/dashboard" onClick={isMobile ? () => setOpen(false) : undefined}>
        <Button variant="ghost" className="w-full justify-start">
          <Home className="mr-2 h-4 w-4 text-primary" /> Tableau de bord
        </Button>
      </Link>
      <Link href="/dashboard/infos" onClick={isMobile ? () => setOpen(false) : undefined}>
        <Button variant="ghost" className="w-full justify-start">
          <UserCircle className="mr-2 h-4 w-4 text-primary" /> Mes Informations
        </Button>
      </Link>
      <Link href="/produits" onClick={isMobile ? () => setOpen(false) : undefined}>
        <Button variant="ghost" className="w-full justify-start">
          <Package className="mr-2 h-4 w-4 text-primary" /> Les Produits
        </Button>
      </Link>
      <Link href="/dashboard/commandes" onClick={isMobile ? () => setOpen(false) : undefined}>
        <Button variant="ghost" className="w-full justify-start">
          <Package className="mr-2 h-4 w-4 text-primary" /> Mes commandes
        </Button>
      </Link>
      <Link href="/dashboard/factures" onClick={isMobile ? () => setOpen(false) : undefined}>
        <Button variant="ghost" className="w-full justify-start">
          <FileText className="mr-2 h-4 w-4 text-primary" /> Mes Factures
        </Button>
      </Link>
      <div className="mt-4">
        <SignOut />
        <Link className='items-center flex justify-center' href="/">
          <Button className='mt-5 w-full'>
            <ArrowLeft />
            Retour A L'accueil
          </Button>
        </Link>
      </div>
    </nav>
  )

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white border-r p-4 flex-col">
        
        <h2 className="text-xl font-bold">Espace Client</h2>
        {navLinks()}
      </aside>

      {/* Sheet Mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <SheetHeader>
            <SheetTitle>Espace Client</SheetTitle>
            <SheetDescription>Accédez aux différentes sections d'administration.</SheetDescription>
          </SheetHeader>
          <div>{navLinks(true)}</div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 md:ml-64 bg-gray-50 relative">
        <div className="absolute top-4 right-4 z-40">
          <PanierDialog />
        </div>
        {children}
      </main>
    </div>
  )
}
