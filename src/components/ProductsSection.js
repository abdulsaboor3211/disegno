import { getProducts } from "@/lib/googleSheets";
import ProductGrid from "./ProductGrid";

export default async function ProductsSection() {
  const products = await getProducts();
  console.log(products.length)
  return (
    <section id="products" className="pb-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
