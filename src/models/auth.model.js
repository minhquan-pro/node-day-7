const pool = require("@/config/database");

class AuthModel {
	async register(email, password) {
		const query = "insert into users (email, password) values (?, ?)";
		const [rows] = await pool.query(query, [email, password]);
		return rows;
	}

	async findUserByEmail(email) {
		const query = "select * from users where email = ?";
		const [rows] = await pool.query(query, [email]);
		return rows[0];
	}

	async findUserById(id) {
		const query = "select id, email, verified_at, created_at from users where id = ?";
		const [rows] = await pool.query(query, [id]);
		return rows[0];
	}

	async isTokenExists(token) {
		const [rows] = await pool.query("select count(*) as count from refresh_token where token = ?", [token]);
		return rows[0].count > 0;
	}

	async refreshToken(token, user, userAgent, expiresAt) {
		const [rows] = await pool.query(
			"insert into refresh_token (token, userId, userAgent, expires_at) values (?, ?, ?, ?)",
			[token, user.id, userAgent, expiresAt],
		);
		return rows;
	}

	async handleRefreshToken(token) {
		const [rows] = await pool.query(
			"select * from refresh_token where token = ? and isRevoked = 0 and expires_at > now()",
			[token],
		);
		return rows[0];
	}

	async updatedUserPassword(id, password) {
		const [{ affectedRows }] = await pool.query("update users set password = ? where id = ?", [password, id]);
		return affectedRows;
	}

	async updatedRefreshToken(refreshToken) {
		const [rows] = await pool.query("update refresh_token set isRevoked = 1 where id = ?", [refreshToken.id]);
		return rows;
	}

	async verifyUserEmail(userId) {
		const [rows] = await pool.query("update users set verified_at = NOW() where id = ?", [userId]);
		return rows;
	}

	async getUserPasswordById(id) {
		const query = "select password from users where id = ?";
		const [rows] = await pool.query(query, [id]);
		return rows[0].password;
	}
}

module.exports = new AuthModel();
