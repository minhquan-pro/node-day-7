const pool = require("@/config/database");

class TodoModel {
	async findAllByUserId(userId) {
		const [rows] = await pool.query("select * from todos where userId = ? order by created_at desc", [userId]);
		return rows;
	}

	async findById(id, userId) {
		const [rows] = await pool.query("select * from todos where id = ? and userId = ?", [id, userId]);
		return rows[0];
	}

	async create(userId, title) {
		const [rows] = await pool.query("insert into todos (userId, title) values (?, ?)", [userId, title]);
		return rows;
	}

	async update(id, userId, title) {
		const [rows] = await pool.query("update todos set title = ? where id = ? and userId = ?", [title, id, userId]);
		return rows;
	}

	async toggleCompleted(id, userId) {
		const [rows] = await pool.query(
			"update todos set completed = NOT completed where id = ? and userId = ?",
			[id, userId],
		);
		return rows;
	}

	async delete(id, userId) {
		const [rows] = await pool.query("delete from todos where id = ? and userId = ?", [id, userId]);
		return rows;
	}
}

module.exports = new TodoModel();
