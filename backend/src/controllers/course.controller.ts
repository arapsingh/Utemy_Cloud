import express, { Request, Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";
import courseSchema, { createCourseSchema } from "../validations/course.validation";
import { ValidationError } from "joi";
import { ResponseBase, convertJoiErrorToString } from "../common";
export default class CourseController {
    async getRightOfCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getRightOfCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async createCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = courseSchema.createCourseSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.CourseService.createCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async editCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = courseSchema.updateCourseSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.CourseService.editCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async deleteCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.deleteCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async buyCourse(req: IRequestWithId, res: Response): Promise<Response> {
        return res;
    }

    async ratingCourse(req: IRequestWithId, res: Response): Promise<Response> {
        return res;
    }

    async editRatingCourse(req: IRequestWithId, res: Response): Promise<Response> {
        return res;
    }

    async getListRatingOfCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getListRatingOfCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async getUserRatingOfCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getUserRatingOfCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async getTop10Course(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getTop10Course(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async searchMyCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.searchMyCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async searchMyEnrolledCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.searchMyEnrolledCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async getAllCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getAllCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async changeThumbnail(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.changeThumbnail(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async getCourseDetail(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getCourseDetail(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
