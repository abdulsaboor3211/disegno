import fs from "fs";
import path from "path";
import Image from "next/image";

const HERITAGE_IMAGE = "/footerr.webp";

function heritageImageExists() {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "footerr.webp"));
  } catch {
    return false;
  }
}

export default function HeritageSection() {
  const hasImage = heritageImageExists();

  return (
    <section id="heritage" className="py-14 sm:py-20 bg-grey-100 border-y border-grey-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative">
            <div className="bg-white border border-grey-200 p-1.5 sm:p-2 min-h-[220px] sm:min-h-[320px] flex items-center justify-center">
              {hasImage ? (
                <Image
                  src={HERITAGE_IMAGE}
                  alt="Handcrafted Peshawari Kheri detail"
                  width={720}
                  height={560}
                  className="w-full h-auto object-contain"
                />
              ) : null}
            </div>
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-action text-white p-5 sm:p-6 max-w-[200px]">
              <p className="font-serif text-2xl font-semibold">Since</p>
              <p className="font-serif text-4xl font-bold">Peshawar</p>
              <p className="text-xs uppercase tracking-widest mt-1 opacity-80">
                A tradition of craft
              </p>
            </div>
          </div>

          <div>
            <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
              Our Heritage
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-6 leading-tight">
              Preserving Culture, One Pair at a Time
            </h2>
            <div className="space-y-4 text-grey-700 text-sm sm:text-base leading-relaxed">
              <p>
                The Peshawari Kheri is a traditional shoe that showcases the rich
                culture of Peshawar. Handmade with care, these shoes symbolize
                craftsmanship and elegance. They are stylish, comfortable, and
                long-lasting, making them a popular choice for many.
              </p>
              <p>
                Disegno Kheri Chappal is crafted from high-quality leather, perfect
                for everyday wear and special occasions. Whether you&apos;re
                attending a family gathering or enjoying a casual outing with
                friends, this can elevate any outfit and add a touch of
                sophistication to your look.
              </p>
              <p>
                Each pair will reflect Disegno&apos;s commitment to provide the best
                comfortable and stylish product to the customer while keeping in
                mind to preserve the cultural heritage.
              </p>
            </div>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Premium genuine leather",
                "Hand-stitched contrast detailing",
                "Squared toe traditional design",
                "Adjustable ankle strap with buckle",
                "Durable sole for daily wear",
                "Crafted by skilled artisans",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-grey-700"
                >
                  <span className="text-burgundy mt-0.5 shrink-0">■</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
