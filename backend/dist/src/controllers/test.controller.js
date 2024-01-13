"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
class TestController {
    async getTestByTestId(req, res) {
        const response = await services_1.default.TestServices.getTestByTestId(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createTestHistory(req, res) {
        const response = await services_1.default.TestServices.createTestHistory(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTestHistory(req, res) {
        const response = await services_1.default.TestServices.getTestHistory(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = TestController;
