import { Geist, Geist_Mono } from "next/font/google";
import { MagicUIProvider } from "magicui-next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gerenciamento de Empreendimentos",
  description: "Aplicação Next.js para gerenciar empreendimentos em Santa Catarina",
};

export default function RootLayout({ children }) {
  const magicTheme = {
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    background: "var(--background)",
    text: "var(--foreground)",
    border: "var(--muted)",
    radius: "0.75rem",
    spacing: "1rem",
  };

  const projectPrd =
    "Dashboard web para gerenciar empreendimentos de Santa Catarina com cadastro, listagem, status e indicadores visuais.";

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MagicUIProvider theme={magicTheme} projectPrd={projectPrd}>
          {children}
        </MagicUIProvider>
      </body>
    </html>
  );
}
