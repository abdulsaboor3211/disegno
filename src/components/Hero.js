import Image from "next/image";

const HERO_IMAGE = "/home-hero.webp";
const ABOVE_HERO_IMAGE = "/above-hero.png";

export default function Hero() {
  return (
    <section className="relative bg-cream border-b border-grey-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 sm:py-16 lg:py-20">
          <div className="text-center lg:text-left">
            <p className="text-burgundy text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-4">
              Handmade in Peshawar
            </p>
            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6">
              Peshawari Kheri
              <span className="block text-burgundy mt-1">Crafted with Heritage</span>
            </h1>
            <p className="text-grey-700 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8">
              The Peshawari Kheri is a traditional shoe that showcases the rich
              culture of Peshawar. Handmade with care, these shoes symbolize
              craftsmanship and elegance — stylish, comfortable, and long-lasting.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href="#products"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-action text-white text-sm font-semibold uppercase tracking-wider hover:bg-action-dark transition-colors"
              >
                Shop Collection
              </a>
              <a
                href="#heritage"
                className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-grey-300 text-grey-700 text-sm font-semibold uppercase tracking-wider hover:border-burgundy hover:text-burgundy transition-colors"
              >
                Our Story
              </a>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-10 pt-8 border-t border-grey-200">
              <div>
                <p className="font-serif text-2xl font-semibold text-burgundy">100%</p>
                <p className="text-xs text-grey-500 uppercase tracking-wide mt-0.5">
                  Genuine Leather
                </p>
              </div>
              <div className="w-px h-10 bg-grey-200" />
              <div>
                <p className="font-serif text-2xl font-semibold text-burgundy">Hand</p>
                <p className="text-xs text-grey-500 uppercase tracking-wide mt-0.5">
                  Stitched
                </p>
              </div>
              <div className="w-px h-10 bg-grey-200" />
              <div>
                <p className="font-serif text-2xl font-semibold text-burgundy">PK</p>
                <p className="text-xs text-grey-500 uppercase tracking-wide mt-0.5">
                  Nationwide
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl lg:max-w-2xl">
              <div className="mb-3 sm:mb-4 px-1">
                <Image
                  src={ABOVE_HERO_IMAGE}
                  alt="Disegno"
                  width={720}
                  height={120}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-burgundy/5 translate-x-3 translate-y-3" />
                <div className="relative bg-white border border-grey-200 p-2 sm:p-3">
                  <Image
                    src={HERO_IMAGE}
                    alt="Peshawari Kheri - Burgundy leather chappal"
                    width={720}
                    height={720}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
