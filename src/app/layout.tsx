import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cajual 2025",
  description: "Venha curtir o cajual 2025!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#0D47A1',
              border: '1px solid #FBBF24',
            },
            success: {
              style: {
                background: '#10B981',
                color: 'white',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#10B981',
              }
            },
            error: {
              style: {
                background: '#EF4444',
                color: 'white',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#EF4444',
              }
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}