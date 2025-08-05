import React from 'react'
import ListProduits from './_components/list-produits'
import Navbar from '@/components/landing-page/navbar'

interface Props {
  searchParams: { [key: string]: string }
}

const ProduitsPage = ({searchParams}: Props) => {
  return (
    <div>
      <Navbar />
      <h1 className='text-center mt-6 text-3xl font-bold'>Nos Produits</h1>
      <ListProduits search={searchParams.search || ''}/>
    </div>
  )
}

export default ProduitsPage