import "./globals.css";
import LanguageInit from "@/components/LanguageInit";

export const metadata = {
  title: "Otabek Sobitov rasmiy sahifasi",
  description: "Rasmiy shaxsiy sahifa",
  icons: {
    icon: "/logo-parliament.png",
    apple: "/logo-parliament.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageInit />
        {children}
      </body>
    </html>
  );
}
