import Image from "next/image";

const BANNER_IMAGE = "/home-banner-new.webp";

export default function Banner() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full sm:h-[60vh] lg:h-[72vh] xl:h-[78vh]">
        <div className="relative w-full aspect-video sm:aspect-auto sm:h-full">
          <Image
            src={BANNER_IMAGE}
            alt="Disegno Banner"
            fill
            className="object-contain sm:object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  );
}
