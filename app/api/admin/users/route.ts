import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// GET - Listar todos los usuarios (Solo Admin/Superuser)
export async function GET(request: Request) {
    try {
        await dbConnect();

        // Aquí deberíamos verificar permisos, pero lo haremos en el frontend/middleware por ahora
        // Idealmente validar token aqui tambien

        // Devolvemos todos los usuarios ordenados por fecha de creación
        const users = await User.find({}).sort({ createdAt: -1 }).select('-password');

        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Error al obtener usuarios', details: error.message },
            { status: 500 }
        );
    }
}

// PUT - Actualizar rol de usuario (Solo Superuser)
export async function PUT(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { id, role } = body;

        if (!id || !role) {
            return NextResponse.json(
                { error: 'ID y Role son obligatorios' },
                { status: 400 }
            );
        }

        const validRoles = ['client', 'admin', 'superuser'];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { error: 'Rol inválido' },
                { status: 400 }
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Error al actualizar usuario', details: error.message },
            { status: 500 }
        );
    }
}
