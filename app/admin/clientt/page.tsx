import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ClientsList() {

    const clients = await prisma.client.findMany({
        include: { utilisateur: true, },
        orderBy: { date_inscription: 'desc', },
    })

    return (
        <div className="p-6 space-y-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Liste des Clients</h1>
            {clients.length === 0 && (
                <p className="text-muted-foreground">Aucun client trouvé.</p>
            )}

            {clients.map((client) => (
                <Card key={client.id}>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <div>
                                {client.utilisateur.nom}{" "}
                                <span className="text-sm text-gray-500">
                                    ({client.utilisateur.email})
                                </span>
                            </div>
                            <Link
                                href={`/admin/clientt/${client.id}`}
                                className="text-blue-600 underline text-sm"
                            >
                                Voir détails
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                        <p><span className="font-semibold">Téléphone :</span> {client.telephone || "Non renseigné"}</p>
                        <p><span className="font-semibold">Date d'inscription :</span> {new Date(client.date_inscription).toLocaleDateString()}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}