import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import NavbarUser from "@/components/NavbarUser"; // Nuevo componente de UI

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Coffee Break - Postres y Más",
  description: "Porque cada momento merece un dulce toque.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          {/* --- BARRA DE NAVEGACIÓN (NAVBAR) --- */}
          <nav className="bg-orange-600 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">

              {/* Logo / Nombre de la tienda */}
              <Link href="/" className="text-2xl font-bold hover:text-orange-100 transition-colors flex items-center gap-2">
                🍰 The Coffee Break
              </Link>

              {/* Enlaces del menú y Usuario */}
              <div className="flex items-center gap-6 font-medium">
                <Link href="/" className="hover:underline hidden md:block">
                  Inicio
                </Link>
                <div className="h-6 w-px bg-orange-400 hidden md:block"></div>

                {/* Componente de Usuario (Login/Avatar) */}
                <NavbarUser />
              </div>

            </div>
          </nav>

          {/* --- AQUÍ SE CARGA EL CONTENIDO DE TUS PÁGINAS --- */}
          {children}

          {/* --- PIE DE PÁGINA (FOOTER) --- */}
          <footer className="bg-gray-800 text-gray-300 py-8 mt-10 text-center">
            <p>© 2025 The Coffee Break. Hecho con ❤️ y mucho azúcar.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}