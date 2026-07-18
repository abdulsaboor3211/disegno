"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";

const BANNER_IMAGE = "/Circle.webp";
const BANNER_GIF = "/Circle+Animation-1.gif";

export default function Banner() {
  const [gifReady, setGifReady] = useState(false);
  const gifRef = useRef(null);

  useEffect(() => {
    const img = gifRef.current;
    if (!img) return;

    if (img.complete) {
      setGifReady(true);
    } else {
      const onLoad = () => setGifReady(true);
      img.addEventListener("load", onLoad);
      return () => img.removeEventListener("load", onLoad);
    }
  }, []);

  return (
    <section className="relative w-full bg-black overflow-hidden">
      <div className="relative w-full h-[50vh] sm:h-[81vh] lg:h-[96vh] xl:h-[110vh]">
        {!gifReady && (
          <Image
            src={BANNER_IMAGE}
            alt="Disegno Kheri Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}

        <img
          ref={gifRef}
          src={BANNER_GIF}
          alt="Disegno Kheri Banner Animation"
          className={`absolute inset-0 w-full h-full object-cover ${
            gifReady ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="absolute inset-0 bg-black/20" />
      </div>
    </section>
  );
}
