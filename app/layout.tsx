import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KitchenManager",
  description: "Gestão operacional para pastelaria, restauração e cafetaria",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT">
      <body>{children}</body>
    </html>
  );
}
