import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lackim.github.io/shipcli/"),
  title: "shipcli — CLI-as-a-Product toolkit — build, publish, and promote CLI tools",
  description: "CLI-as-a-Product toolkit — build, publish, and promote CLI tools",
  openGraph: {
    title: "shipcli",
    description: "CLI-as-a-Product toolkit — build, publish, and promote CLI tools",
    type: "website",
    url: "https://lackim.github.io/shipcli/",
    images: ["https://lackim.github.io/shipcli/shipcli-social-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "shipcli",
    description: "CLI-as-a-Product toolkit — build, publish, and promote CLI tools",
    images: ["https://lackim.github.io/shipcli/shipcli-social-preview.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
