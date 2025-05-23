import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Layout/Header";
import { AuthProvider } from "./context/AuthProvider";
import { LenisProvider } from "./context/ScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cognify",
  description: "Learn. Grow. Transform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <AuthProvider>
          <LenisProvider>
            <Header />
            <main className="pt-0">
              {children}
            </main>
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
