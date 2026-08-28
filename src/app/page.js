import Header from "@/components/Header";
import Banner from "@/components/Banner";
import ProductsSection from "@/components/ProductsSection";
import HeritageSection from "@/components/HeritageSection";
import CategoriesSection from "@/components/CategoriesSection";
import { getCategoriesFromSheet } from "@/lib/googleSheets"; //

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

export default async function Home() {
  const categories = await getCategoriesFromSheet();

  console.log("Categories:", categories); // 👈 Check terminal for output

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />

      <Header />

      <main>
        <Banner />
        <CategoriesSection categories={categories} />
        <ProductsSection />
        <HeritageSection />
      </main>

      <Footer />
    </>
  );
}