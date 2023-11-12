import { IRequestWithId } from "../types/request";
import { db } from "../configs/db.config";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import { Prisma } from "@prisma/client";
import constants from "../constants";
import { ppid } from "process";

const createInvoice = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
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
        if (!isCartExist) {
            const createCart = await configs.db.cart.create({
                data: {
                    user_id: userId,
                },
            });
            cartId = createCart.id;
        } else {
            cartId = isCartExist.id;
        }
        const boughtCourses = await configs.db.cartDetail.findMany({
            where: {
                id: cartId,
                saved_for_later: false,
            },
            include: {
                course: true,
            },
        });
        let total_money = 0;
        const createInvoiceDetailData = boughtCourses.map((cartDetail) => {
            const now = new Date();
            let paidPrice;
            if (cartDetail.course.sale_until && cartDetail.course.sale_until < now)
                paidPrice = cartDetail.course.sale_price;
            else paidPrice = cartDetail.course.price;
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
        if (createInvoiceDetail) return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
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
            },
            include: {
                invoice_detail: true,
            },
        });
        if (getInvoices) return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true, getInvoices);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const checkoutService = { getAllInvoices, createInvoice };
export default checkoutService;
