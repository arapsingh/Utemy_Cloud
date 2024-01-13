"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
class QuizController {
    async createQuizGroup(req, res) {
        const response = await services_1.default.QuizServices.createQuizGroup(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateQuizGroup(req, res) {
        const response = await services_1.default.QuizServices.updateQuizGroup(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteQuizGroup(req, res) {
        const response = await services_1.default.QuizServices.deleteQuizGroup(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllQuizGroup(req, res) {
        const response = await services_1.default.QuizServices.getAllQuizGroup(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllQuizGroupHasQuiz(req, res) {
        const response = await services_1.default.QuizServices.getAllQuizGroupHasQuiz(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createQuiz(req, res) {
        const response = await services_1.default.QuizServices.createQuiz(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateQuiz(req, res) {
        const response = await services_1.default.QuizServices.updateQuiz(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteQuiz(req, res) {
        const response = await services_1.default.QuizServices.deleteQuiz(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllQuizByGroupId(req, res) {
        const response = await services_1.default.QuizServices.getAllQuizByGroupId(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = QuizController;
