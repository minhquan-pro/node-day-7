const express = require("express");
const router = express.Router();

const authController = require("@/controller/auth.controller");
const authRequired = require("@/middlewares/authRequired");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authRequired, authController.logout);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verify-email", authRequired, authController.resendVerifyEmail);
router.post("/change-password", authRequired, authController.changePassword);

router.get("/me", authRequired, authController.getCurrentUser);

module.exports = router;
