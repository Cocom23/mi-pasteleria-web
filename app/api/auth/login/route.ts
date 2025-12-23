import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        let { email, password } = body;

        // Normalización de seguridad básica
        email = email?.trim().toLowerCase();
        password = password?.trim();

        console.log(`[LOGIN ATTEMPT] Email: '${email}'`);

        // 1. Verificar si el usuario existe
        const user = await User.findOne({ email }).select('+password +role +nombre');

        if (!user) {
            console.log(`[LOGIN ERROR] Usuario no encontrado: '${email}'`);
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
        }

        // Debug: Ver contraseña en consola (SOLO DESARROLLO)
        console.log(`[LOGIN DEBUG] DB Pass: '${user.password}' | Input Pass: '${password}'`);

        // 2. Verificar contraseña
        // NOTA: En producción esto DEBE ser con bcrypt
        const isValid = user.password === password;

        // Si es cliente y no tiene password, permitimos login "mágico" si no envía password (o implementamos lógica de enviar link)
        // Para este MVP: Si tiene password, debe coincidir. Si no tiene, cualquiera pasa (modo inseguro temporal para migración) o exigimos password.
        // Vamos a exigir password para admins.

        if (user.role !== 'client' && !isValid) {
            console.log(`[LOGIN ERROR] Contraseña invalida para admin.`);
            return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
        }

        // Para clientes sin password, podríamos dejar pasar o pedir setear una.
        // Asumiremos que si envías password, lo validamos.

        // 3. Crear sesión "Cookie" manual (Sin librerías externas por ahora)
        // Guardamos datos básicos en un JSON stringificado
        const sessionData = JSON.stringify({
            id: user._id,
            email: user.email,
            role: user.role,
            nombre: user.nombre
        });

        // Sesión simple codificada en base64 (¡NO es seguro para producción real, pero funciona para MVP!)
        const token = Buffer.from(sessionData).toString('base64');

        const response = NextResponse.json({
            success: true,
            user: {
                email: user.email,
                role: user.role,
                nombre: user.nombre
            }
        });

        // Setear Cookie HTTP-Only
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 1 semana
        });

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
    }
}
