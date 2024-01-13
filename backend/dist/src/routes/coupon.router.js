"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const couponRouter = (0, express_1.Router)();
couponRouter.get("/", isLogin_1.isLogin, index_1.default.couponController.getAllCoupon);
couponRouter.post("/", isLogin_1.isLogin, index_1.default.couponController.createCoupon);
couponRouter.patch("/:coupon_id", isLogin_1.isLogin, index_1.default.couponController.updateCoupon);
couponRouter.delete("/:coupon_id", isLogin_1.isLogin, index_1.default.couponController.deleteCoupon);
couponRouter.get("/:code", isLogin_1.isLogin, index_1.default.couponController.getCouponByCode);
exports.default = couponRouter;
