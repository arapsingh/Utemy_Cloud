"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
class DecisionController {
    async createDecision(req, res) {
        const response = await services_1.default.DecisionServices.createDecision(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getDecisionsByCourseId(req, res) {
        const response = await services_1.default.DecisionServices.getDecisionsByCourseId(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async handleDecision(req, res) {
        const response = await services_1.default.DecisionServices.handleDecision(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = DecisionController;
