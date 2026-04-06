import "./globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import { handleResponse } from "@/utils/handle-response";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title:
      data.find((s) => s.name === "title")?.value ||
      "Inventory Management System",
    description: "A complete solution for your business",
  };
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
        <Toaster />
      </body>
    </html>
  );
}
