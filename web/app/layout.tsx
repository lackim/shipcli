import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lackim.github.io/shipcli/"),
  title: "shipcli — Ship a CLI people can actually install",
  description: "An open-source JavaScript toolkit for building, packaging, publishing, and sharing command-line products.",
  openGraph: {
    title: "shipcli",
    description: "Build, package, publish, and share command-line products without rebuilding the release pipeline.",
    type: "website",
    url: "https://lackim.github.io/shipcli/",
    images: ["https://lackim.github.io/shipcli/shipcli-social-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "shipcli",
    description: "Build, package, publish, and share command-line products without rebuilding the release pipeline.",
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
