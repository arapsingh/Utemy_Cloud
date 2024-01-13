"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
class LessonController {
    async createLesson(req, res) {
        const response = await services_1.default.LessonServices.createLesson(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateLesson(req, res) {
        const response = await services_1.default.LessonServices.updateLesson(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteLesson(req, res) {
        const response = await services_1.default.LessonServices.deleteLesson(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getLessonById(req, res) {
        const response = await services_1.default.LessonServices.getLessonById(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = LessonController;
