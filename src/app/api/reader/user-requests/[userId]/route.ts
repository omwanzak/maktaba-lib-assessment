import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = parseInt(params.userId, 10);
    const userRequests = await prisma.request.findMany({
      where: { userId },
      include: { book: true },
    });
    return NextResponse.json(userRequests);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
