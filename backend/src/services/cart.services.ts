import { IRequestWithId } from "../types/request";
import { db } from "../configs/db.config";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import { Prisma } from "@prisma/client";
import constants from "../constants";

const addCourseToCart = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const { course_id } = req.body;
        const courseId = Number(course_id);
        const isFoundCourse = await configs.db.course.findUnique({
            where: {
                id: courseId,
            },
        });
        if (!isFoundCourse) return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        else {
            const isCartExist = await configs.db.cart.findFirst({
                where: {
                    user_id: userId,
                },
            });
            let cartId = 0;
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

            const isExistInCart = await configs.db.cartDetail.findFirst({
                where: {
                    course_id: courseId,
                    cart_id: cartId,
                },
            });
            if (isExistInCart) return new ResponseError(400, "Already in cart", false);
            else {
                const addCourseToCart = await configs.db.cartDetail.create({
                    data: {
                        course_id: courseId,
                        cart_id: cartId,
                    },
                });
                if (addCourseToCart) return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
                else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const removeCourseFromCart = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const { cart_detail_id } = req.params;
        const cartDetailId = Number(cart_detail_id);
        const isCartExist = await configs.db.cart.findFirst({
            where: {
                user_id: userId,
            },
        });
        let cartId = 0;
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
        const isExistInCart = await configs.db.cartDetail.findFirst({
            where: {
                id: cartDetailId,
                cart_id: cartId,
            },
        });
        if (!isExistInCart) return new ResponseError(400, "Course not found in cart", false);
        else {
            const removeCourseFromCart = await configs.db.cartDetail.delete({
                where: {
                    id: isExistInCart.id,
                },
            });
            if (removeCourseFromCart) return new ResponseSuccess(200, "remove from cart successfully", true);
            else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const changeSaveForLater = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const { cart_detail_id } = req.params;
        const cartDetailId = Number(cart_detail_id);
        const isCartExist = await configs.db.cart.findFirst({
            where: {
                user_id: userId,
            },
        });
        let cartId = 0;
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

        const isExistInCart = await configs.db.cartDetail.findFirst({
            where: {
                id: cartDetailId,
                cart_id: cartId,
            },
        });
        if (!isExistInCart) return new ResponseError(400, "Course not found in cart", false);
        else {
            const changeSaveForLater = await configs.db.cartDetail.update({
                where: {
                    id: isExistInCart.id,
                },
                data: {
                    saved_for_later: !isExistInCart.saved_for_later,
                },
            });
            if (changeSaveForLater) return new ResponseSuccess(200, "Change save for later successfully", true);
            else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getAllCart = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const isCartExist = await configs.db.cart.findFirst({
            where: {
                user_id: userId,
            },
        });
        let cartId = 0;
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

        const getAllCart = await configs.db.cartDetail.findMany({
            where: {
                cart_id: cartId,
            },
        });
        if (!getAllCart) return new ResponseError(400, "Cart not found", false);
        else {
            return new ResponseSuccess(200, "Get cart successfully", true, getAllCart);
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const cartSerives = { addCourseToCart, removeCourseFromCart, changeSaveForLater, getAllCart };
export default cartSerives;
