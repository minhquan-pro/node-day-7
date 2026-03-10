const emailService = require("@/services/email.service");

const sendVerifyEmail = async (payload) => {
	await emailService.sendVerifyEmail(payload);
};

module.exports = sendVerifyEmail;
