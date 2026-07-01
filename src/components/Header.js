import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Shop", href: "#products" },
  { label: "Our Story", href: "#heritage" },
  { label: "Contact", href: "#footer" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-grey-200">
      <div className="bg-burgundy text-white text-center text-xs tracking-widest uppercase py-2 px-4">
        Free delivery on orders above Rs. 5,000 across Pakistan
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/disegno-kheri-logo.png"
              alt="Disegno Kheri logo"
              width={44}
              height={44}
              className="object-contain"
            />
            <div className="hidden sm:block">
              <span className="font-serif text-xl font-semibold text-burgundy tracking-wide">
                Disegno Kheri
              </span>
              <p className="text-[10px] text-grey-500 uppercase tracking-[0.2em] -mt-0.5">
                Peshawari Chappals
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-grey-700 hover:text-burgundy transition-colors uppercase tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              aria-label="Search"
              className="p-2 text-grey-700 hover:text-burgundy transition-colors"
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
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Cart"
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
              <span className="absolute -top-0.5 -right-0.5 bg-burgundy text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
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
