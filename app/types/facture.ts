type Facture = {
    id: number
    numero: string
    date: string
    total: number
    commandes: {
        commande: {
            id: number
            status: string
        }
    }[]
    paiements: {
        id: number
        montant: number
        date: string
    }[]
}