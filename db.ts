import { sql } from '@vercel/postgres';

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
    // Create questions table
    await sql`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer VARCHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create quiz_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS quiz_sessions (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create user_answers table
    await sql`
      CREATE TABLE IF NOT EXISTS user_answers (
        id SERIAL PRIMARY KEY,
        session_id INTEGER REFERENCES quiz_sessions(id) ON DELETE CASCADE,
        question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
        user_email VARCHAR(255) NOT NULL,
        selected_answer VARCHAR(1) CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
        is_correct BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error };
  }
}

export async function getAllQuestions(): Promise<Question[]> {
  const { rows } = await sql<Question>`SELECT * FROM questions ORDER BY id`;
  return rows;
}

export async function getQuestionById(id: number): Promise<Question | null> {
  const { rows } = await sql<Question>`SELECT * FROM questions WHERE id = ${id}`;
  return rows[0] || null;
}

export async function insertQuestions(questions: Omit<Question, 'id'>[]) {
  for (const q of questions) {
    await sql`
      INSERT INTO questions (content, option_a, option_b, option_c, option_d, correct_answer)
      VALUES (${q.content}, ${q.option_a}, ${q.option_b}, ${q.option_c}, ${q.option_d}, ${q.correct_answer})
    `;
  }
}

export async function deleteAllQuestions() {
  await sql`DELETE FROM questions`;
}

export async function createQuizSession(userEmail: string, score: number, totalQuestions: number) {
  const { rows } = await sql<QuizSession>`
    INSERT INTO quiz_sessions (user_email, score, total_questions)
    VALUES (${userEmail}, ${score}, ${totalQuestions})
    RETURNING *
  `;
  return rows[0];
}

export async function saveUserAnswer(
  sessionId: number,
  questionId: number,
  userEmail: string,
  selectedAnswer: string,
  isCorrect: boolean
) {
  await sql`
    INSERT INTO user_answers (session_id, question_id, user_email, selected_answer, is_correct)
    VALUES (${sessionId}, ${questionId}, ${userEmail}, ${selectedAnswer}, ${isCorrect})
  `;
}

export async function getUserSessions(userEmail: string): Promise<QuizSession[]> {
  const { rows } = await sql<QuizSession>`
    SELECT * FROM quiz_sessions 
    WHERE user_email = ${userEmail}
    ORDER BY completed_at DESC
  `;
  return rows;
}

export async function getWrongAnswers(userEmail: string, sessionId: number) {
  const { rows } = await sql`
    SELECT 
      ua.question_id,
      ua.selected_answer,
      ua.is_correct,
      q.content,
      q.option_a,
      q.option_b,
      q.option_c,
      q.option_d,
      q.correct_answer
    FROM user_answers ua
    JOIN questions q ON ua.question_id = q.id
    WHERE ua.user_email = ${userEmail} 
      AND ua.session_id = ${sessionId}
      AND ua.is_correct = false
  `;
  return rows;
}
