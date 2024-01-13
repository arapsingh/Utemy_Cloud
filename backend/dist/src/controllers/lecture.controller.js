"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
class LectureController {
    async createLecture(req, res) {
        const response = await services_1.default.LectureServices.createLecture(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateLecture(req, res) {
        const response = await services_1.default.LectureServices.updateLecture(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteLecture(req, res) {
        const response = await services_1.default.LectureServices.deleteLecture(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getLectureById(req, res) {
        const response = await services_1.default.LectureServices.getLectureById(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = LectureController;
