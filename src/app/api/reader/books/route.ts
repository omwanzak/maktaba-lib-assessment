import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryIdParam = searchParams.get('categoryId');
    const searchTerm = searchParams.get('searchTerm');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    const where: any = {};

    if (categoryIdParam) {
      where.categories = {
        some: {
          categoryId: parseInt(categoryIdParam, 10),
        },
      };
    }

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { author: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    console.log('Book query where:', JSON.stringify(where));
    const totalBooks = await prisma.book.count({ where });
    const books = await prisma.book.findMany({
      where,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({ books, totalBooks, page, pageSize });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
