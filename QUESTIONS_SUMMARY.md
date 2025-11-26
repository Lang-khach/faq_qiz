# 📊 Tổng Hợp Câu Hỏi - Cập Nhật Mới

## 🎯 Thống Kê

### Bộ Câu Hỏi Ban Đầu
- **File Word**: `70_câu_bsung_340_câu_ĐA.docx`
- **Số câu hỏi**: 70 câu

### Bộ Câu Hỏi Bổ Sung
- **File Excel**: `Thi_chung_chi_nghiep_vu_Dau_thau_2025__270_cau_hoi___1___1_.xlsx`
- **Số câu hỏi**: 265 câu

### Kết Quả Merge
- ✅ **Tổng câu hỏi sau merge**: 314 câu
- 🔄 **Câu trùng lặp đã loại bỏ**: 21 câu
- ➕ **Câu mới thêm vào**: 244 câu

## 📁 Files SQL

### 1. seed_questions.sql (70 câu - Cũ)
- File gốc từ bộ 70 câu Word
- Kích thước: 52KB

### 2. seed_questions_314.sql (314 câu - MỚI) ⭐
- **File này là bản cập nhật mới nhất**
- Merge từ 70 câu cũ + 244 câu mới
- Đã loại bỏ 21 câu trùng lặp
- Kích thước: 216KB

## 🚀 Cách Import Vào Database

### Phương Pháp 1: Vercel Postgres Dashboard (Khuyến nghị)

1. Vào Vercel Dashboard > Storage > Database của bạn
2. Click tab **Query**
3. Chạy lệnh xóa câu hỏi cũ:
```sql
DELETE FROM questions;
```

4. Mở file `data/seed_questions_314.sql`
5. Copy toàn bộ nội dung
6. Paste vào Query editor và click **Run**
7. Kiểm tra:
```sql
SELECT COUNT(*) FROM questions;
-- Kết quả phải là: 314
```

### Phương Pháp 2: Upload qua Admin Panel

1. Sau khi deploy, truy cập `/admin`
2. Upload file Excel: `Thi_chung_chi_nghiep_vu_Dau_thau_2025__270_cau_hoi___1___1_.xlsx`
3. Hệ thống sẽ tự động parse và import

**Lưu ý**: Nếu dùng phương pháp 2, bạn sẽ có 265 câu từ file Excel mới (không bao gồm 70 câu cũ)

## 🔍 Quy Trình Loại Bỏ Trùng Lặp

Hệ thống sử dụng thuật toán so sánh thông minh:

1. **Normalize text**: Loại bỏ khoảng trắng thừa, chuyển về lowercase
2. **Similarity check**: Tính độ tương đồng giữa các câu hỏi
3. **Threshold**: 85% similarity = Coi là trùng lặp
4. **Cross-check**: So sánh cả nội dung câu hỏi và đáp án

### Ví Dụ Câu Trùng Lặp Đã Loại Bỏ

Các câu hỏi giống nhau hoặc rất tương tự về:
- Nội dung câu hỏi (>85% giống nhau)
- Các phương án trả lời (>80% giống nhau)
- Đáp án đúng giống nhau

## 📈 Phân Bố Câu Hỏi

### Từ Bộ Câu Cũ (70 câu)
- Các chủ đề về đấu thầu cơ bản
- Quy định pháp luật đấu thầu
- Hợp đồng và sửa đổi hợp đồng

### Từ Bộ Câu Mới (244 câu)
- Đấu thầu qua mạng
- Hệ thống mạng đấu thầu quốc gia
- Mua sắm công
- Các trường hợp đặc biệt

## ✅ Chất Lượng Câu Hỏi

Tất cả 314 câu đều:
- ✅ Có đầy đủ 4 đáp án A, B, C, D
- ✅ Có đáp án đúng rõ ràng
- ✅ Nội dung rõ ràng, không bị lỗi encoding
- ✅ Độ dài hợp lý (< 2000 ký tự cho câu hỏi, < 1000 ký tự cho mỗi đáp án)

## 🎓 Sử Dụng

### Cho Học Viên
- Hệ thống sẽ random 314 câu này theo thứ tự khác nhau cho mỗi user
- Mỗi user mỗi ngày sẽ có thứ tự câu hỏi nhất quán
- Users khác nhau sẽ có thứ tự câu hỏi khác nhau

### Cho Admin
- Có thể upload file mới để thay thế toàn bộ 314 câu
- Hoặc giữ nguyên và sử dụng bộ câu hỏi này

## 📝 Lưu Ý Quan Trọng

1. **File nên dùng**: `seed_questions_314.sql` (bản mới nhất)
2. **Backup**: Nên backup database trước khi import
3. **Testing**: Test với vài câu hỏi trước khi import toàn bộ
4. **Encoding**: Tất cả câu hỏi đã được xử lý UTF-8 đúng chuẩn

## 🔄 Cập Nhật Trong Tương Lai

Nếu có thêm câu hỏi mới:
1. Export câu hỏi hiện tại từ database
2. Merge với câu hỏi mới
3. Chạy script loại bỏ trùng lặp
4. Import lại vào database

---

**Tổng Kết**: Bộ câu hỏi hiện tại có **314 câu** chất lượng cao, đã loại bỏ trùng lặp, sẵn sàng sử dụng cho hệ thống trắc nghiệm!
