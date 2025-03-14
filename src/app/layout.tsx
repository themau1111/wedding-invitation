import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mau & Kary",
  description: "Invitacion para boda",
  openGraph: {
    title: "Mau & Kary - Invitación de boda",
    description: "¡Estamos emocionados de invitarlos a nuestra boda!",
    siteName: "Mau & Kary Boda",
    images: [
      {
        url: "/og-image.jpg", // Asegúrate de que la ruta sea accesible
        width: 1200,
        height: 630,
        alt: "Invitación de boda de Mau & Kary",
      },
      {
        url: "/og-image-square.jpg", // Asegúrate de que la ruta sea accesible
        width: 400,
        height: 400,
        alt: "Invitación de boda de Mau & Kary",
      },
      {
        url: "https://mauykary-wedding.vercel.app/og-image-square.jpg", // Asegúrate de que la ruta sea accesible
        width: 400,
        height: 400,
        alt: "Invitación de boda de Mau & Kary",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mau & Kary - Invitación de boda",
    description: "¡Estamos emocionados de invitarlos a nuestra boda!",
    images: ["/twitter-image.jpg"], // Mismo archivo de Open Graph
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
