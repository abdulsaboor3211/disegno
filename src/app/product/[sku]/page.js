import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductPageClient from "@/components/ProductPageClient";
import { getProductBySku } from "@/lib/googleSheets";

export async function generateMetadata({ params }) {
    const { sku } = await params;

    const product = await getProductBySku(sku);

    if (!product) {
        return {
            title: "Product Not Found | Disegno",
        };
    }

    return {
        title: `${product.productName} | Disegno`,
        description:
            product.productDescription ||
            `Shop ${product.productName} from Disegno.`,
    };
}

export default async function ProductPage({ params }) {
    const { sku } = await params;

    const product = await getProductBySku(sku);

    if (!product) {
        notFound();
    }

    return (
        <>
            <Header />

            <ProductPageClient product={product} />

            <Footer />
        </>
    );
}