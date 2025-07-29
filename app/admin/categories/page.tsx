import AddCategorie from '@/components/add-categorie'
import ListCategories from '@/app/admin/_components/list-categories'
import React from 'react'

const CategorieHome = () => {
  return (
    <div>
        <ListCategories />
        <AddCategorie />
    </div>
  )
}

export default CategorieHome