"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogAction
} from "@/components/ui/alert-dialog"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

interface LigneCommande {
    id: number
    quantite: number
    produit: {
        id: number
        nom: string
        prix: number
    }
}

export default function PanierDialog() {
    const [open, setOpen] = useState(false)
    const [lignes, setLignes] = useState<LigneCommande[]>([])
    const [commandeId, setCommandeId] = useState<number | null>(null)
    const [ligneASupprimer, setLigneASupprimer] = useState<LigneCommande | null>(null)

    useEffect(() => {
        if (open) {
            fetch("/api/commande/devis", {
                method: "POST",
            })
                .then((res) => res.json())
                .then((data) => {
                    setLignes(data.lignes)
                    setCommandeId(data.commandeId) // 👈 récupérer l'id de la commande
                })
                .catch((err) => console.error(err))
        }
    }, [open])

    const updateQuantite = async (ligneId: number, nouvelleQuantite: number) => {
        await fetch("/api/panier/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ligneCommandeId: ligneId, quantite: nouvelleQuantite }),
        })
        setLignes((prev) =>
            prev.map((ligne) =>
                ligne.id === ligneId ? { ...ligne, quantite: nouvelleQuantite } : ligne
            )
        )
    }

    const supprimer = async (ligneId: number) => {
        await fetch("/api/panier/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ligneCommandeId: ligneId }),
        })
        setLignes((prev) => prev.filter((ligne) => ligne.id !== ligneId))
        setLigneASupprimer(null)
    }

    const totalProduits = lignes.reduce((total, ligne) => total + ligne.quantite, 0)
    const totalPrix = lignes.reduce((total, ligne) => total + ligne.quantite * ligne.produit.prix, 0)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="relative">
                    <ShoppingCart className="h-10 w-10" />
                    {totalProduits > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                            {totalProduits}
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Votre Panier</DialogTitle>
                </DialogHeader>
                {lignes.length === 0 ? (
                    <p className="text-center py-4">Panier vide</p>
                ) : (
                    <div className="space-y-4">
                        {lignes.map((ligne) => (
                            <div
                                key={ligne.id}
                                className="flex justify-between items-center border p-2 rounded-md gap-4"
                            >
                                <div className="flex-1">
                                    <p className="font-semibold">{ligne.produit.nom}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {ligne.produit.prix} MAD x {ligne.quantite}
                                    </p>
                                </div>

                                <div className="flex gap-2 items-center">
                                    <Button variant="outline" size="sm"
                                        onClick={() => updateQuantite(ligne.id, ligne.quantite - 1)}
                                        disabled={ligne.quantite <= 1}
                                    >
                                        -
                                    </Button>
                                    <span>{ligne.quantite}</span>
                                    <Button variant="outline" size="sm"
                                        onClick={() => updateQuantite(ligne.id, ligne.quantite + 1)}
                                    >
                                        +
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm"
                                                onClick={() => setLigneASupprimer(ligne)}
                                            >
                                                Supprimer
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirmer la suppression ?</AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <p>Êtes-vous sûr de vouloir supprimer ce produit du panier ?</p>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => {
                                                        if (ligneASupprimer) supprimer(ligneASupprimer.id)
                                                    }}
                                                >
                                                    Confirmer
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))}

                        <div className="text-right font-semibold text-lg border-t pt-4">
                            Total : {totalPrix.toFixed(2)} MAD
                        </div>

                        {commandeId && (
                            <Link href={`/dashboard/paiements/${commandeId}`}>
                                <Button className="w-full" onClick={() => {
                                    setOpen(false)
                                }}>
                                    Confirmer la commande
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}