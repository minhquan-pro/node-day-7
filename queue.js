require("module-alias/register");
require("dotenv").config();

const queueModel = require("@/models/queue.model");
const emailService = require("@/services/email.service");
const tasksMap = require("@/tasks");
const sleep = require("@/utils/sleep");

(async () => {
	while (true) {
		const pendingJob = await queueModel.findOne();

		if (pendingJob) {
			const type = pendingJob.type;
			const payload = JSON.parse(pendingJob.payload);

			if (type) {
				try {
					await queueModel.updateStatus(pendingJob.id, "inprogress");

					const handler = tasksMap[type];
					if (!handler) {
						throw new Error("Handler for task type '" + type + "' not found");
					}

					await handler(payload);
					await queueModel.updateStatus(pendingJob.id, "completed");
				} catch (error) {
					await queueModel.updateStatus(pendingJob.id, "failed");
				}
			}

			// switch (type) {
			// 	case "sendVerifyEmail":
			// 		try {
			// 			await queueModel.updateStatus(pendingJob.id, "inprogress");

			// 			const handler = tasksMap[type];
			// 			if (!handler) {
			// 				throw new Error("Handler for task type '" + type + "' not found");
			// 			}

			// 			await handler(payload);
			// 			await queueModel.updateStatus(pendingJob.id, "completed");
			// 		} catch (error) {
			// 			await queueModel.updateStatus(pendingJob.id, "failed");
			// 		}
			// }
		}

		await sleep(1000);
	}
})();
