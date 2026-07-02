import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="footer" className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.jpeg"
                alt="Disegno Kheri"
                width={66}
                height={66}
                className="object-contain"
              />
              <span className="font-serif text-lg font-semibold">Disegno Kheri</span>
            </Link>
            <p className="text-sm text-grey-300 leading-relaxed">
              Premium handmade Peshawari Kheri chappals. Tradition meets
              elegance in every stitch.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-grey-300">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Home", "Shop", "Our Story", "Size Guide", "Contact"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-grey-300 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-grey-300">
              Customer Care
            </h4>
            <ul className="space-y-2">
              {[
                "Shipping & Delivery",
                "Returns & Exchange",
                "Track Order",
                "FAQs",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-grey-300 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-grey-300">
              Contact Us
            </h4>
            <ul className="space-y-2 text-sm text-grey-300">
              <li>Peshawar, Pakistan</li>
              <li>
                <a
                  href="mailto:info@disegnokheri.com"
                  className="hover:text-white transition-colors"
                >
                  info@disegnokheri.com
                </a>
              </li>
              <li>+92 300 0000000</li>
            </ul>
            <div className="flex gap-3 mt-5">
              {["Facebook", "Instagram", "WhatsApp"].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="w-9 h-9 border border-grey-500 flex items-center justify-center text-xs hover:border-burgundy-light hover:text-burgundy-light transition-colors"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-grey-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-grey-500">
            &copy; {new Date().getFullYear()} Disegno Kheri. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-grey-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
