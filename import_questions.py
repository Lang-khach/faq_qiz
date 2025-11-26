#!/usr/bin/env python3
"""
Script to parse Word document and generate SQL insert statements
Usage: python3 import_questions.py input.docx > insert.sql
"""

import sys
import re
from docx import Document

def parse_word_questions(docx_path):
    doc = Document(docx_path)
    questions = []
    
    # Process all tables
    for table in doc.tables:
        for row_idx, row in enumerate(table.rows):
            if row_idx == 0:  # Skip header
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
            
            # Find answer
            for i in range(len(cells) - 1, 1, -1):
                cell_text = cells[i].strip()
                if re.match(r'^[A-D]$', cell_text):
                    answer = cell_text
                    options_text = '\n'.join(cells[2:i])
                    break
            
            if not answer:
                combined = '\n'.join(cells[2:])
                match = re.search(r'\b([A-D])\s*$', combined)
                if match:
                    answer = match.group(1)
                    options_text = re.sub(r'\b[A-D]\s*$', '', combined).strip()
            
            if not answer or not options_text:
                continue
            
            # Parse options
            options = {'A': '', 'B': '', 'C': '', 'D': ''}
            lines = options_text.split('\n')
            current_letter = None
            current_text = []
            
            for line in lines:
                match = re.match(r'^([A-D])[\.\)]\s*(.*)$', line.strip())
                if match:
                    if current_letter and current_text:
                        options[current_letter] = ' '.join(current_text).strip()
                    current_letter = match.group(1)
                    current_text = [match.group(2)] if match.group(2) else []
                elif current_letter:
                    current_text.append(line.strip())
            
            if current_letter and current_text:
                options[current_letter] = ' '.join(current_text).strip()
            
            # Alternative parsing
            if not all(options.values()):
                option_parts = re.split(r'\n\s*([A-D])[\.\)]\s*', options_text)
                if len(option_parts) >= 8:
                    for i in range(1, len(option_parts), 2):
                        if i < len(option_parts) - 1:
                            letter = option_parts[i]
                            text = option_parts[i + 1].strip()
                            if letter in options:
                                options[letter] = text
            
            # Validate and add
            if content and all(opt.strip() for opt in options.values()) and answer in ['A', 'B', 'C', 'D']:
                questions.append({
                    'content': content[:2000],
                    'option_a': options['A'][:1000],
                    'option_b': options['B'][:1000],
                    'option_c': options['C'][:1000],
                    'option_d': options['D'][:1000],
                    'correct_answer': answer
                })
    
    return questions

def escape_sql_string(s):
    """Escape string for SQL"""
    return s.replace("'", "''")

def generate_sql_inserts(questions):
    """Generate SQL INSERT statements"""
    print("-- Generated SQL INSERT statements")
    print("-- Total questions:", len(questions))
    print()
    
    for q in questions:
        content = escape_sql_string(q['content'])
        option_a = escape_sql_string(q['option_a'])
        option_b = escape_sql_string(q['option_b'])
        option_c = escape_sql_string(q['option_c'])
        option_d = escape_sql_string(q['option_d'])
        answer = q['correct_answer']
        
        print(f"INSERT INTO questions (content, option_a, option_b, option_c, option_d, correct_answer) VALUES")
        print(f"('{content}', '{option_a}', '{option_b}', '{option_c}', '{option_d}', '{answer}');")
        print()

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 import_questions.py <word_file.docx>")
        sys.exit(1)
    
    docx_path = sys.argv[1]
    questions = parse_word_questions(docx_path)
    generate_sql_inserts(questions)
