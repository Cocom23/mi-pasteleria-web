import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { email, password, nombre, telefono } = body;

        // Validaciones básicas
        if (!email || !password || !nombre) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
        }

        // Verificar si existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Este correo ya está registrado' }, { status: 400 });
        }

        // Crear usuario
        // NOTA: En producción, hashear password siempre.
        const newUser = await User.create({
            email,
            password,
            nombre,
            role: 'client',
            telefono: telefono || '',
            sellos: 0,
            premios: 0
        });

        return NextResponse.json({
            success: true,
            user: {
                id: newUser._id,
                email: newUser.email,
                nombre: newUser.nombre,
                role: newUser.role
            }
        });

    } catch (error: any) {
        console.error("Error registro:", error);
        return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 });
    }
}
