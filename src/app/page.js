import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import HeritageSection from "@/components/HeritageSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductsSection />
        <HeritageSection />
      </main>
      <Footer />
    </>
  );
}
