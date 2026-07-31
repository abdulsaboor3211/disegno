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
  metadataBase: new URL("https://disegnoproducts.com"),

  title: {
    default: "Disegno | Handmade Peshawari Chappals",
    template: "%s | Disegno",
  },

  description:
    "Shop premium handmade Peshawari chappals crafted from high-quality leather. Traditional Pakistani footwear designed for everyday wear and special occasions.",

  icons: {
    icon: "/favicon.png",
  },

  openGraph: {
    title: "Disegno | Handmade Peshawari Chappals",
    description:
      "Shop premium handmade Peshawari chappals crafted from high-quality leather. Traditional Pakistani footwear designed for everyday wear and special occasions.",
    url: "/",
    siteName: "Disegno",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Disegno | Handmade Peshawari Chappals",
    description:
      "Shop premium handmade Peshawari chappals crafted from high-quality leather. Traditional Pakistani footwear designed for everyday wear and special occasions.",
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