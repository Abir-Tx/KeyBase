import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "KeyBase",
  description: "Shortcut management app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
