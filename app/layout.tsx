import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CommTECH Insight 2026",
  description: "Event staff companion untuk panitia CommTECH Insight 2026.",
  applicationName: "CommTECH Staff",
  appleWebApp: {
    capable: true,
    title: "CommTECH Staff",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#F7F4EE",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
