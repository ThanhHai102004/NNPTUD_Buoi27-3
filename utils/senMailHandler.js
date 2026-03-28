const nodemailer = require("nodemailer");

// Create a transporter using Mailtrap sandbox
// Replace with your actual Mailtrap credentials from https://mailtrap.io
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: "a7c600c4aaade1", // Your Mailtrap username - get from Mailtrap dashboard
        pass: "68b6467356cb95", // Your Mailtrap password - get from Mailtrap dashboard
    },
});

// Send reset password email
module.exports = {
    sendMail: async function (to, url) {
        const info = await transporter.sendMail({
            from: 'admin@hehehe.com',
            to: to,
            subject: "Reset Password",
            text: "Click here to reset your password",
            html: `<h2>Password Reset</h2>
                   <p>Click the link below to reset your password:</p>
                   <a href="${url}">Reset Password</a>`,
        });
        return info;
    },
    
    // New function: Send password for imported users (VIETNAMESE)
    sendPasswordEmail: async function (to, username, password, loginUrl = "http://localhost:3000/login") {
        try {
            const info = await transporter.sendMail({
                from: 'admin@hehehe.com',
                to: to,
                subject: "Chào mừng - Tài khoản của bạn đã được tạo",
                text: `Tài khoản của bạn đã được tạo. Tên đăng nhập: ${username}, Mật khẩu: ${password}`,
                html: `
                    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Chào mừng bạn!</h1>
                        </div>
                        
                        <div style="padding: 30px; background-color: white;">
                            <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
                                Kính gửi <strong>${username}</strong>,
                            </p>
                            
                            <p style="color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                                Tài khoản của bạn đã được tạo thành công trong hệ thống. Dưới đây là thông tin đăng nhập của bạn:
                            </p>
                            
                            <div style="background-color: #f0f4ff; padding: 20px; border-left: 4px solid #667eea; border-radius: 4px; margin: 25px 0;">
                                <p style="margin: 10px 0;">
                                    <strong style="color: #333; display: inline-block; width: 120px;">📧 Tên đăng nhập:</strong>
                                    <span style="color: #667eea; font-weight: bold;">${username}</span>
                                </p>
                                <p style="margin: 10px 0;">
                                    <strong style="color: #333; display: inline-block; width: 120px;">🔐 Mật khẩu:</strong>
                                    <span style="color: #667eea; font-family: 'Courier New', monospace; font-weight: bold; background: white; padding: 5px 10px; border-radius: 3px;">${password}</span>
                                </p>
                            </div>
                            
                            <div style="background-color: #fff3cd; padding: 15px; border-radius: 4px; margin: 25px 0; border-left: 4px solid #ffc107;">
                                <p style="color: #856404; margin: 0; font-weight: bold;">
                                    ⚠️ Lưu ý quan trọng
                                </p>
                                <p style="color: #856404; margin: 10px 0 0 0; font-size: 14px;">
                                    Vui lòng <strong>thay đổi mật khẩu ngay sau lần đăng nhập đầu tiên</strong> để bảo mật tài khoản của bạn.
                                </p>
                            </div>
                            
                            <p style="text-align: center; margin-top: 30px;">
                                <a href="${loginUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
                                    🔑 Đăng nhập vào tài khoản
                                </a>
                            </p>
                        </div>
                        
                        <div style="padding: 20px; background-color: #f0f0f0; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #999;">
                            <p style="margin: 0;">
                                📞 Nếu có thắc mắc, vui lòng liên hệ bộ phận hỗ trợ
                            </p>
                            <p style="margin: 5px 0 0 0;">
                                Đây là email tự động. Vui lòng không trả lời email này.
                            </p>
                        </div>
                    </div>
                `,
            });
            console.log(`✅ Email sent successfully to ${to}`);
            return info;
        } catch (error) {
            console.error("❌ Error sending email to " + to + ":", error);
            throw error;
        }
    }
}