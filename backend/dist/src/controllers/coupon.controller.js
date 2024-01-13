"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
// import authSchema from "../validations/auth.validator";
// import { ValidationError } from "joi";
// import { convertJoiErrorToString } from "../common";
class CouponController {
    async createCoupon(req, res) {
        const response = await services_1.default.CouponServices.createCoupon(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateCoupon(req, res) {
        const response = await services_1.default.CouponServices.updateCoupon(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteCoupon(req, res) {
        const response = await services_1.default.CouponServices.deleteCoupon(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCouponByCode(req, res) {
        const response = await services_1.default.CouponServices.getCouponByCode(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllCoupon(req, res) {
        const response = await services_1.default.CouponServices.getAllCoupon(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = CouponController;
