const jwt = require("jsonwebtoken");
const authConfig = require("@/config/auth");
const emailService = require("@/services/email.service");

const sendVerifyEmail = async (payload) => {
	const token = jwt.sign(
		{
			sub: payload.id,
			exp: Date.now() / 1000 + authConfig.accessTokenTTL,
		},
		authConfig.jwtSecret,
	);

	const subject = "Verify your email";
	const text = "Please verify your email address.";
	const html = `<p>Please verify your email by clicking <a href="http://localhost:5173?token=${token}">here</a>.</p>`;

	await emailService.sendVerifyEmail(payload, subject, text, html);
};

module.exports = sendVerifyEmail;
