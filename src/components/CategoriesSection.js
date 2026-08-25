"use client";

import Image from "next/image";
import Link from "next/link";
import { isValidImageSrc } from "@/lib/imageUrl";

export default function CategoriesSection({ categories }) {
    // If no categories, don't render
    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section className="py-14 sm:py-20 bg-cream border-b border-grey-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10 sm:mb-14">
                    <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                        Shop by Category
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
                        Our Collections
                    </h2>
                    <p className="text-grey-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        Explore our premium handmade Peshawari chappals and accessories
                        crafted with tradition and care.
                    </p>
                </div>

                {/* Category Grid - 4 columns on large screens */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/category/${category.slug}`}
                            className="group flex flex-col items-center text-center"
                        >
                            {/* Circular Image */}
                            <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-full overflow-hidden border-2 border-grey-200 group-hover:border-burgundy transition-colors duration-300">
                                {isValidImageSrc(category.image) ? (
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-cream">
                                        <span className="text-grey-400 text-xs">No image</span>
                                    </div>
                                )}

                                {/* Subtle overlay on hover */}
                                <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/10 transition-colors duration-300" />
                            </div>

                            {/* Category Name */}
                            <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground mt-4 group-hover:text-burgundy transition-colors">
                                {category.name}
                            </h3>

                            {/* Product Count */}
                            {category.count > 0 && (
                                <p className="text-xs text-grey-500 mt-0.5">
                                    {category.count} Products
                                </p>
                            )}
                        </Link>
                    ))}
                </div>

                {/* View All Link
                <div className="text-center mt-12">
                    <Link
                        href="/#products"
                        className="inline-flex items-center justify-center px-8 py-3 border-2 border-burgundy text-burgundy text-sm font-semibold uppercase tracking-wider hover:bg-action hover:text-white transition-colors duration-300"
                    >
                        View All Products
                    </Link>
                </div> */}
            </div>
        </section>
    );
}