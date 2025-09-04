import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { requestId, librarianId } = await req.json();

    const request = await prisma.request.update({
      where: { id: requestId },
      data: { status: 'approved', approvedBy: librarianId },
    });

    await prisma.book.update({
      where: { id: request.bookId },
      data: { availableQuantity: { decrement: 1 } },
    });

    await prisma.user.update({
      where: { id: request.userId },
      data: { currentBorrowed: { increment: 1 } },
    });

    await prisma.bookLog.create({
      data: {
        userId: request.userId,
        bookId: request.bookId,
        action: 'borrow',
        date: new Date(),
        approvedBy: librarianId,
      },
    });

    return NextResponse.json({ message: 'Request approved' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
