# 📚 Sample Data & Testing Guide

## 📊 How to Create Sample Excel File

### Option 1: Using Microsoft Excel

1. Open Excel
2. Create headers in Row 1:
   - Cell A1: `username`
   - Cell B1: `email`

3. Add sample data:
   ```
   Row 2: john_doe     | john@company.com
   Row 3: jane_smith   | jane@company.com
   Row 4: bob_wilson   | bob@company.com
   Row 5: alice_jones  | alice@company.com
   ```

4. Save as: `users.xlsx`

### Option 2: Using Google Sheets

1. Create new Google Sheet
2. Add same data as above
3. Download as Excel (File → Download → Microsoft Excel)

### Option 3: Using LibreOffice Calc

1. Create new spreadsheet
2. Add same data
3. Save as Excel format

---

## 📝 Sample JSON Test Data

Create file `test_users.json`:

```json
{
  "users": [
    {
      "username": "student01",
      "email": "student01@university.edu"
    },
    {
      "username": "student02",
      "email": "student02@university.edu"
    },
    {
      "username": "student03",
      "email": "student03@university.edu"
    },
    {
      "username": "student04",
      "email": "student04@university.edu"
    },
    {
      "username": "student05",
      "email": "student05@university.edu"
    }
  ]
}
```

### Use with cURL:

```bash
curl -X POST http://localhost:3000/api/v1/users/import/json \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @test_users.json
```

---

## 🧪 Test Scenarios

### Test 1: Single User Success
```bash
curl -X POST http://localhost:3000/api/v1/users/import/single \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user_1",
    "email": "testuser1@example.com"
  }'
```
**Expected:** ✅ User created, email sent

---

### Test 2: Duplicate User (Should Fail)
```bash
# First request - success
curl -X POST http://localhost:3000/api/v1/users/import/single \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "duplicate_user",
    "email": "duplicate@example.com"
  }'

# Second request with same username - should fail
curl -X POST http://localhost:3000/api/v1/users/import/single \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "duplicate_user",
    "email": "different@example.com"
  }'
```
**Expected:** ❌ Error: "User already exists"

---

### Test 3: Missing Required Fields
```bash
curl -X POST http://localhost:3000/api/v1/users/import/single \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "incomplete_user"
  }'
```
**Expected:** ❌ Error: "Username and email are required"

---

### Test 4: Bulk Import with Mix of Valid/Invalid
```json
{
  "users": [
    {"username": "valid_user1", "email": "valid1@example.com"},
    {"username": "valid_user2", "email": "valid2@example.com"},
    {"username": "", "email": "invalid@example.com"},
    {"username": "valid_user3", "email": ""}
  ]
}
```
**Expected:** 2 success, 2 failed in response

---

## 🔐 Sample Credentials for Testing

### Test Admin Account
```
Username: admin
Email: admin@system.com
Password: admin123
Role: ADMIN
```

After getting token from login, use it in all import endpoints.

---

## 📧 Sample Email Response from Mailtrap

When you check Mailtrap inbox, you'll see emails like:

**From:** admin@hehehe.com  
**To:** john@company.com  
**Subject:** Welcome - Your Account Created  

**Email Body:**
```
Welcome to Our System!

Your account has been successfully created.

Username: john_doe
Password: aB7#kX9@mP2$lQ4!

⚠️ Please change your password after first login

[Login to Your Account button]

---
This is an automated email. Please do not reply.
```

---

## 🔍 Response Examples

### Success Response (Single User):
```json
{
  "message": "User created and password email sent",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Error Response (Duplicate):
```json
{
  "message": "Failed to create user: User already exists"
}
```

### Bulk Import Response:
```json
{
  "message": "Import completed",
  "results": {
    "success": [
      {
        "username": "alice",
        "email": "alice@example.com",
        "message": "User created and email sent"
      }
    ],
    "failed": [
      {
        "username": "bob",
        "email": "bob@example.com",
        "error": "User already exists"
      }
    ],
    "total": 2
  },
  "summary": {
    "total": 2,
    "successful": 1,
    "failed": 1
  }
}
```

---

## 📤 Batch Operations Using Postman

### Step 1: Set Variables
In Postman, go to **Environments** → **New**

Add variables:
```
base_url: http://localhost:3000
jwt_token: your_admin_token
```

### Step 2: Import Collection
1. Click **Import** → Upload `postman_collection.json`
2. Select the environment you created
3. Run each request

### Step 3: View Results
Check in Postman:
- Response body shows import results
- Check Mailtrap to confirm emails sent

---

## 🎓 Learning Resources

- **Nodemailer:** https://nodemailer.com
- **Mailtrap:** https://mailtrap.io
- **ExcelJS:** https://github.com/exceljs/exceljs
- **Express.js:** https://expressjs.com
- **MongoDB:** https://www.mongodb.com

---

## 📊 Expected Test Results

After importing 5 users:

**Database Check:**
```javascript
db.users.find().count()  // Should be 5 (or more if existing users)
```

**Mailtrap Check:**
```
5 emails received with:
- Username in email body
- Random password visible
- Formatted welcome message
```

**Email Pattern:**
```
Subject: Welcome - Your Account Created
From: admin@hehehe.com
To: [user_email]

Body contains:
- Username: [username]
- Password: [random_16_chars]
- Warning to change password
```

---

**Last Updated:** March 27, 2026
