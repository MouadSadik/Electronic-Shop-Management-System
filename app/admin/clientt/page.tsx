import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ClientsList() {

    const clients = await prisma.client.findMany({
        include: { utilisateur: true, },
        orderBy: { date_inscription: 'desc', },
    })

    return (
        <div className="p-4 md:p-6 space-y-4 max-w-4xl mt-6 md:mt-10 mx-auto">
            <h1 className="text-xl md:text-2xl font-bold mb-4 px-2 md:px-0">
                Liste des Clients
            </h1>
            
            {clients.length === 0 && (
                <p className="text-muted-foreground text-center py-8 px-2">
                    Aucun client trouvé.
                </p>
            )}

            {clients.map((client) => (
                <Card key={client.id} className="mx-2 md:mx-0">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-base md:text-lg break-words">
                                    {client.utilisateur.nom}
                                </div>
                                <div className="text-sm text-gray-500 break-all">
                                    {client.utilisateur.email}
                                </div>
                            </div>
                            <Link
                                href={`/admin/clientt/${client.id}`}
                                className="text-blue-600 hover:text-blue-800 underline text-sm font-medium whitespace-nowrap self-start"
                            >
                                Voir détails
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2 pt-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <p className="break-words">
                                <span className="font-semibold">Téléphone :</span>{" "}
                                <span className="text-gray-700">
                                    {client.telephone || "Non renseigné"}
                                </span>
                            </p>
                            <p className="break-words">
                                <span className="font-semibold">Inscription :</span>{" "}
                                <span className="text-gray-700">
                                    {new Date(client.date_inscription).toLocaleDateString()}
                                </span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}