import Link from 'next/link'
import { LogOut, Home, Package, MapPin, User, UserCircle, ShoppingCart, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SignOut from '@/components/signout'
import PanierDialog from '@/components/panier-dialog'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-white border-r p-4 space-y-4">
                <h2 className="text-xl font-bold mb-6">Espace Client</h2>
                <nav className="space-y-2">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start">
                            <Home className="mr-2 h-4 w-4" /> Tableau de bord
                        </Button>
                    </Link>
                    <Link href="/dashboard/infos">
                        <Button variant="ghost" className="w-full justify-start">
                            <UserCircle className="mr-2 h-4 w-4" /> Mes Informations
                        </Button>
                    </Link>
                    <Link href="/dashboard/produits">
                        <Button variant="ghost" className="w-full justify-start">
                            <Package className="mr-2 h-4 w-4" /> Les Produits
                        </Button>
                    </Link>
                    <Link href="/dashboard/commandes">
                        <Button variant="ghost" className="w-full justify-start">
                            <Package className="mr-2 h-4 w-4" /> Mes commandes
                        </Button>
                    </Link>
                    <Link href="/dashboard/factures">
                        <Button variant="ghost" className="w-full justify-start">
                            <FileText className="mr-2 h-4 w-4" /> Mes Factures
                        </Button>
                    </Link>
                </nav>
                <SignOut />
            </aside>

            <main className="flex-1 p-6 bg-gray-50">
                <div className="absolute top-2 right-8 text-lg  h-10 w-10 ">
                    <PanierDialog />
                </div>
                {children}
            </main>
        </div>
    )
}