# 🚀 Hướng dẫn Deploy lên Vercel - Chi tiết

## Bước 1: Chuẩn bị Google OAuth

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Chọn **Web application**
6. Thêm **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-domain.vercel.app/api/auth/callback/google
   ```
7. Lưu lại **Client ID** và **Client Secret**

## Bước 2: Push code lên GitHub

```bash
cd quiz-system
git init
git add .
git commit -m "Initial commit: Quiz system with Vercel Postgres"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quiz-system.git
git push -u origin main
```

## Bước 3: Deploy trên Vercel

1. Truy cập [vercel.com](https://vercel.com) và đăng nhập
2. Click **New Project**
3. Import repository từ GitHub
4. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`

## Bước 4: Tạo Vercel Postgres Database

1. Trong Vercel Dashboard, vào tab **Storage**
2. Click **Create Database**  
3. Chọn **Postgres**
4. Đặt tên database (ví dụ: `quiz-db`)
5. Chọn region gần người dùng nhất (ví dụ: Singapore)
6. Click **Create**

✅ Vercel sẽ tự động thêm các environment variables sau:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

## Bước 5: Thêm Environment Variables

Trong Vercel Dashboard > **Settings** > **Environment Variables**, thêm:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=run: openssl rand -base64 32
```

**Tạo NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## Bước 6: Import Câu Hỏi vào Database

### Cách 1: Sử dụng Vercel Postgres Dashboard (Khuyến nghị)

1. Vào Vercel Dashboard > **Storage** > chọn database vừa tạo
2. Click tab **Query**
3. Chạy script tạo bảng:

```sql
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer VARCHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_sessions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_answers (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    selected_answer VARCHAR(1) CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_answers_email ON user_answers(user_email);
CREATE INDEX IF NOT EXISTS idx_user_answers_session ON user_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_email ON quiz_sessions(user_email);
```

4. Mở file `seed_questions.sql` và copy toàn bộ nội dung
5. Paste vào Query editor và click **Run**
6. Kiểm tra: `SELECT COUNT(*) FROM questions;` - Phải có 70 câu

### Cách 2: Sử dụng Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local

# Import SQL (yêu cầu có psql)
psql $POSTGRES_URL < seed_questions.sql
```

### Cách 3: Upload qua Admin Panel (Sau khi deploy)

1. Truy cập `https://your-domain.vercel.app/admin`
2. Đăng nhập bằng Google
3. Upload file Word gốc (`70_câu_bsung_340_câu_ĐA.docx`)
4. Hệ thống sẽ tự động parse và import

## Bước 7: Deploy lần cuối

```bash
git add .
git commit -m "Add environment variables"
git push
```

Vercel sẽ tự động deploy lại.

## Bước 8: Test hệ thống

1. Truy cập `https://your-domain.vercel.app`
2. Đăng nhập bằng Google
3. Click "Bắt đầu làm bài"
4. Kiểm tra các tính năng:
   - ✅ Random câu hỏi khác nhau cho mỗi user
   - ✅ Chấm điểm tự động
   - ✅ Xem chi tiết đáp án
   - ✅ Làm lại câu sai

## 🎯 Các tính năng chính

1. **Random câu hỏi theo user**: Mỗi user sẽ có thứ tự câu hỏi khác nhau dựa trên email và ngày
2. **Chấm điểm tự động**: Kết quả hiển thị ngay sau khi nộp bài
3. **Làm lại câu sai**: User có thể ôn luyện lại những câu trả lời sai
4. **Lưu trữ lịch sử**: Tất cả kết quả được lưu trong database

## 📝 Lưu ý quan trọng

- File `seed_questions.sql` chứa 70 câu hỏi đã được parse từ file Word
- Mỗi lần upload file mới ở Admin sẽ xóa toàn bộ câu hỏi cũ
- Database sử dụng Vercel Postgres (miễn phí với giới hạn 256 MB)
- Câu hỏi được random khác nhau cho mỗi user mỗi ngày

## 🔧 Troubleshooting

### Lỗi: "Database connection failed"
- Kiểm tra environment variables đã được setup đúng
- Đảm bảo Vercel Postgres đã được tạo và linked

### Lỗi: "OAuth error"
- Kiểm tra Google OAuth credentials
- Đảm bảo redirect URIs đã được thêm chính xác
- Verify NEXTAUTH_URL và NEXTAUTH_SECRET

### Câu hỏi không random
- Xóa cache browser và thử lại
- Kiểm tra API `/api/questions` có đang hoạt động

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Vercel deployment logs
2. Browser console logs  
3. Database connection trong Vercel Dashboard

## 🎉 Hoàn tất!

Hệ thống đã sẵn sàng sử dụng tại: `https://your-domain.vercel.app`
