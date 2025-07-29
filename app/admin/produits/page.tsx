import AddProduit from '@/app/admin/_components/add-produit'
import ListProduits from '@/app/admin/_components/list-produit'
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