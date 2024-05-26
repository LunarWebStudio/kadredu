import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";

const mainFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata = {
  title: "KadrEdu",
  // TODO: описание
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${mainFont.variable}`}
    >
      <body>
        <TRPCReactProvider>
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
