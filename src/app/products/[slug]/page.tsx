import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOCK_PRODUCTS } from "@/data/mock-catalog";
import { ProductDetailView } from "@/components/product/product-detail-view";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) {
    return {
      title: "Product Not Found | AURELLE Couture",
    };
  }

  return {
    title: `${product.title} | AURELLE Haute Indian Couture`,
    description: `${product.subtitle}. ${product.description.slice(0, 150)}...`,
    openGraph: {
      title: product.title,
      description: product.subtitle,
      images: [
        {
          url: product.images[0]?.url || "",
          alt: product.title,
        },
      ],
    },
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug);

  if (!product || (product.status && product.status !== "active")) {
    notFound();
  }

  // Complementary products from same category or different items
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.isBestseller)
  );

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
