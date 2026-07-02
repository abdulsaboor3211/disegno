import { getProducts } from "@/lib/googleSheets";
import ProductCard from "./ProductCard";

export default async function ProductsSection() {
  const products = await getProducts();

  return (
    <section id="products" className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            Our Collection
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Shop Peshawari Kheri
          </h2>
          <p className="text-grey-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Disegno Kheri Chappal is crafted from high-quality leather, perfect for
            everyday wear and special occasions. Each pair reflects our
            commitment to comfort, style, and cultural heritage.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {["All", "Burgundy", "Brown", "Black", "Tan", "Maroon"].map(
            (filter) => (
              <button
                key={filter}
                type="button"
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  filter === "All"
                    ? "bg-burgundy text-white border-burgundy"
                    : "bg-white text-grey-700 border-grey-300 hover:border-burgundy hover:text-burgundy"
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            type="button"
            className="inline-flex items-center justify-center px-10 py-3.5 border-2 border-burgundy text-burgundy text-sm font-semibold uppercase tracking-wider hover:bg-burgundy hover:text-white transition-colors"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
}
