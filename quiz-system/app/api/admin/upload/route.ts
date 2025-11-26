import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { deleteAllQuestions, insertQuestions, initializeDatabase } from '@/lib/db';

// Helper to parse Word document on server side
async function parseWordDocument(buffer: ArrayBuffer): Promise<any[]> {
  // Use mammoth to extract text from Word document
  const mammoth = require('mammoth');
  
  const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
  const html = result.value;
  
  // Parse HTML to extract questions
  // This is a simplified parser - you may need to adjust based on your doc structure
  const questions: any[] = [];
  
  // Split by table rows or paragraphs
  const lines = html.split(/<\/?(?:tr|p)>/gi).filter(line => line.trim());
  
  let currentQuestion: any = null;
  let optionBuffer = '';
  
  for (const line of lines) {
    const text = line.replace(/<[^>]+>/g, '').trim();
    if (!text) continue;
    
    // Check if it's a question number
    const questionMatch = text.match(/^(\d+)\s*[.|)\s]/);
    if (questionMatch) {
      // Save previous question
      if (currentQuestion && currentQuestion.content && currentQuestion.correct_answer) {
        questions.push(currentQuestion);
      }
      
      // Start new question
      currentQuestion = {
        content: text.replace(/^\d+\s*[.|)\s]/, '').trim(),
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: ''
      };
      optionBuffer = '';
      continue;
    }
    
    // Check for options A, B, C, D
    const optionMatch = text.match(/^([A-D])[.|)\s]\s*(.+)/);
    if (optionMatch && currentQuestion) {
      const letter = optionMatch[1];
      const optionText = optionMatch[2].trim();
      currentQuestion[`option_${letter.toLowerCase()}`] = optionText;
      continue;
    }
    
    // Check for answer
    const answerMatch = text.match(/^([A-D])$/);
    if (answerMatch && currentQuestion) {
      currentQuestion.correct_answer = answerMatch[1];
      continue;
    }
    
    // Add to current content or option
    if (currentQuestion && text.length > 0) {
      if (!currentQuestion.option_a) {
        currentQuestion.content += ' ' + text;
      } else {
        optionBuffer += ' ' + text;
      }
    }
  }
  
  // Save last question
  if (currentQuestion && currentQuestion.content && currentQuestion.correct_answer) {
    questions.push(currentQuestion);
  }
  
  return questions;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Initialize database if not exists
    await initializeDatabase();

    const buffer = await file.arrayBuffer();
    const fileName = file.name.toLowerCase();
    let questions: any[] = [];

    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      // Parse Word document
      questions = await parseWordDocument(buffer);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      // Parse Excel file
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      questions = data.map((row: any) => {
        const content = row['Nội dung'] || row['Câu hỏi'] || row['Question'] || row['content'] || '';
        const optionA = row['Đáp án A'] || row['A'] || row['option_a'] || '';
        const optionB = row['Đáp án B'] || row['B'] || row['option_b'] || '';
        const optionC = row['Đáp án C'] || row['C'] || row['option_c'] || '';
        const optionD = row['Đáp án D'] || row['D'] || row['option_d'] || '';
        const correctAnswer = (row['Đáp án đúng'] || row['Đáp án'] || row['Answer'] || row['correct_answer'] || '').toString().toUpperCase();

        return {
          content: content.toString().trim(),
          option_a: optionA.toString().trim(),
          option_b: optionB.toString().trim(),
          option_c: optionC.toString().trim(),
          option_d: optionD.toString().trim(),
          correct_answer: correctAnswer.trim(),
        };
      }).filter(q => q.content && q.correct_answer && q.option_a && q.option_b && q.option_c && q.option_d);
    } else {
      return NextResponse.json({ 
        error: 'Định dạng file không hỗ trợ. Vui lòng upload file .xlsx, .xls, .docx hoặc .doc' 
      }, { status: 400 });
    }

    // Validate questions
    const validQuestions = questions.filter(q => 
      q.content && 
      q.option_a && 
      q.option_b && 
      q.option_c && 
      q.option_d && 
      ['A', 'B', 'C', 'D'].includes(q.correct_answer)
    );

    if (validQuestions.length === 0) {
      return NextResponse.json({ 
        error: 'Không tìm thấy câu hỏi hợp lệ trong file' 
      }, { status: 400 });
    }

    // Delete old questions and insert new ones
    await deleteAllQuestions();
    await insertQuestions(validQuestions);

    return NextResponse.json({ 
      success: true, 
      message: `Đã upload thành công ${validQuestions.length} câu hỏi` 
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Lỗi khi upload file', 
      details: error.message 
    }, { status: 500 });
  }
}
