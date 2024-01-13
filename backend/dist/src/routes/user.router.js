"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const multer_1 = require("../middlewares/multer");
const userRouter = (0, express_1.Router)();
// 8. Get me
userRouter.get("/profile", isLogin_1.isLogin, index_1.default.userController.getProfile);
userRouter.get("/all", isLogin_1.isLogin, index_1.default.userController.getAllUsers);
// 9. update profile
userRouter.patch("/update-profile", isLogin_1.isLogin, index_1.default.userController.updateProfile);
// 10. Change Avatar
userRouter.post("/avatar", isLogin_1.isLogin, multer_1.uploadAvatar, index_1.default.userController.changeAvatar); //
userRouter.post("/", isLogin_1.isLogin, index_1.default.userController.createNewUser);
// 11. Get author profile
userRouter.get("/:id", index_1.default.userController.getAuthorProfile);
userRouter.patch("/:id", isLogin_1.isLogin, index_1.default.userController.editUser);
userRouter.delete("/:id", isLogin_1.isLogin, index_1.default.userController.deleteUser);
userRouter.put("/:id", isLogin_1.isLogin, index_1.default.userController.activeUser);
exports.default = userRouter;
