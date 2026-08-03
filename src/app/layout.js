import { Manrope } from "next/font/google";
import Script from "next/script";
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
      <head>
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '806247228387804');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=806247228387804&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <CartProvider>
          {children}
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}

