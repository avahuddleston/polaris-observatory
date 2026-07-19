import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";

export const metadata = {
  title: "Polaris Observatory | Research Group",
  description:
    "Home of the Polaris Observatory research group: student profiles, publications, photos, and observing night sign-ups.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-night text-text">
        <AuthProvider>
          <DataProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-line/60 py-8 text-center text-xs text-text-dim">
              Polaris Observatory Research Group — prototype build
            </footer>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
