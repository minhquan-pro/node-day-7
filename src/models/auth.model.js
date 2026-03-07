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
}

module.exports = new AuthModel();
