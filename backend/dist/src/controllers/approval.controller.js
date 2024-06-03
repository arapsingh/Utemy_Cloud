"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
class ApprovalController {
    async createApproval(req, res) {
        const response = await services_1.default.ApprovalServices.createApproval(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getApprovalsWithPagination(req, res) {
        const response = await services_1.default.ApprovalServices.getApprovalsWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = ApprovalController;
