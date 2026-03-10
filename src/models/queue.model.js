const pool = require("@/config/database");

class QueueModel {
	async findOne() {
		const [rows] = await pool.query("select * from queues where status = 'pending'");
		return rows[0];
	}

	async create(type, payload) {
		const [{ insertId }] = await pool.query("insert into queues (type, payload) values (?, ?)", [type, payload]);

		return insertId;
	}

	async updateStatus(id, status) {
		const [{ affectedRows }] = await pool.query("update queues set status = ? where id = ?", [status, id]);
		return affectedRows;
	}
}

module.exports = new QueueModel();
