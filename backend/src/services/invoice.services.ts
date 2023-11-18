import { IRequestWithId } from "../types/request";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";

const createInvoice = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const isInvoiceNotSucess = await configs.db.invoice.findFirst({
            where: {
                user_id: userId,
                is_success: false,
            },
        });
        if (isInvoiceNotSucess)
            await configs.db.invoice.delete({
                where: {
                    id: isInvoiceNotSucess.id,
                },
            });
        const createInvoice = await configs.db.invoice.create({
            data: {
                user_id: userId,
            },
        });
        let cartId = 0;
        const isCartExist = await configs.db.cart.findFirst({
            where: {
                user_id: userId,
            },
        });

        if (isCartExist) {
            cartId = isCartExist.id;
        } else {
            const createCart = await configs.db.cart.create({
                data: {
                    user_id: userId,
                },
            });
            return new ResponseError(404, "You don't have any courses in cart", false);
        }
        const boughtCourses = await configs.db.cartDetail.findMany({
            where: {
                cart_id: cartId,
                saved_for_later: false,
            },
            include: {
                course: true,
            },
        });
        if (boughtCourses.length === 0) {
            return new ResponseError(404, "You don't have any courses in cart", false);
        }
        let total_money = 0;
        const createInvoiceDetailData = boughtCourses.map((cartDetail) => {
            const now = new Date();
            let paidPrice;
            if (cartDetail.course.sale_until && cartDetail.course.sale_until > now) {
                paidPrice = cartDetail.course.sale_price;
            } else paidPrice = cartDetail.course.price;
            total_money += Number(paidPrice);
            const data = {
                invoice_id: createInvoice.id,
                course_id: cartDetail.course_id,
                retail_price: Number(cartDetail.course.price),
                paid_price: Number(paidPrice),
            };
            return data;
        });
        const updateInvoice = await configs.db.invoice.update({
            where: {
                id: createInvoice.id,
            },
            data: {
                total_money,
            },
        });
        const createInvoiceDetail = await configs.db.invoiceDetail.createMany({
            data: createInvoiceDetailData,
        });
        if (createInvoiceDetail && updateInvoice)
            return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllInvoices = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const getInvoices = await configs.db.invoice.findMany({
            where: {
                user_id: userId,
                is_success: true,
            },
            include: {
                invoice_detail: {
                    include: {
                        course: true,
                    },
                },
            },
        });

        if (getInvoices) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, getInvoices);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getNowInvoice = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const getInvoice = await configs.db.invoice.findFirst({
            where: {
                user_id: userId,
                is_success: false,
            },
            include: {
                invoice_detail: {
                    include: {
                        course: true,
                    },
                },
            },
        });

        if (getInvoice) {
            const invoice_items = getInvoice.invoice_detail.map((detail) => {
                const course = {
                    course_id: detail.course.id,
                    title: detail.course.title,
                    thumbnail: detail.course.thumbnail,
                };
                const temp = {
                    invoice_detail_id: detail.id,
                    retail_price: detail.retail_price,
                    paid_price: detail.paid_price,
                    course,
                };
                return temp;
            });
            const data = {
                invoice_id: getInvoice.id,
                user_id: getInvoice.user_id,
                total_money: getInvoice.total_money,
                created_at: getInvoice.created_at,
                invoice_items,
            };
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        } else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const invoiceService = { getAllInvoices, createInvoice, getNowInvoice };
export default invoiceService;
