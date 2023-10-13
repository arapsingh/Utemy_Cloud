import services from "../services";
import { ResponseBase } from "../common/response";
import { Request, Response } from "express";
import { IRequestWithId } from "../types/request";

export default class CategoryController {
    async updateCategory(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CategoryServices.updateCategory(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
