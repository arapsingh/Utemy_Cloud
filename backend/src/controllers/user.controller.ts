import services from "../services";
import { ResponseBase } from "../common/response";
import { Request, Response } from "express";
import { IRequestWithId } from "../types/request";

export default class UserController {
    async changeAvatar(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.UserServices.changeAvatar(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
