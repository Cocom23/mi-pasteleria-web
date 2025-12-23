import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';

// GET - Obtener un producto específico
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        // Validar que el ID sea válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'ID de producto inválido' },
                { status: 400 }
            );
        }

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Error al obtener producto', details: error.message },
            { status: 500 }
        );
    }
}

// PUT - Actualizar producto
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'ID de producto inválido' },
                { status: 400 }
            );
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Error al actualizar producto', details: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar producto
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'ID de producto inválido' },
                { status: 400 }
            );
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Producto eliminado exitosamente',
            product: deletedProduct
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Error al eliminar producto', details: error.message },
            { status: 500 }
        );
    }
}
