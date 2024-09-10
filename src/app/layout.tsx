import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";

const mainFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "KadrEdu",
  // TODO: описание
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${mainFont.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
