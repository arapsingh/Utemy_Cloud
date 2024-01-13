"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const cartRouter = (0, express_1.Router)();
cartRouter.post("/", isLogin_1.isLogin, index_1.default.cartController.addCourseToCart);
cartRouter.patch("/:cart_detail_id", isLogin_1.isLogin, index_1.default.cartController.changeSaveForLater);
cartRouter.delete("/:cart_detail_id", isLogin_1.isLogin, index_1.default.cartController.removeCourseFromCart);
cartRouter.get("/", isLogin_1.isLogin, index_1.default.cartController.getAllCart);
exports.default = cartRouter;
