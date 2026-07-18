import Image from "next/image";

const HERO_IMAGE = "/home-hero.webp";
const ABOVE_HERO_IMAGE = "/above-hero.png";

export default function Hero() {
  return (
    <section className="relative bg-cream border-b border-grey-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 pb-10">
          <div className="text-center lg:text-left">
            <p className="text-burgundy text-[10px] sm:text-sm font-semibold uppercase mb-3 sm:mb-4">
              Handmade Traditional Peshawari Chappal
            </p>
            <h1 className="font-sans text-2xl sm:text-4xl lg:text-6xl font-semibold text-foreground leading-tight sm:leading-tight lg:leading-tight mb-4 sm:mb-6">
              Where Heritage Meets{" "}
              <span className="text-burgundy">Modern Craftsmanship</span>
            </h1>
            <p className="text-grey-700 text-sm sm:text-base lg:text-lg leading-snug sm:leading-relaxed max-w-lg mx-auto lg:mx-0 mb-4 sm:mb-6">
              Rooted in the rich traditions of Peshawar, the Peshawari Chappal
              has been a symbol of culture, durability, and timeless style for
              generations. At Disegno, every pair is handcrafted by experienced
              artisans using premium leather and traditional techniques that
              have been passed down through generations.
            </p>
            <p className="text-grey-700 text-sm sm:text-base lg:text-lg leading-snug sm:leading-relaxed max-w-lg mx-auto lg:mx-0 mb-5 sm:mb-8">
              While preserving its authentic heritage, we thoughtfully refine each
              design with modern comfort, premium materials, and precise
              craftsmanship. From classic handmade styles to contemporary
              interpretations, our collection is created for those who appreciate
              tradition without compromising on quality or everyday comfort.
            </p>
            <p className="text-grey-600 text-xs sm:text-sm italic leading-snug sm:leading-relaxed max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8">
              Every step in a Disegno Peshawari Chappal carries a story of
              craftsmanship, culture, and excellence.
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
              <div className="flex items-center justify-center gap-6 sm:gap-8 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-grey-200">
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-semibold text-burgundy">Authentic</p>
                  <p className="text-[10px] sm:text-xs text-grey-500 uppercase tracking-wide mt-0.5">
                    Handmade
                  </p>
                </div>
                <div className="w-px h-8 sm:h-10 bg-grey-200" />
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-semibold text-burgundy">Premium</p>
                  <p className="text-[10px] sm:text-xs text-grey-500 uppercase tracking-wide mt-0.5">
                    Leather
                  </p>
                </div>
                <div className="w-px h-8 sm:h-10 bg-grey-200" />
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-semibold text-burgundy">Timeless</p>
                  <p className="text-[10px] sm:text-xs text-grey-500 uppercase tracking-wide mt-0.5">
                    Design
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
