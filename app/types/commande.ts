type Commande = {
  id: number
  date_commande: string
  statut: string
  client: {
    id: number
    nom: string
  }
  lignes_commande: {
    id: number
    produit: {
      id: number
      nom: string
    }
    quantite: number
    prix_unitaire: number
  }[]
}