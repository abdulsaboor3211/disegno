import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/data/products";

export default function ProductCard({ product }) {
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.productPrice;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.productPrice - product.discountPrice) /
          product.productPrice) *
          100
      )
    : 0;

  return (
    <article className="group bg-white border border-grey-200 hover:border-burgundy/40 transition-colors flex flex-col">
      <div className="relative aspect-square bg-grey-100 overflow-hidden">
        <Link href={`/products/${encodeURIComponent(product.sku)}`}>
          <Image
            src={product.productImage}
            alt={product.productName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {hasDiscount && (
          <span className="absolute bottom-3 right-3 bg-burgundy text-white text-xs font-bold px-2 py-1 uppercase tracking-wide">
            -{discountPercent}%
          </span>
        )}
        {product.status === "Active" && (
          <span className="absolute top-3 right-3 bg-white border border-grey-200 text-grey-700 text-[10px] font-medium px-2 py-1 uppercase tracking-wide">
            {product.color}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 border-t border-grey-200">
        <p className="text-[10px] text-grey-500 uppercase tracking-widest mb-1">
          SKU: {product.sku}
        </p>
        <Link href={`/products/${encodeURIComponent(product.sku)}`}>
          <h3 className="font-serif text-base font-semibold text-foreground leading-snug mb-2 group-hover:text-burgundy transition-colors">
            {product.productName}
          </h3>
        </Link>
        <p className="text-sm text-grey-500 leading-relaxed line-clamp-2 mb-4 flex-1">
          {product.productDescription}
        </p>

        <div className="flex items-end justify-between gap-2 mt-auto pt-3 border-t border-grey-100">
          <div>
            {hasDiscount ? (
              <>
                <p className="text-lg font-bold text-burgundy">
                  {formatPrice(product.discountPrice)}
                </p>
                <p className="text-sm text-grey-500 line-through">
                  {formatPrice(product.productPrice)}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-foreground">
                {formatPrice(product.productPrice)}
              </p>
            )}
          </div>
          <Link
            href={`/products/${encodeURIComponent(product.sku)}`}
            className="px-4 py-2 bg-burgundy text-white text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-dark transition-colors shrink-0"
          >
            View Varieties
          </Link>
        </div>
      </div>
    </article>
  );
}
