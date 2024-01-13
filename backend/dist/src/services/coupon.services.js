"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const createCoupon = async (req) => {
    try {
        const { code, discount, valid_start, valid_until } = req.body;
        const user_id = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const createCoupon = await configs_1.default.db.coupon.create({
            data: {
                code,
                discount: Number(discount),
                valid_until,
            },
        });
        if (createCoupon)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DATA, true);
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateCoupon = async (req) => {
    try {
        const { coupon_id } = req.params;
        const { code, discount, valid_start, valid_until } = req.body;
        const user_id = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isCouponExsist = await configs_1.default.db.coupon.findUnique({
            where: {
                id: Number(coupon_id),
            },
        });
        if (!isCouponExsist)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const updateCoupon = await configs_1.default.db.coupon.update({
            data: {
                code,
                discount: Number(discount),
                valid_until,
            },
            where: {
                id: isCouponExsist.id,
            },
        });
        if (updateCoupon)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteCoupon = async (req) => {
    try {
        const { coupon_id } = req.params;
        const user_id = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isCouponExsist = await configs_1.default.db.coupon.findUnique({
            where: {
                id: Number(coupon_id),
            },
        });
        if (!isCouponExsist)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const deleteCoupon = await configs_1.default.db.coupon.update({
            data: {
                is_delete: true,
            },
            where: {
                id: isCouponExsist.id,
            },
        });
        if (deleteCoupon)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_DATA, true);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCouponByCode = async (req) => {
    try {
        const { code } = req.params;
        const user_id = Number(req.user_id);
        const isCouponExsist = await configs_1.default.db.coupon.findFirst({
            where: {
                code,
                is_delete: false,
                valid_until: {
                    gt: new Date(),
                },
            },
            select: {
                id: true,
                code: true,
                discount: true,
                valid_until: true,
            },
        });
        if (!isCouponExsist)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const isCouponUsed = await configs_1.default.db.couponHistory.findFirst({
            where: {
                coupon_id: isCouponExsist.id,
                user_id,
            },
        });
        if (isCouponUsed)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_COUPON_USED, false);
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, isCouponExsist);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllCoupon = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const getAllCoupon = await configs_1.default.db.coupon.findMany({
            where: {
                is_delete: false,
            },
            select: {
                id: true,
                code: true,
                discount: true,
                valid_until: true,
            },
        });
        if (!getAllCoupon)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, getAllCoupon);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const couponService = { createCoupon, updateCoupon, deleteCoupon, getCouponByCode, getAllCoupon };
exports.default = couponService;
