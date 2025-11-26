# 🎓 Hệ Thống Trắc Nghiệm Online v3.0

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

Hệ thống trắc nghiệm trực tuyến hoàn chỉnh với **314 câu hỏi**, Google OAuth, admin panel với CRUD đầy đủ, và giao diện modern FAQ style.

---

## ✨ Tính Năng Nổi Bật

### 👥 Cho Người Dùng
- 🔐 Đăng nhập với Google OAuth
- 📝 314 câu hỏi chất lượng cao về đấu thầu
- 🎲 Random câu hỏi (mỗi user khác nhau)
- ✅ Chấm điểm tự động
- 🔄 Làm lại câu sai
- 📊 Xem chi tiết kết quả
- 💾 Lưu lịch sử làm bài
- 📱 Responsive trên mọi thiết bị

### 🛡️ Cho Admin
- ➕ Thêm/Sửa/Xóa câu hỏi
- 📤 Upload Excel/Word để import hàng loạt  
- 🔍 Tìm kiếm và filter câu hỏi
- 📄 Phân trang (10 câu/trang)
- 🔐 Chỉ admin (username = admin) mới truy cập được

---

## 🚀 Quick Start (5 phút)

```bash
# 1. Clone & Install
git clone YOUR_REPO_URL
cd quiz-system
npm install

# 2. Setup .env.local
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...

# 3. Run
npm run dev

# 4. Deploy to Vercel
vercel
```

**Chi tiết:** Xem [QUICKSTART.md](QUICKSTART.md)

---

## 🎨 Giao Diện

**Modern FAQ Style** với:
- Cyan/Yellow theme (ANNA design)
- Clean navigation
- Expandable FAQ cards
- Professional footer
- Smooth animations

---

## 💻 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript  
- **Styling:** Tailwind CSS
- **Auth:** NextAuth.js (Google OAuth)
- **Database:** Vercel Postgres
- **Hosting:** Vercel (Free tier)

---

## 🔐 Admin Access

**Rule:** Email có username = `admin` → Là admin

Examples:
- ✅ `admin@gmail.com` → Admin
- ✅ `admin@company.com` → Admin
- ❌ `user@gmail.com` → User

Hoặc edit `lib/admin.ts` để thêm email cụ thể.

---

## 📚 Database (314 Câu Hỏi)

**Import:** `data/seed_questions_314.sql`

**Schema:**
- `questions` - 314 câu hỏi
- `quiz_sessions` - Lịch sử làm bài
- `user_answers` - Chi tiết câu trả lời

---

## 📖 Hướng Dẫn

### Học Viên
1. Login Google → Làm bài → Xem kết quả → Làm lại câu sai

### Admin  
1. Login với admin email
2. Vào `/admin`
3. Tab "Upload" → Import file
4. Tab "Quản Lý" → CRUD câu hỏi

---

## 📊 Upload File Format

**Excel (.xlsx):**
```
Question | A | B | C | D | Correct
---------|---|---|---|---|--------
2+2=?    | 3 | 4 | 5 | 6 | B
```

**Word (.docx):**
```
STT | Nội dung | Phương án | Đáp án
----|----------|-----------|--------
1   | 2+2=?    | A.3 B.4...| B
```

---

## 🔧 API Endpoints

**Public:**
- `GET /api/questions` - Lấy câu hỏi (random)
- `POST /api/submit` - Nộp bài

**Admin Only:**
- `GET/POST/PUT/DELETE /api/admin/questions` - CRUD
- `POST /api/admin/upload` - Upload file

---

## 🐛 Troubleshooting

**Issue:** Không vào được /admin  
**Fix:** Check email trong `lib/admin.ts`

**Issue:** Câu hỏi không load  
**Fix:** Verify database: `SELECT COUNT(*) FROM questions;`

**Issue:** OAuth error  
**Fix:** Check redirect URI in Google Console

---

## 📁 Project Structure

```
quiz-system/
├── app/
│   ├── api/          # APIs
│   ├── admin/        # Admin panel (CRUD)
│   ├── quiz/         # Quiz page
│   ├── results/      # Results page
│   └── page.tsx      # Landing (FAQ style)
├── lib/
│   ├── db.ts         # Database utils
│   └── admin.ts      # Admin checker
├── data/
│   └── seed_questions_314.sql  # 314 questions
├── QUICKSTART.md     # 5-min setup
├── DEPLOY.md         # Deploy guide
└── README.md         # This file
```

---

## 📚 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Setup nhanh
- [DEPLOY.md](DEPLOY.md) - Deploy chi tiết
- [FINAL_RELEASE.md](FINAL_RELEASE.md) - Release notes v3.0
- [CHANGELOG.md](CHANGELOG.md) - Version history

---

## 🎯 Features Checklist

- ✅ Google OAuth login
- ✅ 314 câu hỏi đấu thầu
- ✅ Random per user
- ✅ Auto-grading
- ✅ Retry wrong answers
- ✅ Admin CRUD
- ✅ File upload (Excel/Word)
- ✅ Search & pagination
- ✅ Modern UI (FAQ style)
- ✅ Responsive design
- ✅ Role-based access
- ✅ Session history

---

## 📈 Performance

- Landing: < 1s
- Quiz load: < 2s (314 questions)
- Submit: < 1s
- Admin: < 1.5s

---

## 🔒 Security

- ✅ Google OAuth
- ✅ JWT tokens
- ✅ Role-based access
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ HTTPS only

---

## 📄 License

MIT License

---

## 🙏 Credits

Built with ❤️ using Next.js and Vercel  
**By IrraHub**

---

**⭐ Star this repo if useful!**
