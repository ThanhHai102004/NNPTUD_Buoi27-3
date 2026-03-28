# Quick Start Guide - User Import Feature

## 🚀 Quick Setup (5 minutes)

### Step 1: Database Setup
```javascript
// Connect to MongoDB and run this:
use NNPTUD-C6

db.roles.insertOne({
  "name": "user",
  "description": "Regular user role",
  "isDeleted": false,
  "createdAt": new ISODate(),
  "updatedAt": new ISODate()
})
```

### Step 2: Get Mailtrap Credentials
1. Visit https://mailtrap.io
2. Create free account
3. Go to Inboxes → My Inbox
4. Click "Show Credentials"
5. Choose "Nodemailer"
6. Copy username and password

### Step 3: Configure Email
Edit `utils/senMailHandler.js` - Line 8-10:
```javascript
auth: {
    user: "PASTE_YOUR_USERNAME_HERE",
    pass: "PASTE_YOUR_PASSWORD_HERE",
},
```

### Step 4: Get Admin JWT Token
Login as admin to get your token:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin_password"}'
```

Copy the token from response.

### Step 5: Test Import (Single User)
```bash
curl -X POST http://localhost:3000/api/v1/users/import/single \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com"
  }'
```

✅ Check Mailtrap inbox - you should see the welcome email!

---

## 📊 Test with Sample Data

### Sample users.json:
```json
{
  "users": [
    {"username": "alice", "email": "alice@company.com"},
    {"username": "bob", "email": "bob@company.com"},
    {"username": "charlie", "email": "charlie@company.com"}
  ]
}
```

### Import command:
```bash
curl -X POST http://localhost:3000/api/v1/users/import/json \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @users.json
```

---

## 📧 Checking Emails in Mailtrap

1. Login to https://mailtrap.io
2. Click Your Inbox
3. You'll see all imported users' emails
4. Each email contains:
   - Username
   - Random 16-character password
   - Login instructions

---

## ✅ Features Added

| Feature | Location |
|---------|----------|
| Random password generator | `utils/generatePassword.js` |
| User import controller | `controllers/userImport.js` |
| Import API routes | `routes/import.js` |
| Email with password | `utils/senMailHandler.js` |

---

## 🎯 API Endpoints

```
POST /api/v1/users/import/single
POST /api/v1/users/import/json  
POST /api/v1/users/import/excel
```

All require admin authentication!

---

## 💡 What Happens When You Import?

1. ✅ System generates random 16-char password
2. ✅ User created with hashed password
3. ✅ Welcome email sent with credentials
4. ✅ Default "user" role assigned
5. ✅ User account ready to use

---

## 🔐 Password Safety

- Passwords are **only sent via email** (never in API response)
- Passwords are **hashed in database** (using bcrypt)
- Each user gets **unique random password**
- Users should **change password on first login**

---

## 📞 Troubleshooting

| Problem | Solution |
|---------|----------|
| "User role not found" | Insert user role in MongoDB |
| Emails not arriving | Check Mailtrap credentials |
| "Unauthorized" error | Get valid admin JWT token |
| File upload fails | Ensure /uploads folder exists |

---

**Status:** ✅ Ready to Use!

For detailed guide, see: `USER_IMPORT_GUIDE.md`
