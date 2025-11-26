import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWrongAnswers } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const wrongAnswers = await getWrongAnswers(session.user.email, parseInt(sessionId));
    const normalizedAnswers = wrongAnswers.map((answer: any) => ({
      ...answer,
      id: answer.id ?? answer.question_id,
    }));

    return NextResponse.json({ wrongAnswers: normalizedAnswers });
  } catch (error: any) {
    console.error('Get wrong answers error:', error);
    return NextResponse.json({ 
      error: 'Lỗi khi lấy câu sai',
      details: error.message 
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
