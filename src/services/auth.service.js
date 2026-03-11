const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authModel = require("@/models/auth.model");
const authConfig = require("@/config/auth");
const randomString = require("@/utils/randomString");
const revokedTokenModel = require("@/models/revokedToken.model");
const saltRounds = 10;

class AuthService {
	async handleRegister(email, password, userAgent) {
		const hash = await bcrypt.hash(password, saltRounds);
		const result = await authModel.register(email, hash);

		const user = await authModel.findUserById(result.insertId);
		const userTokens = await this.generateUserToken(user, userAgent);

		return [null, { userTokens, user }];
	}

	async handleLogin(email, password, userAgent) {
		const user = await authModel.findUserByEmail(email);

		if (!user) {
			return [true, null];
		}

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return [true, null];
		}

		const userTokens = await this.generateUserToken(user, userAgent);
		return [null, userTokens];
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

	async generateRefreshToken(user, userAgent) {
		let token, existed;

		do {
			token = randomString();
			const isExists = await authModel.isTokenExists(token);
			existed = isExists;
		} while (existed);

		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + authConfig.refreshTokenTTL);

		await authModel.refreshToken(token, user, userAgent, expiresAt);

		return token;
	}

	async handleRefreshToken(token, userAgent) {
		const refreshToken = await authModel.handleRefreshToken(token);

		if (!refreshToken) {
			return [true, null];
		}

		const user = { id: refreshToken.userId };
		const userTokens = await this.generateUserToken(user, userAgent);

		await authModel.updatedRefreshToken(refreshToken);

		return [null, userTokens];
	}

	async generateUserToken(user, userAgent) {
		const accessToken = await this.generateAccessToken(user);
		const refreshToken = await this.generateRefreshToken(user, userAgent);
		const accessTokenTtl = Math.floor(Date.now() / 1000 + authConfig.accessTokenTTL);

		return {
			accessToken,
			refreshToken,
			accessTokenTtl,
		};
	}

	async getUserById(id) {
		const user = await authModel.findUserById(id);
		return user;
	}

	async verifyUserEmail(token) {
		const payload = jwt.verify(token, authConfig.jwtSecret);

		if (payload.exp < Date.now() / 1000) {
			return [false, "Token has expired"];
		}
		const userId = payload.sub;
		const user = await authModel.findUserById(userId);

		// Check if user exists
		if (!user) {
			return [true, null];
		}

		if (user.verified_at) {
			return [null, "Email already verified"];
		}

		await authModel.verifyUserEmail(userId);

		return [null, "Email verified successfully"];
	}

	async handleChangePassword(changePassData, user) {
		const { currentPassword, newPassword, confirmPassword } = changePassData;

		const userPassword = await authModel.getUserPasswordById(user.id);

		const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userPassword);

		if (!isCurrentPasswordValid) {
			return [{ message: "Current password is incorrect" }, null];
		}

		if (newPassword !== confirmPassword) {
			return [{ message: "Passwords do not match" }, null];
		}

		const hashNewPass = await bcrypt.hash(newPassword, saltRounds);

		const affected = await authModel.updatedUserPassword(user.id, hashNewPass);
		if (!affected) return [{ message: "Update failed" }, null];

		return [null, { message: "Password changed successfully" }];
	}

	async blacklistToken(token) {
		const decoded = jwt.decode(token);
		const expiresAt = new Date(decoded.exp * 1000);

		const result = await revokedTokenModel.addTokenToBlacklist(token, expiresAt);
		return result;
	}

	async checkTokenBlacklisted(accessToken) {
		const isTokenRevoked = await revokedTokenModel.isTokenRevoked(accessToken);
		return isTokenRevoked;
	}
}

module.exports = new AuthService();
