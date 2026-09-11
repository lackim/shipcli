import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "{{name}} — {{description}}",
  description: "{{description}}",
  openGraph: {
    title: "{{name}}",
    description: "{{description}}",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "{{name}}",
    description: "{{description}}",
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
