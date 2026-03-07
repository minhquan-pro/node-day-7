const authService = require("@/services/auth.service");

const register = async (req, res) => {
	const { email, password } = req.body;
	const result = await authService.handleRegister(email, password);
	res.success(result);
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const [error, data] = await authService.handleLogin(email, password);

	if (error) {
		res.error(error);
		return;
	}

	res.success(data);
};

module.exports = { register, login };
