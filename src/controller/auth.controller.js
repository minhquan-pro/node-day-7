const authService = require("@/services/auth.service");
const emailService = require("@/services/email.service");

const register = async (req, res) => {
	const { email, password } = req.body;
	const userAgent = req.headers["user-agent"];

	const [error, data] = await authService.handleRegister(email, password, userAgent);
	if (error) {
		res.unauthorized();
		return;
	}

	const accessToken = data.accessToken;
	await emailService.sendVerifyEmail(email, accessToken);

	res.success(data);
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

module.exports = { register, login, getCurrentUser, refreshToken, logout };
