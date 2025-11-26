# 🚀 HƯỚNG DẪN NHANH - Hệ Thống Trắc Nghiệm

## 📦 Nội dung Package

- **Full source code** Next.js 14 + TypeScript + Tailwind CSS
- **Database** Vercel Postgres với schema hoàn chỉnh
- **314 câu hỏi** đã được parse và merge (70 câu cũ + 244 câu mới unique)
- **SQL file** sẵn sàng import: `data/seed_questions_314.sql`
- **Modern FAQ UI** theo thiết kế ANNA style

## ⚡ Deploy trong 5 phút

### 1. Push lên GitHub
```bash
cd quiz-system
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy lên Vercel
1. Vào [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Tạo Vercel Postgres database
4. Thêm Google OAuth credentials vào Environment Variables

### 3. Import 314 câu hỏi
**Cách 1** - Copy/Paste (Nhanh nhất):
1. Mở file `data/seed_questions_314.sql`
2. Copy toàn bộ nội dung (314 câu)
3. Vào Vercel Dashboard > Storage > Query tab
4. Xóa câu cũ: `DELETE FROM questions;`
5. Paste SQL và Run

**Cách 2** - Upload qua Admin:
1. Truy cập `/admin` sau khi deploy
2. Upload file Excel mới

### 4. Hoàn tất! 🎉
Truy cập: `https://your-domain.vercel.app`

## ✨ Tính năng

✅ **Random câu hỏi** - Mỗi user nhận thứ tự câu hỏi khác nhau  
✅ **Chấm điểm tự động** - Kết quả hiển thị ngay lập tức  
✅ **Làm lại câu sai** - Ôn luyện những câu trả lời sai  
✅ **Lưu lịch sử** - Theo dõi tiến độ học tập  
✅ **Google OAuth** - Đăng nhập an toàn  
✅ **Responsive** - Hoạt động tốt trên mọi thiết bị  

## 📁 Cấu trúc Project

```
quiz-system/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API endpoints
│   ├── admin/             # Admin panel
│   ├── quiz/              # Quiz interface
│   └── results/           # Results page
├── lib/                   # Database utilities
├── data/                  # SQL seed data
│   └── seed_questions.sql # 70 câu hỏi đã parse
├── DEPLOY.md              # Hướng dẫn deploy chi tiết
└── README.md              # Documentation đầy đủ
```

## 🔐 Environment Variables Cần Thiết

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=...
# Vercel Postgres auto-added
```

## 📖 Tài liệu đầy đủ

- **DEPLOY.md** - Hướng dẫn deploy từng bước chi tiết
- **README.md** - Documentation đầy đủ về project
- **schema.sql** - Database schema
- **seed_questions.sql** - 70 câu hỏi để import

## 🆘 Cần trợ giúp?

1. Xem file **DEPLOY.md** để biết hướng dẫn chi tiết
2. Kiểm tra Vercel deployment logs
3. Xem browser console để debug

## 🎯 Lưu ý quan trọng

- **File Word gốc** đã được parse thành 70 câu hỏi trong `seed_questions.sql`
- **Random algorithm** đảm bảo mỗi user có thứ tự câu hỏi khác nhau
- **Database** sử dụng Vercel Postgres (miễn phí 256MB)
- **Upload mới** sẽ xóa câu hỏi cũ và thay thế

## 💡 Tips

- Sử dụng **Vercel Postgres Dashboard** để xem data
- Upload file Word qua `/admin` để cập nhật câu hỏi
- Check environment variables nếu gặp lỗi OAuth

---

**Chúc bạn deploy thành công! 🚀**

Nếu cần hỗ trợ, hãy xem file DEPLOY.md để biết thêm chi tiết.
