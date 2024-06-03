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
        // const trailerFile: Express.Multer.File | undefined = req.file;
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
    async updateTargetCourse(req, res) {
        const response = await services_1.default.CourseService.updateTargetCourse(req);
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
    async getProgressByCourseSlug(req, res) {
        const response = await services_1.default.CourseService.getProgressByCourseSlug(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCourseDetailForTrialLesson(req, res) {
        const response = await services_1.default.CourseService.getCourseDetailForTrialLesson(req);
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
    async getAllSalesCourses(req, res) {
        const response = await services_1.default.CourseService.getAllSalesCourses(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTop10SalesCourses(req, res) {
        const response = await services_1.default.CourseService.getTop10SalesCourses(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async approveCourse(req, res) {
        const response = await services_1.default.CourseService.approveCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async restrictCourse(req, res) {
        const response = await services_1.default.CourseService.restrictCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllEnrolled(req, res) {
        const response = await services_1.default.CourseService.getAllEnrolled(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCertificate(req, res) {
        const response = await services_1.default.CourseService.getCertificate(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createFinalTest(req, res) {
        const response = await services_1.default.CourseService.createFinalTest(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateFinalTest(req, res) {
        const response = await services_1.default.CourseService.updateFinalTest(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteFinalTest(req, res) {
        const response = await services_1.default.CourseService.deleteFinalTest(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async setDoneCourse(req, res) {
        const response = await services_1.default.CourseService.setDoneCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getFinalTestByCourseId(req, res) {
        const response = await services_1.default.CourseService.getFinalTestByCourseId(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = CourseController;
