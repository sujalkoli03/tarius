import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";


export const metadata: Metadata = {
  title: {
    default: "TARIUS — Organic. Powerful. Natural.",
    template: "%s | TARIUS",
  },
  description:
    "TARIUS — premium spirulina and moringa powders crafted from nature.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}