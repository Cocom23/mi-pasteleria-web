import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// POST - Canjear premio
export async function POST(request: Request) {
    try {
        await dbConnect();

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email es requerido' },
                { status: 400 }
            );
        }

        // Buscar usuario
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        // Verificar que tenga premios disponibles
        if (user.premios <= 0) {
            return NextResponse.json(
                { error: 'No tienes premios disponibles para canjear' },
                { status: 400 }
            );
        }

        // Decrementar premio
        user.premios -= 1;
        await user.save();

        return NextResponse.json({
            success: true,
            mensaje: '¡Premio canjeado exitosamente! 🎉 Muestra esta pantalla en caja.',
            sellos: user.sellos,
            premios: user.premios
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: 'Error al canjear premio', details: error.message },
            { status: 500 }
        );
    }
}
