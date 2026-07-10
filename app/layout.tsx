import "./globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import { handleResponse } from "@/utils/handle-response";
import LogoutProvider from "@/providers/LogoutProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ProgressBarProvider from "@/providers/ProgressBarProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ProgressBarProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextAuthProvider>
              <LogoutProvider>{children}</LogoutProvider>
            </NextAuthProvider>
            <Toaster />
          </ThemeProvider>
        </ProgressBarProvider>
      </body>
    </html>
  );
}
