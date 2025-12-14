import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from 'next/font/google'
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthInit from "./AuthInit";
import Toast from "../components/Toast";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Велопрокат",
  description: "Курсовая работа",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans`}>

        <AuthInit />
        <Toast />
        
        <Header />

        <main>
          {children}
        </main>

        <Footer />
      </body>

    </html>
  );
}
