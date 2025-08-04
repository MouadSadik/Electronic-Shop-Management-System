'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="w-full  py-10 h-screen">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-10">

        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            Boostez votre setup tech <br />
            <span className="text-primary">avec les meilleurs produits</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Découvrez notre sélection de PC, accessoires gaming, et appareils électroniques haut de gamme.
          </p>

          <div className="flex justify-center md:justify-start gap-4">
            <Link href="/produits">
              <Button size="lg">Acheter maintenant</Button>
            </Link>
            <Link href="/categories">
              <Button variant="outline" size="lg">Explorer les catégories</Button>
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/images/hero.png"
            alt="PC"
            width={400}
            height={400}
            className="rounded-xl shadow-lg"
          />
        </div>

      </div>
    </section>
  )
}