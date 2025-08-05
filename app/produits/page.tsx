import React from 'react'
import ListProduits from './_components/list-produits'
import Navbar from '@/components/landing-page/navbar'

interface Props {
  searchParams: Promise<{ [key: string]: string }>
}

const ProduitsPage = async ({searchParams}: Props) => {

  const resolvedSearchParams = await searchParams
  return (
    <div>
      <Navbar />
      <h1 className='text-center mt-6 text-3xl font-bold'>Nos Produits</h1>
      <ListProduits search={resolvedSearchParams.search || ''}/>
    </div>
  )
}

export default ProduitsPage