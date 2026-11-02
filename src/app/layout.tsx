import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/context/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AuthProvider } from "@/context/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { WishlistProvider } from "@/context/wishlist-context";
import { WishlistDrawer } from "@/components/wishlist/wishlist-drawer";
import { ToastProvider } from "@/context/toast-context";
import { WhatsAppConcierge } from "@/components/layout/whatsapp-concierge";
import { FloatingBottomNav } from "@/components/layout/floating-bottom-nav";

export const metadata: Metadata = {
  title: "AURELLE | Luxury Indian Fashion & Couture",
  description: "Handcrafted ethnic elegance, bespoke festive wear, and artisanal silhouettes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-aurelle-ivory text-aurelle-ink selection:bg-aurelle-burgundy selection:text-white pb-20 sm:pb-0">
        <ToastProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Header />
                <div className="flex-1 flex flex-col">{children}</div>
                <Footer />
                <CartDrawer />
                <WishlistDrawer />
                <AuthModal />
                <WhatsAppConcierge />
                <FloatingBottomNav />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
