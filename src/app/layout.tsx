import type { Metadata } from "next";
import { GameProvider } from "@/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "나의 작은 숲 | My Little Forest",
  description: "나무를 키우고 보상을 받는 게이미피케이션 리워드 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
