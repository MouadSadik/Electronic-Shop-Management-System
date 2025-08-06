import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { notFound } from 'next/navigation'

type Props = {
    params: Promise<{ id: string }>
}

export default async function ClientPage({ params }: Props) {
    const {id} = await params
    const client = await prisma.client.findUnique({
        where: { id: parseInt(id) },
        include: {
            utilisateur: true,
            commande: true,
        },
    })

    if (!client) return notFound()

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Informations du Client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><span className="font-medium">Nom :</span> {client.utilisateur.nom}</p>
                    <p><span className="font-medium">Email :</span> {client.utilisateur.email}</p>
                    <p><span className="font-medium">Téléphone :</span> {client.telephone ?? 'Non renseigné'}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Commandes du Client</CardTitle>
                </CardHeader>
                <CardContent>
                    {client.commande.length === 0 ? ( <p>Ce client n’a passé aucune commande.</p>) : 
                    (
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {client.commande.map((commande) => (
                                <li key={commande.id}>
                                    Commande #{commande.id} – <span className="italic">{commande.status}</span> – {new Date(commande.date_creation).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}