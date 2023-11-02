import services from "../services";
import { ResponseBase } from "../common/response";
import { Request, Response } from "express";
import { IRequestWithId } from "../types/request";
import { convertJoiErrorToString } from "../common";
import categorySchema from "../validations/category.validator";
import { ValidationError } from "joi";

export default class RatingController {
    async ratingCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.RatingServices.ratingCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async editRatingCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.RatingServices.editRatingCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteRatingCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.RatingServices.deleteRatingCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getUserRatingOfCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.RatingServices.getUserRatingOfCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
