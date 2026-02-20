const nodemailer = require('nodemailer');

const sendAlert = async (subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: subject,
            text: message
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email] Alert sent: ${info.response}`);
    } catch (error) {
        console.error(`[Email Error] Failed to send email: ${error.message}`);
        // Never crash app if email fails
    }
};

module.exports = { sendAlert };
