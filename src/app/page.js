import Header from "@/components/Header";
import Banner from "@/components/Banner";
import ProductsSection from "@/components/ProductsSection";
import HeritageSection from "@/components/HeritageSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Banner />
        <ProductsSection />
        <HeritageSection />
      </main>
      <Footer />
    </>
  );
}
