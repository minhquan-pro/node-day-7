const emailService = require("@/services/email.service");

const sendPasswordChangeEmail = async (payload) => {
	const subject = "Password changed";
	const text = "Your password was changed.";
	const html = "<p>Your password was changed.</p>";
	await emailService.sendVerifyEmail(payload, subject, text, html);
};

module.exports = sendPasswordChangeEmail;
