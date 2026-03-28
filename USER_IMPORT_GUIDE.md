# User Import with Random Password & Email System

This guide explains how to set up and use the bulk user import feature with automatic password generation and email notifications via Mailtrap.

---

## 📋 Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Mailtrap Configuration](#mailtrap-configuration)
3. [API Endpoints](#api-endpoints)
4. [Usage Examples](#usage-examples)
5. [Files Created](#files-created)

---

## 🔧 Setup Instructions

### 1. Install Dependencies (Already in package.json)

All necessary dependencies are already listed:
- `nodemailer` - for sending emails
- `exceljs` - for reading Excel files
- `express` - web framework

If you haven't installed them yet:
```bash
npm install
```

### 2. Create "user" Role in Database

Before importing users, ensure a "user" role exists in your database:

```javascript
// Connect to MongoDB and run:
db.roles.insertOne({
  name: "user",
  description: "Regular user role",
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### 3. Files Created/Modified

**New Files:**
- `utils/generatePassword.js` - Random password generator
- `controllers/userImport.js` - Import logic
- `routes/import.js` - API routes

**Modified Files:**
- `utils/senMailHandler.js` - Added password email template
- `app.js` - Added import routes

---

## 📧 Mailtrap Configuration

### Step 1: Create Mailtrap Account

1. Go to [https://mailtrap.io](https://mailtrap.io)
2. Sign up for free account
3. Verify your email

### Step 2: Get SMTP Credentials

1. Login to Mailtrap dashboard
2. Click on **"Inboxes"** → **"My Inbox"** (or create a new inbox)
3. Click **"Show Credentials"** button
4. Select **"Nodemailer"** from dropdown (if not already selected)

You'll see something like:
```
host: sandbox.smtp.mailtrap.io
port: 587
user: your_username_here
pass: your_password_here
```

### Step 3: Update Email Configuration

Edit `utils/senMailHandler.js` and replace the empty credentials:

```javascript
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
        user: "YOUR_MAILTRAP_USERNAME",  // Replace here
        pass: "YOUR_MAILTRAP_PASSWORD",  // Replace here
    },
});
```

### Step 4: Test Email Connection

You can test by sending a test email using the single user endpoint (see below).

---

## 🎯 API Endpoints

All endpoints require admin authentication (token + ADMIN role).

### Endpoint 1: Import from Excel File

**URL:** `POST /api/v1/users/import/excel`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

**Body:** Form data with file field
- File: `file` (Excel .xlsx or .xls format)

**Excel File Format:**
| Column 1 | Column 2 |
|----------|----------|
| username | email    |
| john_doe | john@example.com |
| jane_doe | jane@example.com |

**Response:**
```json
{
  "message": "Import completed",
  "results": {
    "success": [
      {
        "row": 2,
        "username": "john_doe",
        "email": "john@example.com",
        "message": "User created and email sent"
      }
    ],
    "failed": [],
    "total": 1
  },
  "summary": {
    "total": 1,
    "successful": 1,
    "failed": 0
  }
}
```

---

### Endpoint 2: Import from JSON

**URL:** `POST /api/v1/users/import/json`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "users": [
    {
      "username": "john_doe",
      "email": "john@example.com"
    },
    {
      "username": "jane_doe",
      "email": "jane@example.com"
    }
  ]
}
```

**Response:** Same as Excel import

---

### Endpoint 3: Create Single User

**URL:** `POST /api/v1/users/import/single`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Response:**
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

---

## 💡 Usage Examples

### Using cURL (Command Line)

#### 1. Import Single User
```bash
curl -X POST http://localhost:3000/api/v1/users/import/single \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com"
  }'
```

#### 2. Import Multiple Users from JSON
```bash
curl -X POST http://localhost:3000/api/v1/users/import/json \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "users": [
      {"username": "user1", "email": "user1@example.com"},
      {"username": "user2", "email": "user2@example.com"}
    ]
  }'
```

#### 3. Import from Excel File
```bash
curl -X POST http://localhost:3000/api/v1/users/import/excel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@users.xlsx"
```

---

### Using Postman

#### Setup:
1. Create a new Collection
2. Set environment variable: `jwt_token` = your JWT token

#### Test Single User Creation:

1. **New Request**
   - Method: `POST`
   - URL: `{{base_url}}/api/v1/users/import/single`

2. **Headers Tab:**
   - `Authorization: Bearer {{jwt_token}}`
   - `Content-Type: application/json`

3. **Body Tab (raw JSON):**
```json
{
  "username": "test_user",
  "email": "test@example.com"
}
```

4. Click **Send**

---

## 🎬 Checking Sent Emails in Mailtrap

### Step 1: View Inbox
1. Login to [https://mailtrap.io](https://mailtrap.io)
2. Go to **Inboxes** → **My Inbox**
3. You'll see all emails sent through your credentials

### Step 2: View Email Details
Click on any email to see:
- HTML preview
- Plain text
- Full headers
- Attachments (if any)

**Screenshot area:** You should see something like:

```
To: user@example.com
Subject: Welcome - Your Account Created
From: admin@hehehe.com

[Email Body with username and password]
```

---

## ⚙️ Technical Details

### Password Generation
- Length: 16 characters
- Characters: A-Z, a-z, 0-9, !@#$%^&*
- Generated independently for each user
- Never logged or returned in response

### Email Flow
1. User created in database (password hashed by bcrypt)
2. Plain password sent via email only
3. User updates their password on first login

### Error Handling
- Duplicate username/email: User skipped with error message
- Missing required fields: Row skipped
- Invalid email format: Rejected by schema validation
- Email send failure: User created but email send noted in response

---

## 🛡️ Security Notes

✅ **Best Practices Implemented:**
- Passwords are automatically hashed (10 salt rounds)
- Initial passwords generated randomly
- Emails sent securely via Nodemailer
- Admin authentication required
- Sandbox SMTP for testing

⚠️ **Production Recommendations:**
1. Use production email service (SendGrid, AWS SES, etc.)
2. Set password change requirement on first login
3. Log all user creation events
4. Implement rate limiting on import endpoints
5. Add audit trail for bulk imports
6. Use environment variables for SMTP credentials

---

## 🔍 Troubleshooting

### Issue: "User role not found"
**Solution:** Create a "user" role in database first

### Issue: Emails not sending
**Solution:**
1. Check Mailtrap credentials in `senMailHandler.js`
2. Verify network connectivity
3. Check Mailtrap inbox for "Delivery Errors"
4. Ensure port 587 is open

### Issue: Excel file not uploading
**Solution:**
1. Ensure file is .xlsx or .xls format
2. Check file permissions
3. Verify /uploads folder exists and is writable

### Issue: Duplicate user error
**Solution:**
1. Check if username/email already exists
2. Use different credentials
3. Check `isDeleted: false` users first

---

## 📝 Example Excel File

Create `users.xlsx` with this content:

| username | email |
|----------|-------|
| john123 | john@company.com |
| jane456 | jane@company.com |
| bob789 | bob@company.com |
| alice999 | alice@company.com |

Save and upload via the import/excel endpoint.

---

## ✨ Features Summary

✅ Bulk import from Excel  
✅ Bulk import from JSON  
✅ Single user creation  
✅ Automatic 16-char password generation  
✅ Welcome emails with credentials  
✅ Automatic password hashing  
✅ Default "user" role assignment  
✅ Duplicate detection  
✅ Error reporting per user  
✅ Mailtrap integration for testing  

---

## 📞 Support

For issues or questions, check:
1. Mailtrap credentials configuration
2. Database connection
3. "user" role exists in database
4. Admin authentication token valid
5. Network/firewall allowing SMTP port 587

---

**Created:** March 27, 2026  
**Last Updated:** March 27, 2026
