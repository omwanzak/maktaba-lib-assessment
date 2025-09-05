import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const categoryId = parseInt(params.id, 10);

    await prisma.categoriesOnBooks.deleteMany({ where: { categoryId } });
    await prisma.category.delete({ where: { id: categoryId } });

    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
