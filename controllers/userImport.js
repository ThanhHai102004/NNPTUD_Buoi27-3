// Import Users Controller - handles bulk user creation from Excel/CSV
const userModel = require('../schemas/users');
const roleModel = require('../schemas/roles');
const { generateRandomPassword } = require('../utils/generatePassword');
const { sendPasswordEmail } = require('../utils/senMailHandler');
const ExcelJS = require('exceljs');
const fs = require('fs');

module.exports = {
    /**
     * Import users from Excel file
     * Expected columns: username, email, (password is auto-generated)
     * Assigns default "user" role to all imported users
     */
    importUsersFromExcel: async function (filePath) {
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            console.log("Worksheets:", workbook.worksheets.map(ws => ws.name));
            const worksheet = workbook.getWorksheet(1);

            console.log("Worksheet:", worksheet);
            
            const results = {
                success: [],
                failed: [],
                total: 0
            };
            
             let userRole = await roleModel.findOne({ name: "user", isDeleted: false });
        console.log("UserRole:", userRole);

        if (!userRole) {
            throw new Error("❌ Không tìm thấy role 'user' trong cơ sở dữ liệu");
        }
            
            // Process rows using proper async/await
            const rows = [];
            worksheet.eachRow((row, index) => {
                if (index > 1) { // Skip header row
                    rows.push({ row, index });
                }
            });
            
            for (const { row, index } of rows) {
               // Hàm helper đọc giá trị cell an toàn
const getCellValue = (cell) => {
    const val = cell.value;
    if (val === null || val === undefined) return "";
    if (typeof val === "object" && val.text) return val.text.toString().trim(); // hyperlink
    if (typeof val === "object" && val.result) return val.result.toString().trim(); // formula
    return val.toString().trim();
};

const username = getCellValue(row.getCell(1));
const email = getCellValue(row.getCell(2));
                
                // Validate required fields
                if (!username || !email) {
                    results.failed.push({
                        row: index,
                        username: username || "N/A",
                        email: email || "N/A",
                        error: "❌ Tên đăng nhập hoặc email bị thiếu"
                    });
                    continue;
                }
                
                try {
                    // Check if user already exists
                    const existingUser = await userModel.findOne({
                        $or: [{ username }, { email }]
                    });
                    
                    if (existingUser) {
                        results.failed.push({
                            row: index,
                            username,
                            email,
                            error: "❌ Người dùng đã tồn tại"
                        });
                        continue;
                    }
                    
                    // Generate random 16-character password
                    const password = generateRandomPassword(16);
                    
                    // Create new user
                    const newUser = new userModel({
                        username,
                        email,
                        password, // Will be hashed by schema pre-save middleware
                        fullName: username,
                        role: userRole._id,
                        status: false,
                        loginCount: 0
                    });
                    
                    await newUser.save();
                    
                    // Send welcome email with password
                    try {
                        await sendPasswordEmail(email, username, password);
                        results.success.push({
                            row: index,
                            username,
                            email,
                            password: password,
                            message: "✅ Người dùng được tạo và email đã gửi"
                        });
                    } catch (emailError) {
                        results.success.push({
                            row: index,
                            username,
                            email,
                            password: password,
                            message: "⚠️ Người dùng được tạo nhưng email gửi thất bại: " + emailError.message
                        });
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (error) {
                    results.failed.push({
                        row: index,
                        username,
                        email,
                        error: error.message
                    });
                }
            }
            
            results.total = rows.length;
            return results;
            
        } catch (error) {
            throw new Error("❌ Không thể đọc file Excel: " + error.message);
        }
    },

    /**
     * Import users from JSON array (VIETNAMESE)
     * Format: [{ username: "user1", email: "user1@example.com" }, ...]
     */
    importUsersFromJSON: async function (usersData) {
        try {
            const results = {
                success: [],
                failed: [],
                total: usersData.length
            };
            
            // Get the default "user" role
            let userRole = await roleModel.findOne({ name: "user", isDeleted: false });
            if (!userRole) {
                throw new Error("❌ Không tìm thấy role 'user' trong cơ sở dữ liệu");
            }
            
            for (let index = 0; index < usersData.length; index++) {
                const { username, email } = usersData[index];
                
                // Validate required fields
                if (!username || !email) {
                    results.failed.push({
                        index,
                        username: username || "N/A",
                        email: email || "N/A",
                        error: "❌ Tên đăng nhập hoặc email bị thiếu"
                    });
                    continue;
                }
                
                try {
                    // Check if user already exists
                    const existingUser = await userModel.findOne({
                        $or: [{ username }, { email }]
                    });
                    
                    if (existingUser) {
                        results.failed.push({
                            index,
                            username,
                            email,
                            error: "❌ Người dùng đã tồn tại"
                        });
                        continue;
                    }
                    
                    // Generate random 16-character password
                    const password = generateRandomPassword(16);
                    
                    // Create new user
                    const newUser = new userModel({
                        username,
                        email,
                        password, // Will be hashed by schema pre-save middleware
                        fullName: username,
                        role: userRole._id,
                        status: false,
                        loginCount: 0
                    });
                    
                    await newUser.save();
                    
                    // Send welcome email with password
                    try {
                        await sendPasswordEmail(email, username, password);
                        results.success.push({
                            index,
                            username,
                            email,
                            password: password,
                            message: "✅ Người dùng được tạo và email đã gửi"
                        });
                    } catch (emailError) {
                        results.success.push({
                            index,
                            username,
                            email,
                            password: password,
                            message: "⚠️ Người dùng được tạo nhưng email gửi thất bại: " + emailError.message
                        });
                    }
                    
                } catch (error) {
                    results.failed.push({
                        index,
                        username,
                        email,
                        error: error.message
                    });
                }
            }
            
            return results;
            
        } catch (error) {
            throw new Error("❌ Không thể import người dùng: " + error.message);
        }
    },
    
    /**
     * Create a single user with random password and send email
     */
    createUserWithRandomPassword: async function (username, email) {
        try {
            // Get the default "user" role
            let userRole = await roleModel.findOne({ name: "user", isDeleted: false });
            if (!userRole) {
                throw new Error("User role not found in database");
            }
            
            // Check if user already exists
            const existingUser = await userModel.findOne({
                $or: [{ username }, { email }]
            });
            
            if (existingUser) {
                throw new Error("User already exists");
            }
            
            // Generate random 16-character password
            const password = generateRandomPassword(16);
            
            // Create new user
            const newUser = new userModel({
                username,
                email,
                password,
                fullName: username,
                role: userRole._id,
                status: false,
                loginCount: 0
            });
            
            await newUser.save();
            
            // Send welcome email with password
            await sendPasswordEmail(email, username, password);
            
            return {
                success: true,
                user: newUser,
                message: "User created and password email sent"
            };
            
        } catch (error) {
            throw new Error("Failed to create user: " + error.message);
        }
    }
};
