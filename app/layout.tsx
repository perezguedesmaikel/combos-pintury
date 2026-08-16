import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pintury Remesas y Combos",
  description: "Productos de comida para tus familiares en Cuba.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
