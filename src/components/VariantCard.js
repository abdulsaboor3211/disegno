import Image from "next/image";
import { formatPrice } from "@/data/products";

export default function VariantCard({ variant }) {
  const hasDiscount =
    variant.variantDiscountPrice &&
    variant.variantDiscountPrice < variant.variantOriginalPrice;
  const discountPercent = hasDiscount
    ? Math.round(
        ((variant.variantOriginalPrice - variant.variantDiscountPrice) /
          variant.variantOriginalPrice) *
          100
      )
    : 0;

  return (
    <article className="group bg-white border border-grey-200 hover:border-burgundy/40 transition-colors flex flex-col">
      <div className="relative aspect-square bg-grey-100 overflow-hidden">
        <Image
          src={variant.variantImage}
          alt={`${variant.color || "Kheri"} size ${variant.size || ""}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <span className="absolute bottom-3 right-3 bg-burgundy text-white text-xs font-bold px-2 py-1 uppercase tracking-wide">
            -{discountPercent}%
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white border border-grey-200 text-grey-700 text-[10px] font-medium px-2 py-1 uppercase tracking-wide">
          {variant.status || "Active"}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 border-t border-grey-200">
        <p className="text-[10px] text-grey-500 uppercase tracking-widest mb-1">
          SKU: {variant.productSku}
        </p>
        <h3 className="font-serif text-base font-semibold text-foreground leading-snug mb-3 group-hover:text-burgundy transition-colors">
          {variant.color || "Classic"} Kheri
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="border border-grey-200 p-2">
            <p className="text-[10px] text-grey-500 uppercase tracking-wider">
              Size
            </p>
            <p className="text-sm font-semibold text-foreground">
              {variant.size || "Standard"}
            </p>
          </div>
          <div className="border border-grey-200 p-2">
            <p className="text-[10px] text-grey-500 uppercase tracking-wider">
              Color
            </p>
            <p className="text-sm font-semibold text-foreground">
              {variant.color || "Default"}
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 mt-auto pt-3 border-t border-grey-100">
          <div>
            {hasDiscount ? (
              <>
                <p className="text-lg font-bold text-burgundy">
                  {formatPrice(variant.variantDiscountPrice)}
                </p>
                <p className="text-sm text-grey-500 line-through">
                  {formatPrice(variant.variantOriginalPrice)}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-foreground">
                {formatPrice(variant.variantOriginalPrice)}
              </p>
            )}
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-burgundy text-white text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-dark transition-colors shrink-0"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
