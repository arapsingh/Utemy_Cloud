"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
class ReportController {
    async createReport(req, res) {
        const response = await services_1.default.ReportServices.createReport(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getReportByCourseId(req, res) {
        const response = await services_1.default.ReportServices.getReportByCourseId(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllReportWithPagination(req, res) {
        const response = await services_1.default.ReportServices.getAllReportWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async handleReport(req, res) {
        const response = await services_1.default.ReportServices.handleReport(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = ReportController;
