import { ResponseBase } from "../common/response";
import { Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";

export default class CheckoutController {
    async getAllInvoices(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CheckoutServices.getAllInvoices(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createInvoice(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CheckoutServices.createInvoice(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
