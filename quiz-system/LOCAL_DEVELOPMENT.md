# 🚀 Hướng Dẫn Chạy Local Development

## 📋 Yêu Cầu Hệ Thống

- **Node.js**: >= 18.x (Khuyến nghị 20.x)
- **npm** hoặc **yarn**
- **Git** (optional)

---

## 🔧 Bước 1: Cài Đặt Dependencies

Mở terminal trong thư mục `quiz-system` và chạy:

```bash
npm install
```

Hoặc nếu dùng yarn:
```bash
yarn install
```

**Thời gian:** Khoảng 2-3 phút

---

## 🔑 Bước 2: Setup Google OAuth (Quan Trọng!)

### 2.1. Tạo Google OAuth Credentials

1. Truy cập: https://console.cloud.google.com/
2. Tạo project mới (hoặc chọn project có sẵn)
3. Vào **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Chọn **Application type**: Web application
6. Thêm **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Click **Create** và copy:
   - Client ID
   - Client Secret

### 2.2. Tạo File Environment

Tạo file `.env.local` trong thư mục gốc:

```bash
# Copy từ .env.example
cp .env.example .env.local
```

Hoặc tạo file `.env.local` với nội dung:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here

# Vercel Postgres (cho local dev - optional)
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
```

### 2.3. Generate NEXTAUTH_SECRET

```bash
# Trên macOS/Linux:
openssl rand -base64 32

# Trên Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Hoặc dùng online: https://generate-secret.vercel.app/32
```

Copy kết quả vào `NEXTAUTH_SECRET` trong `.env.local`

---

## 💾 Bước 3: Setup Database

### Option A: Dùng Vercel Postgres (Khuyến nghị)

1. **Tạo Free Postgres trên Vercel:**
   - Vào: https://vercel.com/storage
   - Click **Create Database**
   - Chọn **Postgres**
   - Chọn region gần nhất
   - Copy connection strings

2. **Thêm vào .env.local:**
   - Copy tất cả biến `POSTGRES_*` từ Vercel
   - Paste vào file `.env.local`

3. **Tạo Tables:**
   ```bash
   # Mở Vercel Dashboard > Storage > Query tab
   # Copy và run nội dung từ file schema.sql
   ```

4. **Import 314 Câu Hỏi:**
   ```bash
   # Vẫn trong Query tab
   # Copy và run nội dung từ data/seed_questions_314.sql
   ```

### Option B: Dùng Local PostgreSQL

**Cài PostgreSQL:**
```bash
# macOS
brew install postgresql@15

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# Windows
# Download từ: https://www.postgresql.org/download/windows/
```

**Tạo Database:**
```bash
# Start PostgreSQL service
sudo service postgresql start  # Linux
brew services start postgresql@15  # macOS

# Create database
psql -U postgres
CREATE DATABASE quiz_system;
\q
```

**Connection String:**
```env
POSTGRES_URL=postgresql://postgres:password@localhost:5432/quiz_system
```

**Import Schema & Data:**
```bash
psql -U postgres -d quiz_system -f schema.sql
psql -U postgres -d quiz_system -f data/seed_questions_314.sql
```

---

## ▶️ Bước 4: Chạy Development Server

```bash
npm run dev
```

Hoặc:
```bash
yarn dev
```

**Kết quả:**
```
> quiz-system@1.0.0 dev
> next dev

  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Ready in 2.1s
```

---

## 🧪 Bước 5: Test Hệ Thống

### 5.1. Mở Browser
Truy cập: http://localhost:3000

### 5.2. Test Flow Cơ Bản

**1. Test Landing Page**
- ✅ Kiểm tra giao diện FAQ style
- ✅ Click "Đăng nhập với Google"

**2. Test Google OAuth**
- ✅ Chọn tài khoản Google
- ✅ Cho phép quyền truy cập
- ✅ Redirect về trang chủ (đã login)

**3. Test Quiz Flow**
- ✅ Click "Bắt Đầu Làm Bài"
- ✅ Kiểm tra load 314 câu hỏi
- ✅ Trả lời vài câu
- ✅ Navigate giữa các câu
- ✅ Nộp bài

**4. Test Results**
- ✅ Xem điểm số
- ✅ Xem chi tiết đáp án
- ✅ Click "Làm lại câu sai"

**5. Test Admin Panel**
- ✅ Login với email admin (admin@gmail.com)
- ✅ Truy cập /admin
- ✅ Thêm câu hỏi mới
- ✅ Sửa câu hỏi
- ✅ Xóa câu hỏi
- ✅ Upload file Excel

---

## 🔍 Troubleshooting

### Lỗi: "Module not found"
```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "NEXTAUTH_URL is not set"
```bash
# Kiểm tra file .env.local có tồn tại
ls -la .env.local

# Nếu không có, tạo mới
cp .env.example .env.local
```

### Lỗi: "Database connection failed"
```bash
# Kiểm tra POSTGRES_URL trong .env.local
# Verify database đang chạy
psql -U postgres -d quiz_system -c "SELECT 1;"
```

### Lỗi: "OAuth redirect_uri_mismatch"
```bash
# Kiểm tra Google Console:
# Authorized redirect URIs phải có:
# http://localhost:3000/api/auth/callback/google
```

### Port 3000 bị chiếm
```bash
# Chạy trên port khác
npm run dev -- -p 3001

# Nhớ update NEXTAUTH_URL
NEXTAUTH_URL=http://localhost:3001
```

---

## 📱 Test Trên Các Devices

### Desktop
- Chrome: http://localhost:3000
- Firefox: http://localhost:3000
- Safari: http://localhost:3000

### Mobile (Cùng WiFi)
1. Tìm IP máy tính:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig | findstr IPv4
   ```

2. Trên mobile mở: http://YOUR_IP:3000
   - Ví dụ: http://192.168.1.100:3000

3. **Lưu ý:** Update Google OAuth redirect URI:
   ```
   http://YOUR_IP:3000/api/auth/callback/google
   ```

---

## 🎯 Quick Test Checklist

### Authentication
- [ ] Google OAuth login
- [ ] Logout
- [ ] Session persistence (refresh page)

### Quiz
- [ ] Load questions (should be 314)
- [ ] Navigate between questions
- [ ] Select answers
- [ ] Submit quiz
- [ ] View results

### Results
- [ ] See score
- [ ] View wrong answers
- [ ] Retry wrong answers
- [ ] Redo entire quiz

### Admin (Login as admin@gmail.com)
- [ ] Access /admin
- [ ] View all questions
- [ ] Search questions
- [ ] Add new question
- [ ] Edit question
- [ ] Delete question
- [ ] Upload Excel file

### Regular User (Non-admin email)
- [ ] Cannot access /admin
- [ ] See "Không có quyền truy cập"

---

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run build && npm run start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

---

## 📊 Verify Database

### Check Tables
```bash
psql -U postgres -d quiz_system

# List all tables
\dt

# Should see:
# - questions
# - quiz_sessions
# - user_answers
```

### Count Questions
```sql
SELECT COUNT(*) FROM questions;
-- Should return: 314
```

### Check Admin Functionality
```sql
-- View all questions with answers (admin view)
SELECT id, content, correct_answer FROM questions LIMIT 5;
```

---

## 🎨 Customize Admin Emails

File: `lib/admin.ts`

```typescript
const ADMIN_EMAILS = [
  'admin@gmail.com',    // Default
  'amin@gmail.com',     // Alternative spelling
  'youremail@gmail.com', // Add your email here
];
```

Sau khi sửa, restart dev server:
```bash
# Ctrl+C để stop
npm run dev  # Start lại
```

---

## 📸 Expected Results

### Landing Page
- Modern FAQ style
- Cyan/Yellow colors
- Google login button

### Quiz Page
- Progress bar
- Question counter (1/314)
- 4 options (A, B, C, D)
- Navigation buttons
- Question grid

### Results Page
- Score percentage
- Green/Red indicators
- Detailed answers
- Retry buttons

### Admin Panel
- Upload tab
- Manage questions tab
- CRUD operations
- Search & pagination

---

## 🔄 Reset Database (If Needed)

```sql
-- Xóa tất cả dữ liệu
DELETE FROM user_answers;
DELETE FROM quiz_sessions;
DELETE FROM questions;

-- Import lại
-- Run data/seed_questions_314.sql
```

---

## ✅ You're Ready When...

- [ ] Dev server chạy không lỗi
- [ ] Có thể login với Google
- [ ] Load được 314 câu hỏi
- [ ] Submit quiz và xem results
- [ ] Admin panel hoạt động (với admin email)

---

## 📞 Need Help?

1. Check terminal logs
2. Check browser console (F12)
3. Review .env.local file
4. Verify database connection
5. Check Google OAuth settings

---

## 🎉 Success!

Nếu tất cả hoạt động, bạn đã sẵn sàng để:
- Develop thêm features
- Test với real users
- Deploy to production

**Happy coding! 🚀**
