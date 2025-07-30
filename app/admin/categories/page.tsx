import ListCategories from '@/app/admin/_components/list-categories'
import React from 'react'
import AddCategorie from '../_components/add-categorie'

const CategorieHome = () => {
  return (
    <div>
        <ListCategories />
        <AddCategorie />
    </div>
  )
}

export default CategorieHome