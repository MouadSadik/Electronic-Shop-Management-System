import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalUtilisateurs = await prisma.utilisateur.count();

    const totalCommandes = await prisma.commande.count();

    const commandesParStatut = await prisma.commande.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    // Chiffre d'affaires total (somme total des factures)
    const caTotalAgg = await prisma.facture.aggregate({
      _sum: { total: true }
    });
    const caTotal = caTotalAgg._sum.total ?? 0;

    // Produits en stock faible (<=5)
    const produitsStockFaible = await prisma.produit.count({
      where: { stock: { lte: 5 } }
    });

    // Dernières commandes (5 dernières)
    const dernieresCommandes = await prisma.commande.findMany({
      orderBy: { date_creation: 'desc' },
      take: 5,
      include: {
        client: {
          select: {
            utilisateur: { select: { nom: true } }
          }
        },
        LigneCommande: true
      }
    });

    // Paiements par mode
    const paiementsParMode = await prisma.paiement.groupBy({
      by: ['mode_paiement'],
      _sum: { montant_total: true }
    });

    return NextResponse.json({
      totalUtilisateurs,
      totalCommandes,
      commandesParStatut,
      caTotal,
      produitsStockFaible,
      dernieresCommandes: dernieresCommandes.map(cmd => ({
        id: cmd.id,
        date_creation: cmd.date_creation,
        status: cmd.status,
        clientNom: cmd.client.utilisateur.nom,
        totalLigne: cmd.LigneCommande.reduce((acc, lc) => acc + lc.prix_unitaire * lc.quantite, 0),
      })),
      paiementsParMode,
    });

  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' + err }, { status: 500 });
  }
}
