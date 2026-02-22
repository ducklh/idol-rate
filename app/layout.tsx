import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Idol Rate - Đánh giá thần tượng",
  description: "Ứng dụng đánh giá và bình luận thần tượng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
