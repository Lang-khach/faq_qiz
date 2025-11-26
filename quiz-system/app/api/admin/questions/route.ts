import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAdmin } from '@/lib/admin';
import { getAllQuestions, getQuestionById } from '@/lib/db';
import { sql } from '@vercel/postgres';

// GET - Lấy tất cả câu hỏi (chỉ admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !isAdmin(session.user?.email)) {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      // Get single question
      const question = await getQuestionById(parseInt(id));
      if (!question) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
      return NextResponse.json({ question });
    }

    // Get all questions (including correct answers for admin)
    const questions = await getAllQuestions();
    return NextResponse.json({ questions, total: questions.length });
  } catch (error: any) {
    console.error('Get questions error:', error);
    return NextResponse.json({ 
      error: 'Lỗi khi lấy câu hỏi',
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Thêm câu hỏi mới
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !isAdmin(session.user?.email)) {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { content, option_a, option_b, option_c, option_d, correct_answer } = body;

    // Validate
    if (!content || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
      return NextResponse.json({ error: 'Thiếu thông tin câu hỏi' }, { status: 400 });
    }

    if (!['A', 'B', 'C', 'D'].includes(correct_answer)) {
      return NextResponse.json({ error: 'Đáp án phải là A, B, C hoặc D' }, { status: 400 });
    }

    // Insert
    const result = await sql`
      INSERT INTO questions (content, option_a, option_b, option_c, option_d, correct_answer)
      VALUES (${content}, ${option_a}, ${option_b}, ${option_c}, ${option_d}, ${correct_answer})
      RETURNING *
    `;

    return NextResponse.json({ 
      success: true,
      question: result.rows[0],
      message: 'Đã thêm câu hỏi thành công'
    });
  } catch (error: any) {
    console.error('Add question error:', error);
    return NextResponse.json({ 
      error: 'Lỗi khi thêm câu hỏi',
      details: error.message 
    }, { status: 500 });
  }
}

// PUT - Cập nhật câu hỏi
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !isAdmin(session.user?.email)) {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { id, content, option_a, option_b, option_c, option_d, correct_answer } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID câu hỏi' }, { status: 400 });
    }

    // Validate
    if (!['A', 'B', 'C', 'D'].includes(correct_answer)) {
      return NextResponse.json({ error: 'Đáp án phải là A, B, C hoặc D' }, { status: 400 });
    }

    // Update
    const result = await sql`
      UPDATE questions
      SET content = ${content},
          option_a = ${option_a},
          option_b = ${option_b},
          option_c = ${option_c},
          option_d = ${option_d},
          correct_answer = ${correct_answer}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy câu hỏi' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      question: result.rows[0],
      message: 'Đã cập nhật câu hỏi thành công'
    });
  } catch (error: any) {
    console.error('Update question error:', error);
    return NextResponse.json({ 
      error: 'Lỗi khi cập nhật câu hỏi',
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE - Xóa câu hỏi
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !isAdmin(session.user?.email)) {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID câu hỏi' }, { status: 400 });
    }

    // Delete
    const result = await sql`
      DELETE FROM questions WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy câu hỏi' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Đã xóa câu hỏi thành công'
    });
  } catch (error: any) {
    console.error('Delete question error:', error);
    return NextResponse.json({ 
      error: 'Lỗi khi xóa câu hỏi',
      details: error.message 
    }, { status: 500 });
  }
}
