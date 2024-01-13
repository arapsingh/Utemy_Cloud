"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const authRouter = (0, express_1.Router)();
authRouter.post("/mail/verify", index_1.default.authController.resendVerifyEmail);
authRouter.post("/mail/forgot", index_1.default.authController.resendForgotPasswordEmail);
authRouter.post("/login", index_1.default.authController.login); //
authRouter.post("/signup", index_1.default.authController.signup); //
authRouter.get("/refresh", index_1.default.authController.refreshAccesToken); //
authRouter.get("/verify/:token", index_1.default.authController.verifyEmail); //
authRouter.post("/forgot-password", index_1.default.authController.forgotPassword); //
authRouter.patch("/reset-password", index_1.default.authController.resetPassword); //
authRouter.patch("/password", isLogin_1.isLogin, index_1.default.authController.changePassword); //
authRouter.get("/me", isLogin_1.isLogin, index_1.default.authController.getMe); //
exports.default = authRouter;
