import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link"; // Importamos Link para poder navegar

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
        
        {/* --- BARRA DE NAVEGACIÓN (NAVBAR) --- */}
        <nav className="bg-orange-600 text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            
            {/* Logo / Nombre de la tienda */}
            <Link href="/" className="text-2xl font-bold hover:text-orange-100 transition-colors">
              🍰 The Coffee Break
            </Link>

            {/* Enlaces del menú */}
            <div className="space-x-6 font-medium">
              <Link href="/" className="hover:underline">
                Inicio
              </Link>
              <Link href="#" className="hover:underline opacity-80 cursor-not-allowed" title="Próximamente">
                Contacto
              </Link>
            </div>
          
          </div>
        </nav>

        {/* --- AQUÍ SE CARGA EL CONTENIDO DE TUS PÁGINAS --- */}
        {children}

        {/* --- PIE DE PÁGINA (FOOTER) --- */}
        <footer className="bg-gray-800 text-gray-300 py-8 mt-10 text-center">
          <p>© 2025 The Coffee Break. Hecho con ❤️ y mucho azúcar.</p>
        </footer>

      </body>
    </html>
  );
}