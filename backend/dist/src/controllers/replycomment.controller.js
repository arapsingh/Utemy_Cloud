"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
class ReplyCommentController {
    async createReplyComment(req, res) {
        const response = await services_1.default.ReplyCommentServices.createReplyComment(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateReplyComment(req, res) {
        const response = await services_1.default.ReplyCommentServices.updateReplyComment(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteReplyComment(req, res) {
        const response = await services_1.default.ReplyCommentServices.deleteReplyComment(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getReplyCommentsWithPagination(req, res) {
        const response = await services_1.default.ReplyCommentServices.getReplyCommentsWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = ReplyCommentController;
