/**
 * Tạo file Excel sample để test import users
 * Chạy: node create-sample-users.js
 */

const ExcelJS = require('exceljs');
const path = require('path');

async function createSampleFile() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');
    
    // Add header row
    worksheet.columns = [
        { header: 'username', key: 'username', width: 20 },
        { header: 'email', key: 'email', width: 30 }
    ];
    
    // Style header row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    
    // Add sample data
    const sampleUsers = [
        { username: 'nguyen_van_a', email: 'nguyenvana@example.com' },
        { username: 'tran_thi_b', email: 'tranthib@example.com' },
        { username: 'le_van_c', email: 'levanc@example.com' },
        { username: 'hoang_thi_d', email: 'hoangthid@example.com' },
        { username: 'pham_van_e', email: 'phamvane@example.com' },
    ];
    
    sampleUsers.forEach(user => {
        worksheet.addRow(user);
    });
    
    // Add borders to all cells
    worksheet.eachRow({ withValues: true }, (row) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
    });
    
    const filePath = path.join(__dirname, 'uploads', 'sample-users.xlsx');
    
    try {
        await workbook.xlsx.writeFile(filePath);
        console.log('✅ Tạo file sample thành công: ' + filePath);
        console.log('📊 File chứa ' + sampleUsers.length + ' người dùng mẫu');
        console.log('\n📋 Danh sách người dùng:');
        sampleUsers.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.username} (${user.email})`);
        });
    } catch (error) {
        console.error('❌ Lỗi tạo file:', error.message);
    }
}

createSampleFile();
