"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
class EventController {
    async createEvent(req, res) {
        return new Promise((resolve, reject) => {
            try {
                // Dùng middleware multer để xử lý FormData
                upload.none()(req, res, async (err) => {
                    if (err) {
                        console.error("Error occurred while parsing FormData:", err);
                        return res.status(400).json({ error: "Bad Request" });
                    }
                    const formData = req.body;
                    const response = await services_1.default.EventServices.createEvent(req, formData);
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
    async updateEvent(req, res) {
        return new Promise((resolve, reject) => {
            try {
                // Dùng middleware multer để xử lý FormData
                upload.none()(req, res, async (err) => {
                    if (err) {
                        console.error("Error occurred while parsing FormData:", err);
                        return res.status(400).json({ error: "Bad Request" });
                    }
                    const formData = req.body;
                    const response = await services_1.default.EventServices.updateEvent(req, formData);
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
    async deleteEvent(req, res) {
        const response = await services_1.default.EventServices.deleteEvent(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getEventsWithPagination(req, res) {
        const response = await services_1.default.EventServices.getEventsWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllEvents(req, res) {
        const response = await services_1.default.EventServices.getAllEvents(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getEventById(req, res) {
        const response = await services_1.default.EventServices.getEventById(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getActiveEvent(req, res) {
        const response = await services_1.default.EventServices.getActiveEvent(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = EventController;
