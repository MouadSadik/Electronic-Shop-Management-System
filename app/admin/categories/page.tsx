import AddCategorie from '@/components/add-categorie'
import ListCategories from '@/components/list-categories'
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