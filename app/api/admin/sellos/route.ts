import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    // 1. Conectamos a la base de datos (silenciosamente)
    await dbConnect();

    // 2. Leemos la orden secreta
    const { email, accion } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Falta el correo del objetivo' }, { status: 400 });
    }

    // 3. Buscamos al usuario (o lo creamos si es nuevo)
    // upsert: true significa "Si no existe, créalo"
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({ email });
    }

    // 4. Ejecutamos la acción
    if (accion === 'agregar') {
      user.sellos += 1;
      
      // ¡Lógica de Lotería! Si llega a 10, gana premio y se reinicia
      if (user.sellos >= 10) {
        user.sellos = 0;
        user.premios += 1;
      }
    } 
    else if (accion === 'reset') {
      user.sellos = 0;
      user.premios = 0;
    }

    // 5. Guardamos la evidencia
    await user.save();

    return NextResponse.json({ 
      mensaje: 'Operación exitosa', 
      user: {
        email: user.email,
        sellos: user.sellos,
        premios: user.premios
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Misión fallida: Error en servidor' }, { status: 500 });
  }
}