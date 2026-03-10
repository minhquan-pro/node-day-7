const jwt = require("jsonwebtoken");
const transporter = require("@/config/nodeMailer");
const authConfig = require("@/config/auth");

class EmailService {
	async sendVerifyEmail(user) {
		const token = jwt.sign(
			{
				sub: user.id,
				exp: Date.now() / 1000 + authConfig.accessTokenTTL,
			},
			authConfig.jwtSecret,
		);

		const info = await transporter.sendMail({
			from: '"" <hackall2939@gmail.com>',
			to: user.email,
			subject: "Security Alert: Account Attack Detected",
			text: "Your account has been targeted by a suspicious activity. Please review your account security immediately.",
			html: `
				<div style="font-family: Arial, sans-serif; background: #fff3cd; padding: 32px; border-radius: 8px; max-width: 400px; margin: auto; border: 1px solid #ffeeba;">
					<h2 style="color: #856404;">Security Alert!</h2>
					<p style="font-size: 16px; color: #856404;">We have detected suspicious activity on your account.</p>
					<p style="font-size: 16px; color: #856404;">Please <b>review your account security</b> and change your password immediately.</p>
					<a href="http://localhost:5173?token=${token}" style="display: inline-block; padding: 12px 24px; background: #dc3545; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold;">Secure Account</a>
					<p style="margin-top: 24px; font-size: 12px; color: #856404;">If you did not initiate this activity, please contact support.</p>
				</div>
			`,
		});
		return info;
	}
}

module.exports = new EmailService();
