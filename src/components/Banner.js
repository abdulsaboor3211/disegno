import Image from "next/image";

const BANNER_IMAGE = "/home-banner-2.webp";

export default function Banner() {
  return (
    <section className="relative w-full overflow-hidden">
      <Image
        src={BANNER_IMAGE}
        alt="Disegno Banner"
        width={1920}
        height={800}
        className="w-full h-auto"
        priority
        sizes="100vw"
      />
    </section>
  );
}
