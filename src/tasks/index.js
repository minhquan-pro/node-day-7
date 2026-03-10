const fs = require("fs");

const postfix = ".task.js";
const entries = fs.readdirSync(__dirname).filter((filename) => filename.endsWith(postfix));

const tasksMap = entries.reduce((obj, filename) => {
	return {
		...obj,
		[filename.replace(postfix, "")]: require(`./${filename}`),
	};
}, {});

module.exports = tasksMap;
