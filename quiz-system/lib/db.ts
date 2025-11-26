import { prisma } from './prisma';

export interface Question {
  id: number;
  content: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

export interface QuizSession {
  id: number;
  user_email: string;
  score: number;
  total_questions: number;
  completed_at: Date;
}

export interface UserAnswer {
  id: number;
  session_id: number;
  question_id: number;
  user_email: string;
  selected_answer: string;
  is_correct: boolean;
}

export async function initializeDatabase() {
  try {
    // Với Prisma, schema & migrations được quản lý qua Prisma Migrate,
    // nên ở đây chỉ cần trả về thành công.
    await prisma.$queryRaw`SELECT 1`;
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error };
  }
}

export async function getAllQuestions(): Promise<Question[]> {
  const questions = await prisma.questions.findMany({
    orderBy: { id: 'asc' },
  });
  return questions as unknown as Question[];
}

export async function getQuestionById(id: number): Promise<Question | null> {
  const question = await prisma.questions.findUnique({
    where: { id },
  });
  return (question as unknown as Question) || null;
}

export async function insertQuestions(questions: Omit<Question, 'id'>[]) {
  await prisma.questions.createMany({
    data: questions.map((q) => ({
      content: q.content,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
    })),
  });
}

export async function deleteAllQuestions() {
  await prisma.user_answers.deleteMany({});
  await prisma.quiz_sessions.deleteMany({});
  await prisma.questions.deleteMany({});
}

export async function createQuizSession(userEmail: string, score: number, totalQuestions: number) {
  const session = await prisma.quiz_sessions.create({
    data: {
      user_email: userEmail,
      score,
      total_questions: totalQuestions,
    },
  });
  return session as unknown as QuizSession;
}

export async function saveUserAnswer(
  sessionId: number,
  questionId: number,
  userEmail: string,
  selectedAnswer: string,
  isCorrect: boolean
) {
  await prisma.user_answers.create({
    data: {
      session_id: sessionId,
      question_id: questionId,
      user_email: userEmail,
      selected_answer: selectedAnswer,
      is_correct: isCorrect,
    },
  });
}

export async function getUserSessions(userEmail: string): Promise<QuizSession[]> {
  const sessions = await prisma.quiz_sessions.findMany({
    where: { user_email: userEmail },
    orderBy: { completed_at: 'desc' },
  });
  return sessions as unknown as QuizSession[];
}

export async function getWrongAnswers(userEmail: string, sessionId: number) {
  const answers = await prisma.user_answers.findMany({
    where: {
      user_email: userEmail,
      session_id: sessionId,
      is_correct: false,
    },
    include: {
      question: true,
    },
  });

  return answers.map((a: any) => ({
    question_id: a.question_id,
    selected_answer: a.selected_answer,
    is_correct: a.is_correct,
    content: a.question?.content,
    option_a: a.question?.option_a,
    option_b: a.question?.option_b,
    option_c: a.question?.option_c,
    option_d: a.question?.option_d,
    correct_answer: a.question?.correct_answer,
  }));
}
