import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { title, author, totalQuantity, availableQuantity, categoryIds } = await req.json();

    const book = await prisma.book.create({
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
