import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_WHATSAPP_DISPLAY,
  WHATSAPP_CHAT_URL,
} from "@/data/contact";

export const metadata = {
  title: "Contact",
  description: "Contact Disegno for orders, sizing help, and customer care.",
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Disegno",
  url: "https://disegnoproducts.com/contact",
  description: "Contact Disegno for orders, sizing help, and customer care.",
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema} />

      <Header />

      <main className="bg-cream border-b border-grey-200">
        <section className="py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-grey-700 hover:text-burgundy mb-8"
            >
              ← Back to home
            </Link>

            <div className="mb-8 sm:mb-10">
              <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                Get in touch
              </p>
              <h1 className="font-sans text-3xl sm:text-4xl font-semibold text-foreground mb-3">
                Contact us
              </h1>
              <p className="text-grey-700 max-w-2xl text-sm sm:text-base leading-relaxed">
                Reach us on WhatsApp or email, or send a message with the form.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <div className="border border-grey-200 bg-white p-5 sm:p-7">
                  <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                    WhatsApp
                  </p>
                  <p className="font-serif text-2xl font-semibold text-foreground mb-4">
                    {CONTACT_WHATSAPP_DISPLAY}
                  </p>
                  <a
                    href={WHATSAPP_CHAT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#25D366] text-white text-sm font-semibold uppercase tracking-wider hover:bg-[#1ebe57] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>

                <div className="border border-grey-200 bg-white p-5 sm:p-7">
                  <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                    Email
                  </p>
                  <a
                    href={CONTACT_MAILTO}
                    className="font-serif text-xl sm:text-2xl font-semibold text-foreground hover:text-burgundy break-all"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}