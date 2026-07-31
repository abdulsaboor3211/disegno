import Header from "@/components/Header";
import Banner from "@/components/Banner";
import ProductsSection from "@/components/ProductsSection";
import HeritageSection from "@/components/HeritageSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Disegno",
  url: "https://disegnoproducts.com",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Disegno",
  url: "https://disegnoproducts.com",
  logo: "https://disegnoproducts.com/logo.jpeg",
};

export default function Home() {
  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />

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