import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.json()
    const { factureId } = body

    try {
        const dateNow = new Date()

        // Récupérer la facture
        const facture = await prisma.facture.findUnique({
            where: { id: factureId },
            include: {
                commandes: {
                    include: {
                        commande: true,
                    },
                },
            },
        })

        if (!facture) {
            return NextResponse.json({ message: 'Facture introuvable' }, { status: 404 })
        }

        // Récupérer le montant total de la facture
        const montant_total = facture.total

        // Récupérer le mode de paiement depuis la première commande liée
        const commande = facture.commandes[0]?.commande
        if (!commande) {
            return NextResponse.json({ message: 'Commande liée introuvable' }, { status: 404 })
        }

        //const mode_paiement = commande.mode_paiement

        const result = await prisma.$transaction(async (tx) => {
            // Créer le paiement
            const paiement = await tx.paiement.create({
                data: {
                    date: dateNow,
                    mode_paiement: commande.mode_paiement!
                    ,
                    montant_total,
                },
            })

            // Créer la ligne de paiement
            await tx.lignePaiement.create({
                data: {
                    paiement_id: paiement.id,
                    facture_id: factureId,
                    montant: montant_total,
                },
            })

            // Récupérer les commandes liées à cette facture
            const commandesFacture = await tx.commandeFacture.findMany({
                where: {
                    facture_id: factureId,
                },
            })

            // Mettre à jour le statut des commandes
            const updateCommandes = commandesFacture.map((cf) =>
                tx.commande.update({
                    where: { id: cf.commande_id },
                    data: { status: 'FACTUREE' },
                })
            )

            await Promise.all(updateCommandes)

            return paiement
        })

        return NextResponse.json(result, { status: 201 })
    }  catch (error) {
    console.error('Erreur paiement:', error)
    return NextResponse.json(
        { message: 'Erreur lors de l\'enregistrement du paiement', detail: error },
        { status: 500 }
    )
}

}
