import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Make sure this file exists (created by default)
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Synapse Blog",
  description: "Built with Next.js and FastAPI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* We wrap the whole app in Providers so we can use 'useSession' anywhere */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}