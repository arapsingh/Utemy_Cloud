"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
class InvoiceController {
    async getAllInvoices(req, res) {
        const response = await services_1.default.InvoiceServices.getAllInvoices(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getNowInvoice(req, res) {
        const response = await services_1.default.InvoiceServices.getNowInvoice(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createInvoice(req, res) {
        try {
            const total = req.body.totalwithcoupon;
            const discount = req.body.discount;
            const coupon_id = req.body.id;
            const max_discount_money = req.body.maxdiscountamount;
            const response = await services_1.default.InvoiceServices.createInvoice(req, total, discount, coupon_id, max_discount_money);
            return res.status(response.getStatusCode()).json(response);
        }
        catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    async getInvoiceById(req, res) {
        const response = await services_1.default.InvoiceServices.getInvoiceById(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = InvoiceController;
