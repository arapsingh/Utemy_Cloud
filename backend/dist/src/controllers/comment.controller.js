"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
class CommentController {
    async createComment(req, res) {
        const response = await services_1.default.CommentServices.createComment(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateComment(req, res) {
        const response = await services_1.default.CommentServices.updateComment(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteComment(req, res) {
        const response = await services_1.default.CommentServices.deleteComment(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCommentsWithPagination(req, res) {
        const response = await services_1.default.CommentServices.getCommentsWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCommentsWithPaginationByLectureId(req, res) {
        const response = await services_1.default.CommentServices.getCommentsWithPaginationByLectureId(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCommentsWithPaginationByCourseId(req, res) {
        const response = await services_1.default.CommentServices.getCommentsWithPaginationByCourseId(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = CommentController;
