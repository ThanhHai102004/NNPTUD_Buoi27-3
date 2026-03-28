// Import routes for bulk user creation
var express = require("express");
var router = express.Router();
var multer = require("multer");
var path = require("path");

let { checkLogin, CheckPermission } = require('../utils/authHandler');
let userImportController = require("../controllers/userImport");

// Configure multer for Excel uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'import-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    //fileFilter: (req, file, cb) => {
        // Only allow Excel files
       // const allowedMimes = [
         //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
           // 'application/vnd.ms-excel'
       // ];
       // if (allowedMimes.includes(file.mimetype)) {
       //     cb(null, true);
       // } else {
       //     cb(new Error('Only Excel files are allowed'));
       // }
   // }
});

/**
 * POST /import/excel
 * Import users from Excel file
 * Expected columns: username, email
 * Requires admin authentication
 * 
 * Example:
 * curl -F "file=@users.xlsx" http://localhost:3000/api/v1/users/import/excel
 */
router.post("/excel", checkLogin, CheckPermission("ADMIN"), upload.single('file'), 
    async function (req, res) {
        try {
            console.log("req.file:", req.file);
            console.log("req.body:", req.body);
            if (!req.file) {
                return res.status(400).send({ message: "No file uploaded" });
            }

            const filePath = req.file.path;
            const results = await userImportController.importUsersFromExcel(filePath);

            // Delete the uploaded file after processing
            const fs = require('fs');
            fs.unlinkSync(filePath);

            res.send({
                message: "Import completed",
                results: results,
                summary: {
                    total: results.total,
                    successful: results.success.length,
                    failed: results.failed.length
                }
            });

        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    }
);

/**
 * POST /import/json
 * Import users from JSON array
 * Requires admin authentication
 * 
 * Example JSON body:
 * {
 *   "users": [
 *     { "username": "john_doe", "email": "john@example.com" },
 *     { "username": "jane_doe", "email": "jane@example.com" }
 *   ]
 * }
 */
router.post("/json", checkLogin, CheckPermission("ADMIN"), 
    async function (req, res) {
        try {
            const { users } = req.body;
            
            if (!users || !Array.isArray(users)) {
                return res.status(400).send({ 
                    message: "Invalid format. Expected 'users' array in request body" 
                });
            }

            const results = await userImportController.importUsersFromJSON(users);

            res.send({
                message: "Import completed",
                results: results,
                summary: {
                    total: results.total,
                    successful: results.success.length,
                    failed: results.failed.length
                }
            });

        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    }
);

/**
 * POST /import/single
 * Create a single user with random password and send welcome email
 * Requires admin authentication
 * 
 * Example JSON body:
 * {
 *   "username": "john_doe",
 *   "email": "john@example.com"
 * }
 */
router.post("/single", checkLogin, CheckPermission("ADMIN"), 
    async function (req, res) {
        try {
            const { username, email } = req.body;
            
            if (!username || !email) {
                return res.status(400).send({ 
                    message: "Username and email are required" 
                });
            }

            const result = await userImportController.createUserWithRandomPassword(username, email);
            
            res.send({
                message: result.message,
                user: {
                    _id: result.user._id,
                    username: result.user.username,
                    email: result.user.email
                }
            });

        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    }
);

module.exports = router;
