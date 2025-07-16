import Link from 'next/link'
import { LogOut, Home, Package, MapPin, User, UserCircle, ShoppingCart, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-white border-r p-4 space-y-4">
                <h2 className="text-xl font-bold mb-6">Espace Admin</h2>
                <nav className="space-y-2">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start">
                            <Home className="mr-2 h-4 w-4" /> Tableau de bord
                        </Button>
                    </Link>
                    <Link href="/admin/produits">
                        <Button variant="ghost" className="w-full justify-start">
                            <Package className="mr-2 h-4 w-4" /> Les Produits
                        </Button>
                    </Link>
                    <Link href="/admin/categories">
                        <Button variant="ghost" className="w-full justify-start">
                            <Package className="mr-2 h-4 w-4" /> Les categories des produits
                        </Button>
                    </Link>
                    <Link href="/admin/commandes">
                        <Button variant="ghost" className="w-full justify-start">
                            <ShoppingCart className="mr-2 h-4 w-4" /> Les commandes
                        </Button>
                    </Link>
                    <Link href="/admin/adresses">
                        <Button variant="ghost" className="w-full justify-start">
                            <Users className="mr-2 h-4 w-4" /> Les Clients
                        </Button>
                    </Link>
                    <Link href="/admin/infos">
                        <Button variant="ghost" className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" /> Admin
                        </Button>
                    </Link>
                </nav>
                <form action="/logout" method="post">
                    <Button variant="outline" className="w-full mt-8">
                        <LogOut className="mr-2 h-4 w-4" /> Se déconnecter
                    </Button>
                </form>
            </aside>

            <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
    )
}
