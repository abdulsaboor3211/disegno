import Image from "next/image";
import Link from "next/link";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_WHATSAPP_DISPLAY,
  WHATSAPP_CHAT_URL,
} from "@/data/contact";

export default function Footer() {
  return (
    <footer id="footer" className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/foot.png"
                alt="Disegno"
                width={140}
                height={42}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-grey-300 leading-relaxed">
              Premium handmade Peshawari Chappal chappals. Tradition meets
              elegance in every stitch.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-grey-300">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-grey-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#products"
                  className="text-sm text-grey-300 hover:text-white transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/#heritage"
                  className="text-sm text-grey-300 hover:text-white transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-grey-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
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
                  <Link
                    href="/contact"
                    className="text-sm text-grey-300 hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
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
                  href={CONTACT_MAILTO}
                  className="hover:text-white transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_CHAT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {CONTACT_WHATSAPP_DISPLAY}
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a
                href={WHATSAPP_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 border border-grey-500 flex items-center justify-center text-xs hover:border-burgundy-light hover:text-burgundy-light transition-colors"
              >
                W
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-grey-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-grey-500">
            &copy; {new Date().getFullYear()} Disegno Chappal. All rights reserved.
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
