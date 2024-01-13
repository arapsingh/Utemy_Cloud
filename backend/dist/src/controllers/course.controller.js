"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
const course_validation_1 = __importDefault(require("../validations/course.validation"));
const common_1 = require("../common");
class CourseController {
    async getRightOfCourse(req, res) {
        const response = await services_1.default.CourseService.getRightOfCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createCourse(req, res) {
        const errorValidate = course_validation_1.default.createCourseSchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await services_1.default.CourseService.createCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async editCourse(req, res) {
        const errorValidate = course_validation_1.default.updateCourseSchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await services_1.default.CourseService.editCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteCourse(req, res) {
        const response = await services_1.default.CourseService.deleteCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getListRatingOfCourse(req, res) {
        const response = await services_1.default.CourseService.getListRatingOfCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getRatingPercentOfCourse(req, res) {
        const response = await services_1.default.CourseService.getRatingPercentOfCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTop10RateCourse(req, res) {
        const response = await services_1.default.CourseService.getTop10RateCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTop10EnrolledCourse(req, res) {
        const response = await services_1.default.CourseService.getTop10EnrolledCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async searchMyCourse(req, res) {
        const response = await services_1.default.CourseService.searchMyCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async searchMyEnrolledCourse(req, res) {
        const response = await services_1.default.CourseService.searchMyEnrolledCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllCourse(req, res) {
        const response = await services_1.default.CourseService.getAllCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async changeThumbnail(req, res) {
        const response = await services_1.default.CourseService.changeThumbnail(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCourseDetail(req, res) {
        const response = await services_1.default.CourseService.getCourseDetail(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCourseDetailById(req, res) {
        const response = await services_1.default.CourseService.getCourseDetailById(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async addPromotion(req, res) {
        const errorValidate = course_validation_1.default.addPromotionSchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await services_1.default.CourseService.addPromotion(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async stopPromotion(req, res) {
        const response = await services_1.default.CourseService.stopPromotion(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = CourseController;
