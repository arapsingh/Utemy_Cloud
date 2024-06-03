"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
// import authSchema from "../validations/auth.validator";
// import { ValidationError } from "joi";
// import { convertJoiErrorToString } from "../common";
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
class CouponController {
    async createCoupon(req, res) {
        return new Promise((resolve, reject) => {
            try {
                // Dùng middleware multer để xử lý FormData
                upload.none()(req, res, async (err) => {
                    if (err) {
                        console.error("Error occurred while parsing FormData:", err);
                        return res.status(400).json({ error: "Bad Request" });
                    }
                    const formData = req.body;
                    const response = await services_1.default.CouponServices.createCoupon(req, formData);
                    // Gửi phản hồi thành công sau khi xử lý FormData
                    return res.status(response.getStatusCode()).json(response);
                });
            }
            catch (error) {
                // Xử lý lỗi nếu có
                console.error("An error occurred while creating coupon:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    async updateCoupon(req, res) {
        return new Promise((resolve, reject) => {
            try {
                // Dùng middleware multer để xử lý FormData
                upload.none()(req, res, async (err) => {
                    if (err) {
                        console.error("Error occurred while parsing FormData:", err);
                        return res.status(400).json({ error: "Bad Request" });
                    }
                    const formData = req.body;
                    const response = await services_1.default.CouponServices.updateCoupon(req, formData);
                    // Gửi phản hồi thành công sau khi xử lý FormData
                    return res.status(response.getStatusCode()).json(response);
                });
            }
            catch (error) {
                // Xử lý lỗi nếu có
                console.error("An error occurred while creating coupon:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    async deleteCoupon(req, res) {
        const response = await services_1.default.CouponServices.deleteCoupon(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCouponByCode(req, res) {
        const response = await services_1.default.CouponServices.getCouponByCode(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCouponsWithPagination(req, res) {
        const response = await services_1.default.CouponServices.GetCouponsWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCouponHistoryByUserId(req, res) {
        const response = await services_1.default.CouponServices.getCouponHistoryByUserId(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllCouponHistory(req, res) {
        const response = await services_1.default.CouponServices.getAllCouponHistory(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createCouponOwner(req, res) {
        const coupon_id = req.body.id;
        const event_id = req.body.event_id;
        const response = await services_1.default.CouponServices.createCouponOwner(req, coupon_id, event_id);
        return res.status(response.getStatusCode()).json(response);
    }
    async createHistoryForGoodLuckNextTime(req, res) {
        const event_id = req.body.event_id;
        const response = await services_1.default.CouponServices.createHistoryForGoodLuckNextTime(req, event_id);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllEventCoupon(req, res) {
        const response = await services_1.default.CouponServices.getAllEventCoupon(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllEventCouponByEventId(req, res) {
        const response = await services_1.default.CouponServices.getAllEventCouponByEventId(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCouponByIdOnDate(req, res) {
        const response = await services_1.default.CouponServices.getCouponByIdOnDate(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCouponById(req, res) {
        const response = await services_1.default.CouponServices.getCouponById(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getHistorySpinOfUserForAEvent(req, res) {
        const response = await services_1.default.CouponServices.getHistorySpinOfUserForAEvent(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getVoucherBySpin(req, res) {
        const response = await services_1.default.CouponServices.getVoucherBySpin(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createRatio(req, res) {
        const response = await services_1.default.CouponServices.createRatio(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateRatio(req, res) {
        const response = await services_1.default.CouponServices.updateRatio(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteRatio(req, res) {
        const response = await services_1.default.CouponServices.deleteRatio(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = CouponController;
