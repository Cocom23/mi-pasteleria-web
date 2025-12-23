import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        await dbConnect();

        const email = 'admin@coffee.break';

        // 1. ELIMINAR al usuario existente para limpiar cualquier basura vieja
        const eliminado = await User.findOneAndDelete({ email });
        console.log('Usuario eliminado:', eliminado ? 'Sí' : 'No existía');

        // 2. CREARLO de cero con todos los campos
        const newAdmin = await User.create({
            email: email,
            password: 'admin123', // Contraseña plana por ahora (sin encriptar para debug)
            role: 'superuser',
            nombre: 'Dueño Supremo',
            sellos: 999,
            premios: 999
        });

        // 3. VERIFICAR inmediatamente si se guardó
        const verificado = await User.findById(newAdmin._id).select('+password');

        return NextResponse.json({
            mensaje: '¡Admin RECREADO desde cero!',
            paso_1_eliminado: eliminado ? 'OK' : 'No existía antes',
            paso_2_creado: 'OK',
            paso_3_verificacion_password: verificado ? verificado.password : 'ERROR: No se recuperó',
            credenciales: {
                email: email,
                password: 'admin123'
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            error: 'Error FATAL al recrear admin',
            details: error.message
        }, { status: 500 });
    }
}
