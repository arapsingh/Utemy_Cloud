"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
class ReactionCommentBlogController {
    async createReactionCommentBlog(req, res) {
        const response = await services_1.default.ReactionCommentBlogServices.createReactionCommentBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteReactionCommentBlog(req, res) {
        const response = await services_1.default.ReactionCommentBlogServices.deleteReactionCommentBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTotalReactionsByCommentId(req, res) {
        const response = await services_1.default.ReactionCommentBlogServices.getTotalReactionsByCommentId(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTotalReactionsForAllComments(req, res) {
        const response = await services_1.default.ReactionCommentBlogServices.getTotalReactionsForAllComments(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = ReactionCommentBlogController;
