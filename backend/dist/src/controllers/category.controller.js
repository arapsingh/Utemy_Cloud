"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
const common_1 = require("../common");
const category_validator_1 = __importDefault(require("../validations/category.validator"));
class CategoryController {
    async updateCategory(req, res) {
        const errorValidate = category_validator_1.default.updateCategorySchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await services_1.default.CategoryServices.updateCategory(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createCategory(req, res) {
        const errorValidate = category_validator_1.default.createCategorySchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await services_1.default.CategoryServices.createCategory(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteCategory(req, res) {
        const response = await services_1.default.CategoryServices.deleteCategory(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCategory(req, res) {
        const response = await services_1.default.CategoryServices.getCategory(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCategoriesWithPagination(req, res) {
        const response = await services_1.default.CategoryServices.getCategoriesWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCategories(req, res) {
        const response = await services_1.default.CategoryServices.getCategories(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async get5Categories(req, res) {
        const response = await services_1.default.CategoryServices.get5Categories(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = CategoryController;
