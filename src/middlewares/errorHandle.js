const isProduction = require("@/utils/isProduction");

const errorHandle = (err, req, res, _) => {
	if (isProduction()) {
		res.error("Server error.");
		return;
	}

	if (err.message.includes("Duplicate")) {
		res.error("Email already registered", 409);
		return;
	}

	res.error(err ?? "Server Error");
};

module.exports = errorHandle;
