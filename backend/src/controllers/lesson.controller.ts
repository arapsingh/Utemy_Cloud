import services from "../services";
import { ResponseBase } from "../common/response";
import { Request, Response } from "express";
import { IRequestWithId } from "../types/request";

export default class LessonController {
    async createLesson(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.LessonServices.createLesson(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateLesson(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.LessonServices.updateLesson(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteLesson(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.LessonServices.deleteLesson(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getLessonById(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.LessonServices.getLessonById(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
