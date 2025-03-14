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
  icons: {
    icon: "/favicon.ico", // Asegúrate de que el favicon es el nuevo
  },
  openGraph: {
    title: "Mau & Kary - Invitación de Boda",
    description:
      "Nuestra boda está por llegar. Te invitamos a celebrarlo con nosotros!",
    url: "https://mauykary-wedding.vercel.app",
    type: "website",
    images: [
      {
        url: "/40.jpg", // Asegúrate de reemplazar esto con la nueva imagen
        width: 1200,
        height: 630,
        alt: "Mau & Kary Invitación",
      },
    ],
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
