"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/#products" },
  { label: "Our Story", href: "/#heritage" },
  { label: "Contact", href: "/#footer" },
];

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-grey-200">
      <div className="bg-action text-white text-center text-xs tracking-widest uppercase py-2 px-4">
        Free delivery on orders above Rs. 5,000 across Pakistan
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/navbar.png"
              alt="Disegno"
              width={160}
              height={48}
              className="h-8 sm:h-10 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-grey-700 hover:text-burgundy transition-colors uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/cart"
              aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
              className="relative p-2 text-grey-700 hover:text-burgundy transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-action text-white text-[10px] font-bold min-w-4 h-4 px-0.5 flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label="Menu"
              className="md:hidden p-2 text-grey-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
