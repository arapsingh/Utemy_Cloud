"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
class CommentBlogController {
    async createCommentBlog(req, res) {
        const response = await services_1.default.CommentBlogService.createCommentBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateCommentBlog(req, res) {
        const response = await services_1.default.CommentBlogService.updateCommentBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteCommentBlog(req, res) {
        const response = await services_1.default.CommentBlogService.deleteCommentBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCommentBlogsWithPagination(req, res) {
        const response = await services_1.default.CommentBlogService.getCommentBlogsWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCommentBlogsWithPaginationByBlogId(req, res) {
        const response = await services_1.default.CommentBlogService.getCommentBlogsWithPaginationByBlogId(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = CommentBlogController;
