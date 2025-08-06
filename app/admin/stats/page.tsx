'use client'

import useSWR from 'swr'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { format } from 'date-fns'

const fetcher = (url: string) => fetch(url).then(res => res.json())

type CommandeStatut = {
    status: string
    _count: { status: number }
}

type PaiementMode = {
    mode_paiement: string
    _sum: { montant_total: number | null }
}

type DerniereCommande = {
    id: number
    date_creation: string
    status: string
    clientNom: string
    totalLigne: number
}

type StatsData = {
    totalUtilisateurs: number
    totalCommandes: number
    commandesParStatut: CommandeStatut[]
    caTotal: number
    produitsStockFaible: number
    dernieresCommandes: DerniereCommande[]
    paiementsParMode: PaiementMode[]
}

export default function DashboardAdmin() {
    const { data, error } = useSWR<StatsData>('/api/admin/stats', fetcher, {
        refreshInterval: 60000,
    })

    if (error) return <div role="alert" className="p-4 text-red-600">Erreur de chargement des données.</div>
    if (!data) return <div role="status" className="p-4">Chargement...</div>

    const totalCommandes = data.totalCommandes
    const caTotal = data.caTotal.toFixed(2) + ' MAD'

    const commandesStatusPercent = data.commandesParStatut.map(c => ({
        status: c.status,
        count: c._count.status,
        percent: totalCommandes ? ((c._count.status / totalCommandes) * 100).toFixed(1) : '0',
    }))

    const totalPaiements = data.paiementsParMode.reduce((acc, p) => acc + (p._sum.montant_total ?? 0), 0)


    return (
        <main className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-extrabold text-primary mb-4">Tableau de bord Admin</h1>

            {/* KPIs */}
            <section aria-label="Statistiques principales" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="bg-primary/10" tabIndex={0}>
                    <CardHeader>
                        <CardTitle>Utilisateurs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-semibold">{data.totalUtilisateurs}</p>
                    </CardContent>
                </Card>

                <Card className="bg-secondary/10" tabIndex={0}>
                    <CardHeader>
                        <CardTitle>Commandes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-semibold">{totalCommandes}</p>
                    </CardContent>
                </Card>

                <Card className="bg-neutral/10" tabIndex={0}>
                    <CardHeader>
                        <CardTitle>Chiffre d'affaires</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-semibold">{caTotal}</p>
                    </CardContent>
                </Card>
            </section>

            {/* Commandes par statut */}
            <section aria-label="Répartition des commandes par statut">
                <Card>
                    <CardHeader>
                        <CardTitle>Commandes par statut</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {commandesStatusPercent.map(({ status, count, percent }) => (
                            <div key={status} className="mb-4">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium">{status}</span>
                                    <span>{count} ({percent}%)</span>
                                </div>
                                <Progress value={parseFloat(percent)} aria-valuemin={0} aria-valuemax={100} aria-valuenow={parseFloat(percent)} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>

            {/* Produits stock faible */}
            <section aria-label="Produits en stock faible">
                <Card className="bg-primary/20" tabIndex={0}>
                    <CardHeader>
                        <CardTitle>Produits en stock faible (&le; 5)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold">{data.produitsStockFaible}</p>
                    </CardContent>
                </Card>
            </section>

            {/* Dernières commandes */}
            <section aria-label="Liste des dernières commandes" className="overflow-x-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Dernières commandes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full border-collapse min-w-[600px]" role="table">
                            <thead>
                                <tr className="border-b border-neutral-300 bg-neutral-50" role="row">
                                    <th scope="col" className="text-left p-2 font-semibold">ID</th>
                                    <th scope="col" className="text-left p-2 font-semibold">Client</th>
                                    <th scope="col" className="text-left p-2 font-semibold">Date</th>
                                    <th scope="col" className="text-left p-2 font-semibold">Statut</th>
                                    <th scope="col" className="text-right p-2 font-semibold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.dernieresCommandes.map(c => (
                                    <tr key={c.id} className="hover:bg-neutral-100" role="row">
                                        <td className="p-2" role="cell">{c.id}</td>
                                        <td className="p-2" role="cell">{c.clientNom}</td>
                                        <td className="p-2" role="cell">{format(new Date(c.date_creation), 'dd/MM/yyyy')}</td>
                                        <td className="p-2" role="cell">
                                            <Badge >{c.status}</Badge>
                                        </td>
                                        <td className="p-2 text-right" role="cell">{c.totalLigne.toFixed(2)} MAD</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </section>

            {/* Paiements par mode */}
            <section aria-label="Répartition des paiements par mode">
                <Card>
                    <CardHeader>
                        <CardTitle>Répartition des paiements par mode</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.paiementsParMode.map(({ mode_paiement, _sum }) => {
                            const montant = _sum.montant_total ?? 0
                            const percent = totalPaiements ? ((montant / totalPaiements) * 100).toFixed(1) : '0'
                            return (
                                <div key={mode_paiement} className="mb-4">
                                    <div className="flex justify-between mb-1 font-medium">
                                        <span>{mode_paiement}</span>
                                        <span>{montant.toFixed(2)} MAD ({percent}%)</span>
                                    </div>
                                    <Progress value={parseFloat(percent)} aria-valuemin={0} aria-valuemax={100} aria-valuenow={parseFloat(percent)} />
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}
