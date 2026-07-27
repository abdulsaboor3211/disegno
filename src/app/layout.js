import { Manrope } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Disegno Chappal | Handmade Peshawari Chappals",
  description:
    "Premium handmade Peshawari Chappal chappals crafted from high-quality leather. Traditional Pakistani footwear for everyday wear and special occasions.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
