import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, readFile } from 'fs/promises';
import path from 'path';
import { deleteAllQuestions, insertQuestions, initializeDatabase } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';

const execPromise = promisify(exec);

export async function POST(request: NextRequest) {
  let tempFilePath = '';
  let jsonFilePath = '';
  
  try {
    const session = await getServerSession(authOptions);

    if (!session || !isAdmin(session.user?.email)) {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.docx') && !fileName.endsWith('.doc')) {
      return NextResponse.json({ 
        error: 'Vui lòng upload file Word (.docx hoặc .doc)' 
      }, { status: 400 });
    }

    // Initialize database
    await initializeDatabase();

    // Save uploaded file temporarily
    const buffer = await file.arrayBuffer();
    tempFilePath = `/tmp/upload_${Date.now()}.docx`;
    jsonFilePath = `/tmp/questions_${Date.now()}.json`;
    
    await writeFile(tempFilePath, Buffer.from(buffer));

    // Create Python script to parse Word document
    const pythonScript = `
import sys
import json
import re
from docx import Document

doc = Document('${tempFilePath}')
questions = []

# Process all tables
for table in doc.tables:
    for row_idx, row in enumerate(table.rows):
        if row_idx == 0:
            continue
        
        cells = [cell.text.strip() for cell in row.cells]
        
        if len(cells) < 3:
            continue
        
        stt = cells[0]
        if not stt or not stt.isdigit():
            continue
        
        content = cells[1] if len(cells) > 1 else ''
        options_text = ''
        answer = ''
        
        for i in range(len(cells) - 1, 1, -1):
            cell_text = cells[i].strip()
            if re.match(r'^[A-D]$', cell_text):
                answer = cell_text
                options_text = '\\n'.join(cells[2:i])
                break
        
        if not answer:
            combined = '\\n'.join(cells[2:])
            match = re.search(r'\\b([A-D])\\s*$', combined)
            if match:
                answer = match.group(1)
                options_text = re.sub(r'\\b[A-D]\\s*$', '', combined).strip()
        
        if not answer or not options_text:
            continue
        
        options = {'A': '', 'B': '', 'C': '', 'D': ''}
        lines = options_text.split('\\n')
        current_letter = None
        current_text = []
        
        for line in lines:
            match = re.match(r'^([A-D])[\\.\\)]\\s*(.*)$', line.strip())
            if match:
                if current_letter and current_text:
                    options[current_letter] = ' '.join(current_text).strip()
                current_letter = match.group(1)
                current_text = [match.group(2)] if match.group(2) else []
            elif current_letter:
                current_text.append(line.strip())
        
        if current_letter and current_text:
            options[current_letter] = ' '.join(current_text).strip()
        
        if not all(options.values()):
            option_parts = re.split(r'\\n\\s*([A-D])[\\.\\)]\\s*', options_text)
            if len(option_parts) >= 8:
                for i in range(1, len(option_parts), 2):
                    if i < len(option_parts) - 1:
                        letter = option_parts[i]
                        text = option_parts[i + 1].strip()
                        if letter in options:
                            options[letter] = text
        
        if content and all(opt.strip() for opt in options.values()) and answer in ['A', 'B', 'C', 'D']:
            questions.append({
                'content': content[:2000],
                'option_a': options['A'][:1000],
                'option_b': options['B'][:1000],
                'option_c': options['C'][:1000],
                'option_d': options['D'][:1000],
                'correct_answer': answer
            })

with open('${jsonFilePath}', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False)

print(len(questions))
`;

    // Write Python script
    const scriptPath = `/tmp/parse_${Date.now()}.py`;
    await writeFile(scriptPath, pythonScript);

    // Execute Python script
    const { stdout, stderr } = await execPromise(`python3 ${scriptPath}`);
    
    // Clean up script
    await unlink(scriptPath);

    // Read parsed questions
    const jsonContent = await readFile(jsonFilePath, 'utf-8');
    const questions = JSON.parse(jsonContent);

    if (questions.length === 0) {
      return NextResponse.json({ 
        error: 'Không tìm thấy câu hỏi hợp lệ trong file' 
      }, { status: 400 });
    }

    // Delete old questions and insert new ones
    await deleteAllQuestions();
    await insertQuestions(questions);

    return NextResponse.json({ 
      success: true, 
      message: `Đã upload thành công ${questions.length} câu hỏi từ file Word` 
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Lỗi khi xử lý file Word', 
      details: error.message 
    }, { status: 500 });
  } finally {
    // Cleanup temporary files
    try {
      if (tempFilePath) await unlink(tempFilePath);
      if (jsonFilePath) await unlink(jsonFilePath);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}
