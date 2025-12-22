import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // 1. Recibimos quién está comprando
    const { email, producto } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Necesitamos tu email para enviarte el recibo y los puntos.' }, { status: 400 });
    }

    // 2. Buscamos al usuario (o lo creamos si es su primera compra)
    // "upsert" no funciona igual con findOne, así que lo hacemos manual para poder validar lógica
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({ email });
    }

    // 3. ¡MAGIA AUTOMÁTICA! Agregamos 1 sello por la compra
    user.sellos += 1;

    // 4. Verificamos si ganó premio (Lógica de 10)
    let ganoPremio = false;
    if (user.sellos >= 10) {
      user.sellos = 0; // Se reinicia la tarjeta
      user.premios += 1; // Se guarda el cupón
      ganoPremio = true;
    }

    // 5. Guardamos todo
    await user.save();

    return NextResponse.json({ 
      success: true,
      mensaje: ganoPremio ? '¡Felicidades! Completaste tu tarjeta y ganaste un PREMIO 🎁' : '¡Compra exitosa! Tienes un nuevo sello 🍪',
      sellos: user.sellos,
      premios: user.premios
    });

  } catch (error) {
    return NextResponse.json({ error: 'Error procesando la compra' }, { status: 500 });
  }
}