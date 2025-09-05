import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const categoryIdParam = searchParams.get('categoryId');
    const searchTerm = searchParams.get('searchTerm') || '';
    const categoryId = categoryIdParam ? parseInt(categoryIdParam, 10) : null;

    const where: any = {};

    if (categoryId && !isNaN(categoryId)) {
      where.categories = {
        some: {
          categoryId: categoryId
        }
      };
    }

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm } },
        { author: { contains: searchTerm } }
      ];
    }

    const [totalBooks, books] = await Promise.all([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        include: {
          categories: {
            include: {
              category: true
            }
          }
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      })
    ]);

    return NextResponse.json({
      books,
      totalBooks,
      page,
      pageSize
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
