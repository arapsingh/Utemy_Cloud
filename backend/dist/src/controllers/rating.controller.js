"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
class RatingController {
    async ratingCourse(req, res) {
        const response = await services_1.default.RatingServices.ratingCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async editRatingCourse(req, res) {
        const response = await services_1.default.RatingServices.editRatingCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteRatingCourse(req, res) {
        const response = await services_1.default.RatingServices.deleteRatingCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getUserRatingOfCourse(req, res) {
        // const errorValidate: ValidationError | undefined = courseSchema.enrolledCourseSchema.validate(req.body).error;
        // if (errorValidate) {
        //     console.log(errorValidate);
        //     return res.status(400).json({
        //         status_code: 400,
        //         message: convertJoiErrorToString(errorValidate),
        //         success: false,
        //     });
        // }
        const response = await services_1.default.RatingServices.getUserRatingOfCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = RatingController;
