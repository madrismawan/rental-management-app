import { Geist, Inter } from "next/font/google";
import "@/style/globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="icon" href="/favicon.ico"></link>
      </head>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
