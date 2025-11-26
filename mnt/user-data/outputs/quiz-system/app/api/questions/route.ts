import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAllQuestions } from '@/lib/db';

// Simple hash function for user email to create consistent seed
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Seeded random function for consistent randomization per user
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Fisher-Yates shuffle with seed
function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const questions = await getAllQuestions();
    
    if (questions.length === 0) {
      return NextResponse.json({ questions: [] });
    }
    
    // Create seed based on user email and current date (changes daily)
    // This ensures same user gets same order within a day, but different users get different orders
    const userEmail = session?.user?.email || 'anonymous';
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const seed = hashString(userEmail + today);
    
    // Shuffle questions based on seed
    const shuffled = shuffleWithSeed(questions, seed);
    
    // Don't return correct_answer to client
    const questionsWithoutAnswers = shuffled.map(({ correct_answer, ...rest }) => rest);
    
    return NextResponse.json({ questions: questionsWithoutAnswers });
  } catch (error: any) {
    console.error('Get questions error:', error);
    return NextResponse.json({ 
      error: 'Lỗi khi lấy câu hỏi',
      details: error.message 
    }, { status: 500 });
  }
}
