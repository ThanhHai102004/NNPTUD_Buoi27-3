# 📧 Hướng dẫn Import User với Gửi Email

## Tính năng chính
- ✅ Import user từ file Excel
- ✅ Tạo mật khẩu random 16 ký tự
- ✅ Gán role "user" mặc định
- ✅ **Gửi email tiếng Việt chứa mật khẩu**
- ✅ Xử lý lỗi và báo cáo chi tiết

## 🔧 Chuẩn bị

### 1. Setup MailTrap
1. Vào [https://mailtrap.io](https://mailtrap.io)
2. Đăng ký tài khoản (hoặc đăng nhập)
3. Tạo Inbox mới (hoặc dùng Inbox mặc định)
4. Lấy credentials:
   - Từ "Integrations" → "Nodemailer"
   - Copy **User** và **Pass**

### 2. Cập nhật MailTrap Credentials
Mở file `utils/senMailHandler.js` và điền credentials:

```javascript
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
        user: "YOUR_MAILTRAP_USER",  // ← Điền ở đây
        pass: "YOUR_MAILTRAP_PASS",  // ← Điền ở đây
    },
});
```

### 3. Tạo file sample
```bash
npm run create-sample
# hoặc
node create-sample-users.js
```

Sẽ tạo file `uploads/sample-users.xlsx` với 5 người dùng mẫu

## 🚀 Cách sử dụng

### Option 1: Import từ Excel file
```bash
curl -F "file=@uploads/sample-users.xlsx" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:3000/api/v1/import/excel
```

### Option 2: Import từ JSON
```bash
curl -X POST http://localhost:3000/api/v1/import/json \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "users": [
      {"username": "user1", "email": "user1@example.com"},
      {"username": "user2", "email": "user2@example.com"}
    ]
  }'
```

## 📊 Kết quả trả về
```json
{
  "message": "Import completed",
  "results": {
    "success": [
      {
        "row": 2,
        "username": "nguyen_van_a",
        "email": "nguyenvana@example.com",
        "password": "aB3!xK9$mL2@qW7z",
        "message": "✅ Người dùng được tạo và email đã gửi"
      }
    ],
    "failed": [],
    "total": 0
  },
  "summary": {
    "total": 5,
    "successful": 5,
    "failed": 0
  }
}
```

## 📧 Email Template
Email gửi bao gồm:
- 🎉 Lời chào mừng tiếng Việt
- 👤 Tên đăng nhập
- 🔐 Mật khẩu (hiển thị rõ)
- ⚠️ Cảnh báo thay đổi mật khẩu
- 🔗 Link đăng nhập
- 📞 Thông tin liên hệ hỗ trợ

## ✅ Kiểm tra trên MailTrap
1. Vào [https://mailtrap.io](https://mailtrap.io)
2. Chọn Inbox của bạn
3. Xem email được gửi
4. Kiểm tra tất cả thông tin đổi xứng được hiển thị

## 🐛 Troubleshoot

### Email không được gửi
- [ ] Kiểm tra MailTrap credentials có đúng không
- [ ] Kiểm tra kết nối internet
- [ ] Xem logs: `console.error` khi gửi email

### File import lỗi
- [ ] Kiểm tra file có đúng format Excel không
- [ ] Kiểm tra cột 1 là username, cột 2 là email
- [ ] Không được có dòng trống

### Người dùng đã tồn tại
- [ ] Kiểm tra username/email có trong DB chưa
- [ ] Có thể xoá user cũ hoặc dùng username khác

## 📝 Ghi chú
- Mật khẩu là ngẫu nhiên 16 ký tự (hoa, thường, số, ký tự đặc biệt)
- Role mặc định là "user"
- Status mặc định là "false"
- Email được gửi sau khi user được tạo thành công
