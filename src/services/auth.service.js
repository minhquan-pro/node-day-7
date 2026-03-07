const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authModel = require("@/models/auth.model");
const authConfig = require("@/config/auth");
const saltRounds = 10;

class AuthService {
	async handleRegister(email, password) {
		const hash = await bcrypt.hash(password, saltRounds);
		const result = await authModel.register(email, hash);

		const user = { id: result.insertId };

		const accessToken = await this.generateAccessToken(user);
		const accessTokenTtl = Math.floor(Date.now() / 1000 + authConfig.accessTokenTTL);

		return { accessToken, accessTokenTtl };
	}

	async handleLogin(email, password) {
		const user = await authModel.findUserByEmail(email);
		if (!user) {
			return [true, null];
		}

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return [true, null];
		}

		const accessToken = await this.generateAccessToken(user);
		const accessTokenTtl = Math.floor(Date.now() / 1000 + authConfig.accessTokenTTL);

		return [null, { accessToken, accessTokenTtl }];
	}

	async generateAccessToken(user) {
		const expireAt = Math.floor(Date.now() / 1000 + authConfig.accessTokenTTL);
		const token = jwt.sign(
			{
				sub: user.id,
				exp: expireAt,
			},
			authConfig.jwtSecret,
		);

		return token;
	}
}

module.exports = new AuthService();
