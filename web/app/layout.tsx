import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "shipcli — CLI-as-a-Product toolkit — build, publish, and promote CLI tools",
  description: "CLI-as-a-Product toolkit — build, publish, and promote CLI tools",
  openGraph: {
    title: "shipcli",
    description: "CLI-as-a-Product toolkit — build, publish, and promote CLI tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "shipcli",
    description: "CLI-as-a-Product toolkit — build, publish, and promote CLI tools",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
