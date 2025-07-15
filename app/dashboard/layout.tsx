import Link from 'next/link'
import { LogOut, Home, Package, MapPin, User, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
                    <Link href="/dashboard/commandes">
                        <Button variant="ghost" className="w-full justify-start">
                            <Package className="mr-2 h-4 w-4" /> Mes commandes
                        </Button>
                    </Link>
                    <Link href="/dashboard/adresses">
                        <Button variant="ghost" className="w-full justify-start">
                            <MapPin className="mr-2 h-4 w-4" /> Mes adresses
                        </Button>
                    </Link>
                    <Link href="/dashboard/profil">
                        <Button variant="ghost" className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" /> Mon profil
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
