/**
 * Script để test import user từ MailTrap
 * Cần setting up MailTrap credentials trước
 */

// Test với MailTrap
const users = [
    {
        username: 'tester_01',
        email: 'tester+01@example.com'
    },
    {
        username: 'tester_02', 
        email: 'tester+02@example.com'
    }
];

console.log('🧪 Test Import Users\n');
console.log('📋 Danh sách users để import:');
users.forEach((user, i) => {
    console.log(`${i + 1}. ${user.username} - ${user.email}`);
});

console.log('\n📧 Email sẽ được gửi đến các địa chỉ trên');
console.log('🔑 Mật khẩu sẽ được generate ngẫu nhiên (16 ký tự)');
console.log('\n✅ Để test:');
console.log('1. Setup MailTrap credentials trong utils/senMailHandler.js');
console.log('2. Chạy: npm start');
console.log('3. Import file Excel hoặc JSON');
console.log('4. Kiểm tra MailTrap inbox');

// Cấu trúc JSON để test
const jsonTestData = {
    "users": users
};

console.log('\n💡 JSON body cho test:');
console.log(JSON.stringify(jsonTestData, null, 2));
