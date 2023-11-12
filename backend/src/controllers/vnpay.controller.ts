import { ResponseBase } from "../common/response";
import { Response, Request } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";

export default class VnpayController {
    async checkout(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.VnpayServices.checkout(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
