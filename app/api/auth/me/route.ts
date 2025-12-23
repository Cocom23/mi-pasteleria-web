import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token');

        if (!token) {
            return NextResponse.json({ user: null });
        }

        // 1. Decodificar ID de la cookie
        // La cookie solo nos sirve para saber QUIÉN dice ser el usuario
        let sessionData;
        try {
            sessionData = JSON.parse(Buffer.from(token.value, 'base64').toString('utf-8'));
        } catch (e) {
            return NextResponse.json({ user: null });
        }

        // 2. Conectar a BD y buscar usuario REAL y FRESCO
        await dbConnect();
        const user = await User.findById(sessionData.id);

        // Si el usuario fue borrado (como hicimos con el seed), esto devuelve null
        // y automáticamente "desloguea" al frontend visualmente
        if (!user) {
            return NextResponse.json({ user: null });
        }

        // 3. Devolver datos frescos de la BD
        return NextResponse.json({
            user: {
                email: user.email,
                role: user.role, // ¡Aquí vendrá 'superuser'!
                nombre: user.nombre // ¡Aquí vendrá 'Dueño Supremo'!
            }
        });

    } catch (error) {
        console.error("Error en auth/me:", error);
        return NextResponse.json({ user: null });
    }
}
