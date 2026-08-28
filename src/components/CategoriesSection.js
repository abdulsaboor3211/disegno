"use client";

import Image from "next/image";
import Link from "next/link";
import { isValidImageSrc } from "@/lib/imageUrl";

export default function CategoriesSection({ categories }) {
    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section className="py-8 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Restored Section Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="font-sans text-xl sm:text-2xl font-semibold text-gray-900 tracking-wide">
                        Trending Categories
                    </h2>
                </div>

                {/* Category Grid - Adjusted circle sizing */}
                <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10">
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/category/${category.slug}`}
                            className="group flex flex-col items-center text-center w-24 sm:w-28 md:w-32"
                        >
                            {/* Circular Image Container (Sized down to 24-32 Tailwind units) */}
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-100 transition-transform duration-300 group-hover:scale-105">
                                {isValidImageSrc(category.image) ? (
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <span className="text-gray-400 text-[10px] uppercase tracking-wider">No Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Category Name */}
                            <h3 className="font-sans text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider mt-3 group-hover:text-burgundy transition-colors">
                                {category.name}
                            </h3>

                            {/* Optional Product Count */}
                            {category.count > 0 && (
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                    {category.count} Products
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}