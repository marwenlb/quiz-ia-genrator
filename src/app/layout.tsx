import type { Metadata } from "next";
import { GeistMono, GeistSans } from "@/assets/font";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartQuizMaker | Powered by Khalil & Marouene using GPT-4",
  description:
    "Generate quizzes from your notes using the AI-powered quiz generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.className} ${GeistMono.variable} bg-sunny pattern text-zinc-800`}
      >
        {children}
      </body>
    </html>
  );
}
