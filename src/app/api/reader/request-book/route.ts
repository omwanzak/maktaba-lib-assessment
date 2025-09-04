import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, bookId } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.currentBorrowed! >= user.borrowingLimit!) {
      return NextResponse.json({ message: 'Borrowing limit reached' }, { status: 400 });
    }

    const existingRequest = await prisma.request.findFirst({
      where: { userId, bookId, status: { in: ['pending', 'approved'] } },
    });

    if (existingRequest) {
      return NextResponse.json({ message: 'You have already requested this book' }, { status: 400 });
    }

    const request = await prisma.request.create({
      data: {
        userId,
        bookId,
        status: 'pending',
        requestDate: new Date(),
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
