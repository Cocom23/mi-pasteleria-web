import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Obtener la sesión
    const token = request.cookies.get('auth_token');

    // 2. Definir rutas protegidas
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
    const isSecretRoute = request.nextUrl.pathname.startsWith('/admin/secreto');

    // 3. Si es ruta pública, dejar pasar
    if (!isAdminRoute) {
        return NextResponse.next();
    }

    // 4. Si no hay token y quiere entrar a admin -> Login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 5. Decodificar token (básico) para ver rol
    try {
        const sessionData = JSON.parse(Buffer.from(token.value, 'base64').toString('utf-8'));
        const role = sessionData.role;

        // Protección Admin General
        if (isAdminRoute && role === 'client') {
            // Cliente intentando entrar a admin -> Home con error (o 403)
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Protección Supersecreta y Gestión de Usuarios
        if ((isSecretRoute || request.nextUrl.pathname.startsWith('/admin/usuarios')) && role !== 'superuser') {
            return NextResponse.redirect(new URL('/admin/productos', request.url)); // Mandar a panel normal
        }

        return NextResponse.next();

    } catch (e) {
        // Si token es inválido -> Login
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

// Configuración de rutas que activa el middleware
export const config = {
    matcher: ['/admin/:path*'],
};
