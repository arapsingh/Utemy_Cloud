"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const vnpayRouter = (0, express_1.Router)();
vnpayRouter.post("/", index_1.default.vnpayController.vnpayIpn); //
vnpayRouter.post("/create_payment_url", index_1.default.vnpayController.createPaymentUrl);
exports.default = vnpayRouter;
