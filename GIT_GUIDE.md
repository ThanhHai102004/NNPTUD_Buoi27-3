# 🔧 Git Commands & Version Control Guide

## 📝 Summary of Changes

This guide shows all changes made to implement user import with random passwords and Mailtrap integration.

---

## 🎯 Files Created (New)

```
✨ utils/generatePassword.js
✨ controllers/userImport.js
✨ routes/import.js
✨ USER_IMPORT_GUIDE.md
✨ QUICK_START.md
✨ postman_collection.json
✨ SAMPLE_DATA.md
✨ GIT_GUIDE.md (this file)
```

## ✏️ Files Modified

```
📝 utils/senMailHandler.js
📝 app.js
```

---

## 🚀 Git Commands

### Step 1: Check Current Status
```bash
git status
```

**Output should show:**
- Untracked files (new files)
- Modified files (app.js, senMailHandler.js)

---

### Step 2: View Changes in Modified Files

#### View app.js changes:
```bash
git diff app.js
```

**You should see:**
```diff
+ app.use('/api/v1/users/import', require('./routes/import'))
```

#### View senMailHandler.js changes:
```bash
git diff utils/senMailHandler.js
```

**You should see:**
```diff
- port: 25,
+ port: 587,

+ sendPasswordEmail: async function(...) { ... }
```

---

### Step 3: Stage Files for Commit

Add all changes:
```bash
git add .
```

Or add specific files:
```bash
# Add modified files
git add app.js utils/senMailHandler.js

# Add new files
git add utils/generatePassword.js
git add controllers/userImport.js
git add routes/import.js
git add USER_IMPORT_GUIDE.md QUICK_START.md postman_collection.json SAMPLE_DATA.md GIT_GUIDE.md
```

---

### Step 4: View Staged Changes
```bash
git status

# Or view specific file
git diff --staged app.js
```

---

### Step 5: Commit Changes

```bash
git commit -m "feat: add user import with random password and Mailtrap email integration"
```

Or more detailed:
```bash
git commit -m "feat: add user import with random password and Mailtrap email integration

- Add generatePassword.js utility for 16-char random passwords
- Add userImport controller for bulk user creation from Excel/JSON
- Add import routes (single, json, excel endpoints)
- Update senMailHandler with password email template
- Add comprehensive documentation and guides
- Requires admin role for all import operations
- Automatically sends welcome emails with credentials"
```

---

### Step 6: View Commit Log
```bash
git log --oneline -5
```

---

### Step 7: Push to Remote Repository
```bash
git push origin main
# or
git push origin master
```

---

## 📋 Detailed File Changes

### File 1: app.js
**Change:** Added import route
```javascript
// ADDED LINE:
app.use('/api/v1/users/import', require('./routes/import'))

// Location: After line with '/api/v1/upload'
```

### File 2: utils/senMailHandler.js
**Changes:**
1. Port changed from 25 to 587
2. Added new function `sendPasswordEmail`
3. Updated existing `sendMail` function documentation

---

## 🔄 If You Need to Undo

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Remove Changes)
```bash
git reset --hard HEAD~1
```

### Unstage a File
```bash
git reset HEAD filename.js
```

### Discard Changes in a File
```bash
git checkout -- filename.js
```

---

## 📊 View All Changes

### See All Commits
```bash
git log --stat
```

### See Detailed Diff
```bash
git diff HEAD~1 HEAD
```

### See Changes for Specific File
```bash
git log -p -- filename.js
```

---

## 🌿 Working with Branches

### Create Feature Branch (Recommended)
```bash
git branch feature/user-import
git checkout feature/user-import
# or:
git checkout -b feature/user-import
```

### Make Commits on Branch
```bash
git add .
git commit -m "feat: add user import functionality"
```

### Push Branch
```bash
git push origin feature/user-import
```

### Create Pull Request
On GitHub/GitLab:
1. Go to repository
2. Click "New Pull Request"
3. Compare: `main` ← `feature/user-import`
4. Add description based on changes
5. Request review
6. Merge after approval

### Delete Branch After Merge
```bash
git branch -d feature/user-import
git push origin --delete feature/user-import
```

---

## 📝 Commit Message Template

### Good Commit Messages

✅ **Conventional Commits Format:**
```
feat: add user import with random password
fix: correct email template rendering
docs: update user import guide
refactor: reorganize import controller
test: add user import tests
```

✅ **Detailed Message:**
```
feat: implement bulk user import with random passwords

- Add password generation utility (16-char random strings)
- Create user import controller for Excel/JSON files
- Add three import endpoints: single/json/excel
- Integrate Mailtrap for test email notifications
- Include comprehensive documentation

Closes #123
```

❌ **Bad Messages:**
```
update
fixed stuff
work in progress
```

---

## 🔍 Code Review Checklist

Before submitting PR, verify:

- [ ] All files created successfully
- [ ] No syntax errors in new files
- [ ] app.js properly imports the route
- [ ] sendMailHandler has both functions
- [ ] package.json already has required dependencies
- [ ] MongoDB user role created
- [ ] Mailtrap credentials configured (in local env only)
- [ ] All endpoints require admin authentication
- [ ] Error handling implemented
- [ ] Documentation complete

---

## 🚨 Important: Credentials NOT in Git

### Never Commit:
```javascript
// ❌ DON'T DO THIS:
auth: {
    user: "actual_mailtrap_username",
    pass: "actual_mailtrap_password",
}
```

### Instead Use Environment Variables:
```javascript
// ✅ DO THIS:
auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
}
```

### Create .env File
```
MAILTRAP_USER=your_username
MAILTRAP_PASS=your_password
```

### Add to .gitignore
```
.env
.env.local
.env.*.local
```

### In app.js or utils:
```javascript
require('dotenv').config();
// Then use process.env.MAILTRAP_USER
```

---

## 📤 Deploy to Production

### Before Deploying:

1. **Set Environment Variables on Server:**
   ```bash
   export MAILTRAP_USER=your_prod_username
   export MAILTRAP_PASS=your_prod_password
   ```

2. **Or Create .env file:**
   ```
   MAILTRAP_USER=production_username
   MAILTRAP_PASS=production_password
   ```

3. **Pull Latest Code:**
   ```bash
   git pull origin main
   npm install
   ```

4. **Restart Application:**
   ```bash
   npm start
   ```

---

## 🔗 GitHub Integration

### Link Remote Repository
```bash
# If not already set
git remote add origin https://github.com/username/repo.git

# Verify
git remote -v
```

### First Push
```bash
git branch -M main
git push -u origin main
```

### Subsequent Pushes
```bash
git push
```

---

## 📊 Git Statistics

After commit:
```bash
# Lines of code added
git diff HEAD~1 HEAD --stat

# Contributors
git log --oneline | wc -l

# File contributions
git log --format="%H" -n 1 | xargs -I {} git show {} --stat
```

---

## 🆘 Troubleshooting

### Issue: "fatal: not a git repository"
**Solution:**
```bash
# Initialize git if needed
git init
git remote add origin https://github.com/username/repo.git
```

### Issue: Merge Conflicts
**Solution:**
```bash
# Check conflicting files
git status

# Edit files manually to resolve conflicts
# Then:
git add resolved_file.js
git commit -m "resolve: merge conflicts"
```

### Issue: Want to Undo All Local Changes
```bash
git reset --hard HEAD
```

---

## 📚 Additional Resources

- Git Documentation: https://git-scm.com/doc
- GitHub Help: https://docs.github.com
- Conventional Commits: https://www.conventionalcommits.org
- .gitignore Generator: https://gitignore.io

---

**Created:** March 27, 2026  
**Framework:** Express.js + MongoDB  
**Email Service:** Mailtrap (Testing)  

---

## 📋 Quick Reference

```bash
# Daily workflow
git status                                    # Check status
git add .                                     # Stage all
git commit -m "meaningful message"            # Commit
git push                                      # Push
git pull                                      # Pull latest

# Review
git log --oneline -10                         # Last 10 commits
git diff HEAD~1 HEAD                          # Last commit changes
git show commit_hash                          # Show specific commit

# Branch work
git checkout -b feature/name                  # New branch
git checkout main                             # Switch branch
git merge feature/name                        # Merge branch
```

---

**Status:** ✅ Ready for Version Control!
