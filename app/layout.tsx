import type { Metadata } from "next";
import "./globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "A complete solution for your business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
