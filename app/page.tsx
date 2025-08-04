import Categories from "@/components/landing-page/categories";
import Hero from "@/components/landing-page/hero";
import Navbar from "@/components/landing-page/navbar";
import Services from "@/components/landing-page/services";
import TopSellers from "@/components/landing-page/top-sellers";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Categories />
      <TopSellers />
      <Services />
    </div>
  );
}
