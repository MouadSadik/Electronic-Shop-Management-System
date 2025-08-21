'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    setIsLoaded(true) // Prevent hydration mismatch
    
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Prevent hydration mismatch by not rendering until loaded
  if (!isLoaded) {
    return (
      <section className="w-full py-10 h-screen">
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-10">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-6"></div>
              <div className="flex gap-4">
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
                <div className="h-10 w-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-[400px] h-[400px] bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full pt-20 h-screen">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-10">
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className={`font-bold leading-tight text-gray-900 ${
            isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'
          }`}>
            Boostez votre setup tech <br />
            <span className="text-primary">avec les meilleurs produits</span>
          </h1>
          
          <p className={`text-muted-foreground ${
            isMobile ? 'text-base' : 'text-lg'
          }`}>
            Découvrez notre sélection de PC, accessoires gaming, et appareils électroniques haut de gamme.
          </p>

          <div className={`flex gap-4 ${
            isMobile ? 'flex-col' : 'justify-center md:justify-start'
          }`}>
            <Link href="/produits">
              <Button size={isMobile ? "default" : "lg"} className="w-full md:w-auto">
                Acheter maintenant
              </Button>
            </Link>
            <Link href="/produits">
              <Button 
                variant="outline" 
                size={isMobile ? "default" : "lg"}
                className="w-full md:w-auto"
              >
                Explorer les catégories
              </Button>
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/hero.svg"
            alt="PC"
            width={isMobile ? 300 : 500}
            height={isMobile ? 300 : 500}
            className=""
            priority
          />
        </div>
      </div>
    </section>
  )
}