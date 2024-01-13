"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const invoiceRouter = (0, express_1.Router)();
invoiceRouter.post("/", isLogin_1.isLogin, index_1.default.invoiceController.createInvoice); //
invoiceRouter.get("/all", isLogin_1.isLogin, index_1.default.invoiceController.getAllInvoices); //
invoiceRouter.get("/", isLogin_1.isLogin, index_1.default.invoiceController.getNowInvoice); //
invoiceRouter.get("/:invoice_id", isLogin_1.isLogin, index_1.default.invoiceController.getInvoiceById); //
exports.default = invoiceRouter;
