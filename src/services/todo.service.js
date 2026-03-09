const todoModel = require("@/models/todo.model");

class TodoService {
	async getAll(userId) {
		const todos = await todoModel.findAllByUserId(userId);
		return todos;
	}

	async create(userId, title) {
		const result = await todoModel.create(userId, title);
		const todo = await todoModel.findById(result.insertId, userId);
		return todo;
	}

	async update(id, userId, title) {
		const todo = await todoModel.findById(id, userId);
		if (!todo) return [true, null];

		await todoModel.update(id, userId, title);
		const updated = await todoModel.findById(id, userId);
		return [null, updated];
	}

	async toggleCompleted(id, userId) {
		const todo = await todoModel.findById(id, userId);
		if (!todo) return [true, null];

		await todoModel.toggleCompleted(id, userId);
		const updated = await todoModel.findById(id, userId);
		return [null, updated];
	}

	async delete(id, userId) {
		const todo = await todoModel.findById(id, userId);
		if (!todo) return false;

		await todoModel.delete(id, userId);
		return true;
	}
}

module.exports = new TodoService();
