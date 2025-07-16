import AddProduit from '@/components/add-produit'
import ListProduits from '@/components/list-produit'
import React from 'react'

const Produits = () => {
  return (
    <div>
      <ListProduits />
      <AddProduit />
    </div>
  )
}

export default Produits