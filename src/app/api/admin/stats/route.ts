import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalBooks = await prisma.book.count();
    const totalBorrowed = await prisma.book.aggregate({ _sum: { totalQuantity: true } });
    const totalAvailable = await prisma.book.aggregate({ _sum: { availableQuantity: true } });
    const totalDamaged = await prisma.book.aggregate({ _sum: { damagedQuantity: true } });

    // Find the most requested book
    const mostRequestedBook = await prisma.request.groupBy({
      by: ['bookId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 1,
    });

    let mostRequestedBookDetails = null;
    if (mostRequestedBook.length > 0) {
      const bookId = mostRequestedBook[0].bookId;
      const book = await prisma.book.findUnique({
        where: { id: bookId },
        select: { title: true, author: true },
      });
      mostRequestedBookDetails = {
        title: book?.title,
        author: book?.author,
        requests: mostRequestedBook[0]._count.id,
      };
    }

    // Categories with most/least books
    const categoryBookCounts = await prisma.categoriesOnBooks.groupBy({
      by: ['categoryId'],
      _count: {
        bookId: true,
      },
      orderBy: {
        _count: {
          bookId: 'desc',
        },
      },
    });

    let categoryWithMostBooks = null;
    let categoryWithLeastBooks = null;

    if (categoryBookCounts.length > 0) {
      const mostBooksCat = categoryBookCounts[0];
      const leastBooksCat = categoryBookCounts[categoryBookCounts.length - 1];

      const [mostCatDetails, leastCatDetails] = await Promise.all([
        prisma.category.findUnique({ where: { id: mostBooksCat.categoryId } }),
        prisma.category.findUnique({ where: { id: leastBooksCat.categoryId } }),
      ]);

      categoryWithMostBooks = {
        name: mostCatDetails?.name,
        count: mostBooksCat._count.bookId,
      };
      categoryWithLeastBooks = {
        name: leastCatDetails?.name,
        count: leastBooksCat._count.bookId,
      };
    }

    return NextResponse.json({
      totalBooks,
      totalBorrowed: totalBorrowed._sum.totalQuantity || 0,
      totalAvailable: totalAvailable._sum.availableQuantity || 0,
      totalDamaged: totalDamaged._sum.damagedQuantity || 0,
      mostRequestedBook: mostRequestedBookDetails,
      categoryWithMostBooks,
      categoryWithLeastBooks,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
