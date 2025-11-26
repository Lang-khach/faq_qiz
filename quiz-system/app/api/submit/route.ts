import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  getQuestionById, 
  createQuizSession, 
  saveUserAnswer 
} from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { answers } = await request.json();
    // answers format: [{ questionId: 1, selectedAnswer: 'A' }, ...]

    let correctCount = 0;
    const results = [];

    // Kiểm tra từng câu trả lời
    for (const answer of answers) {
      const question = await getQuestionById(answer.questionId);
      
      if (question) {
        const isCorrect = question.correct_answer === answer.selectedAnswer;
        if (isCorrect) correctCount++;
        
        results.push({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question.correct_answer,
          isCorrect,
          content: question.content,
          options: {
            A: question.option_a,
            B: question.option_b,
            C: question.option_c,
            D: question.option_d,
          }
        });
      }
    }

    // Tạo session và lưu kết quả
    const quizSession = await createQuizSession(
      session.user.email,
      correctCount,
      answers.length
    );

    // Lưu từng câu trả lời
    for (const result of results) {
      await saveUserAnswer(
        quizSession.id,
        result.questionId,
        session.user.email,
        result.selectedAnswer,
        result.isCorrect
      );
    }

    const responseData = {
      sessionId: quizSession.id,
      score: correctCount,
      total: answers.length,
      percentage: Math.round((correctCount / answers.length) * 100),
      results
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Submit error:', error);
    return NextResponse.json({ 
      error: 'Lỗi khi nộp bài',
      details: error.message 
    }, { status: 500 });
  }
}
