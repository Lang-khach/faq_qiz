# 🚀 Quick Start - Chạy Ngay Trong 5 Phút

## Bước 1: Cài Dependencies (30 giây)

```bash
npm install
```

## Bước 2: Tạo File .env.local (1 phút)

Tạo file `.env.local` với nội dung:

```env
# === QUAN TRỌNG: Phải điền đầy đủ các giá trị này ===

# 1. Google OAuth (Bắt buộc)
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# 2. NextAuth (Bắt buộc)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=random_32_character_string_here

# 3. Database - Dùng một trong hai:

# Option A: Vercel Postgres (Khuyến nghị)
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...

# Option B: Local PostgreSQL
# POSTGRES_URL=postgresql://postgres:password@localhost:5432/quiz_system
```

### Lấy Google OAuth Credentials

1. Vào: https://console.cloud.google.com/apis/credentials
2. Create Credentials → OAuth 2.0 Client ID
3. Application type: Web application
4. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID và Secret

### Generate NEXTAUTH_SECRET

```bash
# macOS/Linux:
openssl rand -base64 32

# Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Hoặc dùng online:
https://generate-secret.vercel.app/32
```

## Bước 3: Setup Database (2 phút)

### Option A: Vercel Postgres (Dễ nhất, Miễn phí)

1. Vào: https://vercel.com/storage
2. Create Database → Postgres
3. Copy connection strings vào `.env.local`
4. Vào tab **Query** và chạy:

```sql
-- Bước 1: Tạo tables (copy từ schema.sql)
CREATE TABLE questions (...);
CREATE TABLE quiz_sessions (...);
CREATE TABLE user_answers (...);

-- Bước 2: Import 314 câu hỏi (copy từ data/seed_questions_314.sql)
INSERT INTO questions VALUES (...);
```

### Option B: Local PostgreSQL

```bash
# Cài PostgreSQL (nếu chưa có)
# macOS:
brew install postgresql@15

# Ubuntu:
sudo apt install postgresql

# Windows: Download từ postgresql.org

# Tạo database
psql -U postgres
CREATE DATABASE quiz_system;
\q

# Import data
psql -U postgres -d quiz_system -f schema.sql
psql -U postgres -d quiz_system -f data/seed_questions_314.sql
```

## Bước 4: Chạy Development Server (10 giây)

```bash
npm run dev
```

## Bước 5: Mở Browser

Truy cập: http://localhost:3000

---

## ✅ Checklist

Trước khi chạy, đảm bảo:

- [ ] Đã chạy `npm install`
- [ ] File `.env.local` đã tạo
- [ ] `GOOGLE_CLIENT_ID` đã điền
- [ ] `GOOGLE_CLIENT_SECRET` đã điền
- [ ] `NEXTAUTH_SECRET` đã điền (32+ ký tự random)
- [ ] Database connection string đã điền
- [ ] Database đã có 314 câu hỏi (chạy seed_questions_314.sql)

---

## 🎯 Test Admin Features

Admin accounts (có quyền quản lý câu hỏi):
- `admin@gmail.com`
- `amin@gmail.com`
- `admin@example.com`
- `amin@example.com`

### Test Flow:
1. Login với Google (dùng email admin)
2. Truy cập: http://localhost:3000/admin
3. Test các tính năng:
   - Upload file Excel/Word
   - Thêm câu hỏi mới
   - Sửa câu hỏi
   - Xóa câu hỏi
   - Search câu hỏi

---

## 🐛 Lỗi Thường Gặp

### "OAuth Error: redirect_uri_mismatch"
**Fix:** Thêm `http://localhost:3000/api/auth/callback/google` vào Google Console

### "Database connection failed"
**Fix:** Kiểm tra `POSTGRES_URL` trong `.env.local` và database đang chạy

### "Cannot find module"
**Fix:** Chạy lại `npm install`

### Port 3000 đã bị chiếm
**Fix:** 
```bash
npm run dev -- -p 3001
# Nhớ update NEXTAUTH_URL=http://localhost:3001
```

---

## 📚 Chi Tiết Hơn

Xem file `LOCAL_DEVELOPMENT.md` để có hướng dẫn đầy đủ.

---

## 🎉 Thành Công!

Nếu bạn thấy landing page với giao diện FAQ style (màu cyan/yellow), bạn đã setup thành công!

**Enjoy! 🚀**
