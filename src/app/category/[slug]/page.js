import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts, getCategoriesFromSheet } from "@/lib/googleSheets";
import { isValidImageSrc } from "@/lib/imageUrl";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const categories = await getCategoriesFromSheet();
    const category = categories.find((c) => c.slug === slug);

    if (!category) {
        return {
            title: "Category Not Found | Disegno",
        };
    }

    return {
        title: `${category.name} | Disegno`,
        description: `Shop ${category.name} collection from Disegno. Premium handmade Peshawari chappals and accessories.`,
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    const categories = await getCategoriesFromSheet();
    const category = categories.find((c) => c.slug === slug);

    if (!category) {
        notFound();
    }

    const products = await getProducts();
    const categoryProducts = products.filter(
        (product) => product.category === category.name
    );

    return (
        <>
            <Header />
            <main className="bg-cream min-h-screen border-b border-grey-200">
                <section className="py-10 sm:py-14">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Back link */}
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm text-grey-700 hover:text-burgundy mb-8"
                        >
                            ← Back to home
                        </Link>

                        {/* Category Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                            {/* Category Image */}
                            {isValidImageSrc(category.image) && (
                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-grey-200 flex-shrink-0">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            <div>
                                <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-2">
                                    Category
                                </p>
                                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                                    {category.name}
                                </h1>
                                <p className="text-grey-500 text-sm mt-1">
                                    {categoryProducts.length} Products
                                </p>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {categoryProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                                {categoryProducts.map((product) => (
                                    <ProductCard key={product.sku} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white border border-grey-200">
                                <p className="text-grey-500">No products found in this category.</p>
                                <Link
                                    href="/#products"
                                    className="inline-block mt-4 text-burgundy hover:underline"
                                >
                                    Browse all products
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}