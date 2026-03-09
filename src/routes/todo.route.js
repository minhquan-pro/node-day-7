const express = require("express");
const router = express.Router();

const todoController = require("@/controller/todo.controller");
const authRequired = require("@/middlewares/authRequired");

router.use(authRequired);

router.get("/", todoController.getAll);
router.post("/", todoController.create);
router.put("/:id", todoController.update);
router.patch("/:id/toggle", todoController.toggleCompleted);
router.delete("/:id", todoController.remove);

module.exports = router;
