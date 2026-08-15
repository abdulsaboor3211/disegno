import { getProducts } from "@/lib/googleSheets";
import ProductGrid from "./ProductGrid";

export default async function ProductsSection() {
  const products = await getProducts();
  console.log(products.length)
  return (
    <section id="products" className="pb-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            Our Collection
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Shop Peshawari Chappal
          </h2>
          <p className="text-grey-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Disegno handmade Peshawari chappals are crafted in Pakistan from high-quality
            leather, combining traditional craftsmanship with comfort and timeless style.
            Explore our collection of premium leather Peshawari chappals for everyday
            wear and special occasions.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
