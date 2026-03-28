# 📋 HƯỚNG DẪN HÀNH ĐỘNG - CÁC BƯỚC TIẾP THEO

**Ngày:** 27 Tháng 3, 2026  
**Mục Đích:** Kích hoạt hệ thống nhập người dùng

---

## 🎯 BƯỚC 1: THIẾT LẬP DATABASE (5 phút)

### 1.1 Kết nối MongoDB
```bash
# Mở Terminal/Command Prompt
# Chạy MongoDB (nếu chưa chạy)
mongod

# Trong Terminal khác, mở MongoDB client
mongo
# hoặc (MongoDB mới)
mongosh
```

### 1.2 Chọn Database
```javascript
use NNPTUD-C6
```

### 1.3 Tạo Role
```javascript
db.roles.insertOne({
  "name": "user",
  "description": "Vai trò người dùng thông thường",
  "isDeleted": false,
  "createdAt": new Date(),
  "updatedAt": new Date()
})
```

**Kết quả kỳ vọng:**
```
{
  "acknowledged" : true,
  "insertedId" : ObjectId("...")
}
```

### ✅ KIỂM TRA:
```javascript
db.roles.findOne({name: "user"})
```

---

## 🎯 BƯỚC 2: CẤU HÌNH EMAIL MAILTRAP (10 phút)

### 2.1 Tạo Tài Khoản Mailtrap
1. Truy cập: **https://mailtrap.io**
2. Click "Sign Up"
3. Nhập email & password
4. Xác minh email

### 2.2 Lấy SMTP Credentials
1. Đăng nhập Mailtrap
2. Nhấp **"Inboxes"** (bên trái)
3. Click **"My Inbox"** (hoặc creation một inbox mới)
4. Nhấp nút **"Show Credentials"**
5. Chọn dropdown **"Nodemailer"** (nếu chưa chọn)

**Bạn sẽ thấy:**
```
Host: sandbox.smtp.mailtrap.io
Port: 587
Username: XXXXXX
Password: YYYYYY
```

### 2.3 Cập Nhật File Config
**Mở file:** `utils/senMailHandler.js`

**Tìm dòng (khoảng dòng 8-10):**
```javascript
auth: {
    user: "",
    pass: "",
},
```

**Thay thế thành:**
```javascript
auth: {
    user: "XXXX_TỪ_MAILTRAP",    // Điền Username từ Mailtrap
    pass: "YYYY_TỪ_MAILTRAP",    // Điền Password từ Mailtrap
},
```

### ✅ KIỂM TRA:
- Mật khẩu đã điền vào đúng ô
- Không có lỗi syntax
- File đã lưu

---

## 🎯 BƯỚC 3: KHỞI ĐỘNG SERVER (2 phút)

### 3.1 Mở Terminal
```bash
# Trong project folder NNPTUD-C6-20260327
# Chạy server
npm start
```

**Kết quả kỳ vọng:**
```
connected
Server running on port 3000...
```

---

## 🎯 BƯỚC 4: LẤY ADMIN TOKEN (3 phút)

### 4.1 Tạo Admin User (Nếu Chưa Có)
Giả sử bạn có admin tài khoản trong database

### 4.2 Gọi Login API
**Command:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin_password"}'
```

**Hoặc dùng Postman:**
1. Method: POST
2. URL: `http://localhost:3000/api/v1/auth/login`
3. Body (JSON):
```json
{
  "username": "admin",
  "password": "admin_password"
}
```

**Phản Hồi:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "role": "ADMIN"
  }
}
```

### ✅ COPY TOKEN
Sao chép token này, dùng cho tất cả request import

---

## 🎯 BƯỚC 5: TEST NHẬP NGƯỜI DÙNG ĐƠN LẺ (2 phút)

### 5.1 Dùng cURL
```bash
curl -X POST http://localhost:3000/api/v1/users/import/single \
  -H "Authorization: Bearer TOKEN_TỪ_BƯỚC_4" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com"
  }'
```

### 5.2 Hoặc Dùng Postman
1. Method: POST
2. URL: `http://localhost:3000/api/v1/users/import/single`
3. Headers:
   - `Authorization: Bearer YOUR_TOKEN`
   - `Content-Type: application/json`
4. Body (JSON):
```json
{
  "username": "test_user_1",
  "email": "test1@example.com"
}
```

**Phản Hồi Thành Công:**
```json
{
  "message": "User created and password email sent",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "test_user_1",
    "email": "test1@example.com"
  }
}
```

### ✅ KIỂM TRA:
- Có phản hồi `"User created and password email sent"`
- Có ID người dùng trong phản hồi

---

## 🎯 BƯỚC 6: KIỂM TRA EMAIL TRONG MAILTRAP (2 phút)

### 6.1 Vào Mailtrap Inbox
1. Truy cập: **https://mailtrap.io**
2. Đăng nhập
3. Click **"Inboxes"** → **"My Inbox"**

### 6.2 Xem Email Được Gửi
- Bạn sẽ thấy email từ `admin@hehehe.com`
- Click vào email để xem chi tiết

### 6.3 Kiểm Tra Nội Dung
**Email phải chứa:**
```
Tiêu Đề: Welcome - Your Account Created
Từ: admin@hehehe.com
Đến: test1@example.com

Nội Dung:
- Username: test_user_1
- Password: [random 16 ký tự]
- Cảnh báo thay đổi mật khẩu
```

### ✅ THÀNH CÔNG NẾU:
- ✅ Email được nhận
- ✅ Tên người dùng nhìn thấy được
- ✅ Mật khẩu nhìn thấy được
- ✅ Template HTML đẹp

---

## 🎯 BƯỚC 7: TEST NHẬP HÀNG LOẠT (2 phút)

### 7.1 Test Nhập Từ JSON

**Dùng cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/users/import/json \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "users": [
      {"username": "alice", "email": "alice@example.com"},
      {"username": "bob", "email": "bob@example.com"},
      {"username": "charlie", "email": "charlie@example.com"}
    ]
  }'
```

**Phản Hồi:**
```json
{
  "message": "Import completed",
  "results": {
    "success": [
      {"username": "alice", "email": "alice@example.com", ...},
      {"username": "bob", "email": "bob@example.com", ...},
      {"username": "charlie", "email": "charlie@example.com", ...}
    ],
    "failed": [],
    "total": 3
  },
  "summary": {
    "total": 3,
    "successful": 3,
    "failed": 0
  }
}
```

### ✅ KIỂM TRA:
- Thành công: 3
- Thất bại: 0
- Kiểm tra Mailtrap: 3 email mới

---

## 🎯 BƯỚC 8: TEST NHẬP TỪ EXCEL (5 phút)

### 8.1 Tạo File Excel
1. Mở Excel hoặc Google Sheets
2. Tạo 2 cột:

| username | email |
|----------|-------|
| student01 | student01@school.edu |
| student02 | student02@school.edu |
| student03 | student03@school.edu |

3. Lưu file: **`users.xlsx`**

### 8.2 Upload Bằng cURL
```bash
curl -X POST http://localhost:3000/api/v1/users/import/excel \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@users.xlsx"
```

### 8.3 Hoặc Dùng Postman
1. Method: POST
2. URL: `http://localhost:3000/api/v1/users/import/excel`
3. Header: `Authorization: Bearer YOUR_TOKEN`
4. Body: form-data
   - Key: `file`
   - Value: Chọn file `users.xlsx`

**Phản Hồi:** Tương tự JSON import

### ✅ KIỂM TRA:
- 3 người dùng được tạo
- 3 email trong Mailtrap
- Không có lỗi

---

## 🎯 BƯỚC 9: KIỂM TRA TÍNH NĂNG LỖI (2 phút)

### 9.1 Test Trùng Người Dùng
```bash
# Thử tạo lại user "john_doe" từ bước 5
curl -X POST http://localhost:3000/api/v1/users/import/single \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "duplicate@example.com"
  }'
```

**Phản Hồi Lỗi:**
```json
{
  "message": "Failed to create user: User already exists"
}
```

### ✅ ĐÚNG NẾU:
- Lỗi "User already exists"

---

## 🎯 BƯỚC 10: KIỂM TRA DATABASE (1 phút)

### 10.1 Xem Người Dùng Tạo Được
```javascript
use NNPTUD-C6
db.users.find({}, {username: 1, email: 1, password: 1})
```

**Kết Quả Kỳ Vọng:**
```javascript
[
  {
    _id: ObjectId(...),
    username: "john_doe",
    email: "john@example.com",
    password: "$2b$10$..." // Mật khẩu được mã hóa
  },
  ...
]
```

### ✅ KIỂM TRA:
- ✅ Có 6+ người dùng (từ 3 test)
- ✅ Mật khẩu bắt đầu với `$2b$10$` (bcrypt)
- ✅ Không có mật khẩu plain text

---

## 🎯 BƯỚC 11: COMMIT GITHUB (3 phút)

### 11.1 Kiểm Tra Status
```bash
git status
```

**Bạn sẽ thấy:**
```
Modified: app.js
Modified: utils/senMailHandler.js
Untracked: utils/generatePassword.js
Untracked: controllers/userImport.js
Untracked: routes/import.js
Untracked: [8 files markdown]
```

### 11.2 Thêm Tất Cả File
```bash
git add .
```

### 11.3 Commit
```bash
git commit -m "feat: add user import with random password and Mailtrap email"
```

### 11.4 Push
```bash
git push origin main
# Hoặc
git push origin master
```

---

## 🎯 BƯỚC 12: BACKUP & LƯUTRÍU (1 phút)

### 12.1 Sao Lưu Database
```bash
# Backup MongoDB
mongodump --db NNPTUD-C6 --out ./backup_20260327

# Hoặc nếu dùng MongoDB Atlas, tải backup từ dashboard
```

### 12.2 Sao Lưu Source Code
```bash
# Git đã backup ở remote
# Backup local: Zip folder
Compress-Archive -Path "NNPTUD-C6-20260327" -DestinationPath "backup_20260327.zip"
```

---

## 📊 BẢNG TÓMON CÁC BƯỚC

| Bước | Việc | Thời Gian | Trạng Thái |
|-----|------|----------|-----------|
| 1 | Tạo role trong MongoDB | 5 phút | ⏳ TODO |
| 2 | Cấu hình Mailtrap | 10 phút | ⏳ TODO |
| 3 | Khởi động server | 2 phút | ⏳ TODO |
| 4 | Lấy admin token | 3 phút | ⏳ TODO |
| 5 | Test import đơn lẻ | 2 phút | ⏳ TODO |
| 6 | Kiểm tra email | 2 phút | ⏳ TODO |
| 7 | Test import JSON | 2 phút | ⏳ TODO |
| 8 | Test import Excel | 5 phút | ⏳ TODO |
| 9 | Test lỗi | 2 phút | ⏳ TODO |
| 10 | Kiểm tra database | 1 phút | ⏳ TODO |
| 11 | Commit GitHub | 3 phút | ⏳ TODO |
| 12 | Backup | 1 phút | ⏳ TODO |
| **TỔNG CỘNG** | | **41 phút** | |

---

## 🚨 CÁC VẤN ĐỀ THƯỜNG GẶP & GIẢI PHÁP

### Vấn Đề 1: "User role not found"

**Nguyên Nhân:** Role "user" chưa tồn tại  
**Giải Pháp:**
```javascript
db.roles.insertOne({
  "name": "user",
  "description": "Vai trò người dùng thông thường",
  "isDeleted": false
})
```

---

### Vấn Đề 2: Emails không gửi được

**Nguyên Nhân:** Mailtrap credentials sai  
**Giải Pháp:**
1. Kiểm tra lại username & password trong Mailtrap
2. Cập nhật `utils/senMailHandler.js`
3. Restart server

---

### Vấn Đề 3: "Unauthorized" error (401)

**Nguyên Nhân:** JWT token hết hạn hoặc sai  
**Giải Pháp:**
1. Lấy token admin mới từ `/api/v1/auth/login`
2. Sử dụng token mới trong Authorization header

---

### Vấn Đề 4: "Port 3000 already in use"

**Nguyên Nhân:** Port 3000 đang được sử dụng  
**Giải Pháp:**
```bash
# Tìm process chiếm port 3000 (Windows)
netstat -ano | findstr :3000

# Tìm process (Mac/Linux)
lsof -i :3000

# Kill process
taskkill /PID <PID> /F  # Windows
kill -9 <PID>  # Mac/Linux
```

---

### Vấn Đề 5: Excel file không upload được

**Nguyên Nhân:** File không phải .xlsx hoặc .xls  
**Giải Pháp:** Lưu file dưới dạng Excel format

---

## 💾 CÁC FILE HỖTRỢ

| File | Vị Trí | Mục Đích |
|------|--------|---------|
| Hướng Dẫn Nhanh | `QUICK_START.md` | Bắt đầu nhanh |
| Hướng Dẫn Chi Tiết | `USER_IMPORT_GUIDE.md` | Tham khảo đầy đủ |
| Dữ Liệu Mẫu | `SAMPLE_DATA.md` | Test & học tập |
| Postman Collection | `postman_collection.json` | API testing |

---

## ✅ CHECKLIST HOÀN THÀNH

Sau khi hoàn thành tất cả bước:

- [ ] Tạo role "user"
- [ ] Cấu hình Mailtrap
- [ ] Server chạy bình thường
- [ ] Có admin token
- [ ] Import đơn lẻ thành công
- [ ] Email nhận được
- [ ] Import JSON thành công
- [ ] Import Excel thành công
- [ ] Test lỗi hoạt động
- [ ] User trong database
- [ ] Commit GitHub
- [ ] Backup dữ liệu

**Nếu tất cả ✅ = HOÀN THÀNH! 🎉**

---

## 📞 LIÊN HỆ & HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra lại các bước
2. Xem file `USER_IMPORT_GUIDE.md`
3. Kiểm tra lỗi ở `SAMPLE_DATA.md`

---

**Người phát triển:** GitHub Copilot  
**Ngày:** 27 Tháng 3, 2026  
**Trạng Thái:** Sẵn Sàng

---

## 🎯 BƯỚC TẮT

Nếu muốn nhanh nhất:

```bash
# 1. Tạo role (MongoDB)
db.roles.insertOne({"name":"user","isDeleted":false})

# 2. Cấu hình Mailtrap (utils/senMailHandler.js)
# Điền username & password

# 3. Start server
npm start

# 4. Login (lấy token)
curl -X POST http://localhost:3000/api/v1/auth/login \
  -d '{"username":"admin","password":"admin"}'

# 5. Test import
curl -X POST http://localhost:3000/api/v1/users/import/single \
  -H "Authorization: Bearer TOKEN" \
  -d '{"username":"test","email":"test@test.com"}'

# 6. Kiểm tra Mailtrap
# Vào https://mailtrap.io xem email
```

---

**Xong! Bạn có hệ thống nhập người dùng hoàn chỉnh! 🚀**
