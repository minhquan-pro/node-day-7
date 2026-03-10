const authService = require("@/services/auth.service");
const emailService = require("@/services/email.service");
const queueService = require("@/services/queue.service");

const register = async (req, res) => {
	const { email, password } = req.body;
	const userAgent = req.headers["user-agent"];

	const [error, data] = await authService.handleRegister(email, password, userAgent);
	if (error) {
		res.unauthorized();
		return;
	}
	const { userTokens, user } = data;

	await queueService.push({
		type: "sendVerifyEmail",
		payload: user,
	});

	res.success(userTokens);
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const userAgent = req.headers["user-agent"];
	const [error, data] = await authService.handleLogin(email, password, userAgent);

	if (error) {
		res.unauthorized();
		return;
	}

	res.success(data);
};

const verifyEmail = async (req, res) => {
	const token = req.body.token;
	const [error, data] = await authService.verifyUserEmail(token);
	if (error) return res.unauthorized();

	res.success(data);
};

const resendVerifyEmail = async (req, res) => {
	const user = req.auth.user;
	if (!user) return res.unauthorized();

	await queueService.push({
		type: "sendVerifyEmail",
		payload: user,
	});

	res.success("Email verified successfully");
};

const logout = async (req, res) => {
	const accessToken = req.headers?.authorization?.replace("Bearer", "").trim();

	if (!accessToken) {
		return res.unauthorized();
	}

	await authService.blacklistToken(accessToken);

	res.success({ message: "Logged out successfully" });
};

const refreshToken = async (req, res) => {
	const [error, data] = await authService.handleRefreshToken(req.body.refresh_token, req.headers["user-agent"]);

	if (error) {
		return res.unauthorized();
	}

	res.success(data);
};

const getCurrentUser = (req, res) => {
	res.success(req.auth.user);
};

module.exports = { register, login, verifyEmail, resendVerifyEmail, getCurrentUser, refreshToken, logout };
