require("dotenv").config();
require("module-alias/register");
require("@/config/database");

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const rootRoute = require("@/routes");
const responseFormat = require("@/middlewares/responseFormat");
const notFound = require("@/middlewares/notFound");
const errorHandler = require("@/middlewares/errorHandle");

app.use(cors());
app.use(express.json());
app.use(responseFormat);

app.use("/api", rootRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
