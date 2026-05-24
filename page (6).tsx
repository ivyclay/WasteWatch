export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name: String(name),
        email: String(email),
        subject: subject ? String(subject) : null,
        message: String(message),
      },
    });

    return NextResponse.json({ success: true, id: submission?.id });
  } catch (err: any) {
    console.error('Contact API error:', err?.message ?? err);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
