import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { requestId } = await req.json();

    await prisma.request.update({
      where: { id: requestId },
      data: { status: 'rejected' },
    });

    return NextResponse.json({ message: 'Request rejected' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
