"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
const common_1 = require("../common");
const blog_validator_1 = __importDefault(require("../validations/blog.validator"));
class BlogController {
    async updateBlog(req, res) {
        const errorValidate = blog_validator_1.default.updateBlogSchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await services_1.default.BlogService.updateBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createBlog(req, res) {
        const errorValidate = blog_validator_1.default.createBlogSchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await services_1.default.BlogService.createBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteBlog(req, res) {
        const response = await services_1.default.BlogService.deleteBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getBlogsWithPagination(req, res) {
        const response = await services_1.default.BlogService.getBlogsWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getBlogs(req, res) {
        const response = await services_1.default.BlogService.getBlogs(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getBlog(req, res) {
        const response = await services_1.default.BlogService.getBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = BlogController;
