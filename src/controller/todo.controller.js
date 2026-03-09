const todoService = require("@/services/todo.service");
const { httpCodes } = require("@/config/constants");

const getAll = async (req, res) => {
	const userId = req.auth.user.id;
	const todos = await todoService.getAll(userId);
	res.success(todos);
};

const create = async (req, res) => {
	const userId = req.auth.user.id;
	const { title } = req.body;

	if (!title) {
		return res.error("Title is required", httpCodes.badRequest);
	}

	const todo = await todoService.create(userId, title);
	res.success(todo, httpCodes.created);
};

const update = async (req, res) => {
	const userId = req.auth.user.id;
	const { id } = req.params;
	const { title } = req.body;

	if (!title) {
		return res.error("Title is required", httpCodes.badRequest);
	}

	const [error, todo] = await todoService.update(+id, userId, title);
	if (error) return res.notFound();

	res.success(todo);
};

const toggleCompleted = async (req, res) => {
	const userId = req.auth.user.id;
	const { id } = req.params;

	const [error, todo] = await todoService.toggleCompleted(+id, userId);
	if (error) return res.notFound();

	res.success(todo);
};

const remove = async (req, res) => {
	const userId = req.auth.user.id;
	const { id } = req.params;

	const deleted = await todoService.delete(+id, userId);
	if (!deleted) return res.notFound();

	res.success({ message: "Todo deleted successfully" });
};

module.exports = { getAll, create, update, toggleCompleted, remove };
