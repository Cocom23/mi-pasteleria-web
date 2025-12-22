import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ mensaje: "¡Hola! El servidor funciona bien" });
}