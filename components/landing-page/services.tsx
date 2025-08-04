import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Wrench,
  Headphones,
  LucideIcon,
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  ShieldCheck,
  Truck,
  RotateCcw,
  Wrench,
  Headphones,
}

type Avantage = {
  title: string
  icon: keyof typeof icons 
}

const avantages: Avantage[] = [
  { title: "Garanties Produits", icon: "ShieldCheck" },
  { title: "Livraison & Installation", icon: "Truck" },
  { title: "Retours & Remboursements", icon: "RotateCcw" },
  { title: "Service Après-Vente", icon: "Wrench" },
  { title: "Support 24/7", icon: "Headphones" },
]

const Garanties = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 py-20 px-4 max-w-6xl mx-auto ">
      {avantages.map((item, index) => {
        const Icon = icons[item.icon]
        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center border rounded-xl p-4  text-center shadow-sm hover:shadow-md hover:scale-105 transition bg-white dark:bg-gray-900"
          >
            <div className="p-3 rounded-full border border-primary mb-3">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <p className="font-semibold text-sm sm:text-base">{item.title}</p>
          </div>
        )
      })}
    </div>
  )
}

export default Garanties
