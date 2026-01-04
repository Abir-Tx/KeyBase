import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KeyBase",
  description: "Shortcut management app by Mushfiqur Rahman Abir",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is needed for next-themes to avoid mismatch errors
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="antialiased min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
