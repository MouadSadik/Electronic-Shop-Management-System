import { Gamepad2, Headphones, Laptop, Smartphone, Tv2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Categories = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6 px-4 md:justify-around md:mx-10">
      {[{
        href: "/produits/categorie/2",
        Icon: Laptop,
        label: "Pc Portable"
      }, {
        href: "/produits/categorie/2",
        Icon: Gamepad2,
        label: "Gaming"
      }, {
        href: "/produits/categorie/2",
        Icon: Smartphone,
        label: "Smartphone"
      }, {
        href: "/produits/categorie/2",
        Icon: Headphones,
        label: "Les Ecouteurs"
      }, {
        href: "/produits/categorie/2",
        Icon: Tv2,
        label: "TV"
      }].map(({ href, Icon, label }) => (
        <Link key={label} href={href} className="flex flex-col items-center text-xl gap-4 w-32 sm:w-40">
          <div className="border-4 border-gray-600 rounded-full p-4 transition-transform duration-300 hover:scale-110">
            <Icon className="w-20 h-20 sm:w-32 sm:h-32 text-primary" />
          </div>
          <h2 className="font-bold text-primary text-center">{label}</h2>
        </Link>
      ))}
    </div>
  )
}

export default Categories
