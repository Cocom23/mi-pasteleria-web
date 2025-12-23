import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

// GET - Obtener todos los productos
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al obtener productos', details: error.message }, 
      { status: 500 }
    );
  }
}

// POST - Crear nuevo producto
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.nombre || !body.precio) {
      return NextResponse.json(
        { error: 'Nombre y precio son obligatorios' }, 
        { status: 400 }
      );
    }
    
    const newProduct = await Product.create(body);
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al crear producto', details: error.message }, 
      { status: 500 }
    );
  }
}
