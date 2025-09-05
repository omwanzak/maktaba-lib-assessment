import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { title, author, totalQuantity, availableQuantity, categoryIds } = await req.json();
    const bookId = parseInt(params.id, 10);

    // First, disconnect all existing categories from the book
    await prisma.categoriesOnBooks.deleteMany({ where: { bookId } });

    const book = await prisma.book.update({
      where: { id: bookId },
      data: {
        title,
        author,
        totalQuantity,
        availableQuantity,
        categories: {
          create: categoryIds.map((id: number) => ({ categoryId: id }))
        }
      }
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
