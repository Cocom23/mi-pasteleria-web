import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Obtener el email de la URL (ej: /api/user?email=juan@gmail.com)
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    // Buscar al usuario
    const user = await User.findOne({ email });

    // Si el usuario no existe, devolvemos 0 sellos (es un cliente nuevo)
    if (!user) {
      return NextResponse.json({ sellos: 0, premios: 0 });
    }

    return NextResponse.json({ 
      sellos: user.sellos, 
      premios: user.premios 
    });

  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}