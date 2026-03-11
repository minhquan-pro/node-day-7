const transporter = require("@/config/nodeMailer");

class EmailService {
	async sendVerifyEmail(user, subject, text, html) {
		const info = await transporter.sendMail({
			from: '"" <hackall2939@gmail.com>',
			to: user.email,
			subject,
			text,
			html,
		});
		return info;
	}
}

module.exports = new EmailService();
