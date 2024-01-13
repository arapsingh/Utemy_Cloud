"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const addCourseToCart = async (req) => {
    try {
        const userId = Number(req.user_id);
        const { course_id } = req.body;
        const courseId = Number(course_id);
        const isFoundCourse = await configs_1.default.db.course.findUnique({
            where: {
                id: courseId,
            },
        });
        if (!isFoundCourse)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_COURSE_NOT_FOUND, false);
        else {
            const isCartExist = await configs_1.default.db.cart.findFirst({
                where: {
                    user_id: userId,
                },
            });
            let cartId = 0;
            if (!isCartExist) {
                const createCart = await configs_1.default.db.cart.create({
                    data: {
                        user_id: userId,
                    },
                });
                cartId = createCart.id;
            }
            else {
                cartId = isCartExist.id;
            }
            const isEnrolled = await configs_1.default.db.enrolled.findFirst({
                where: {
                    user_id: userId,
                    course_id: courseId,
                },
            });
            const isExistInCart = await configs_1.default.db.cartDetail.findFirst({
                where: {
                    course_id: courseId,
                    cart_id: cartId,
                },
            });
            if (isExistInCart)
                return new response_1.ResponseError(400, constants_1.default.error.ERROR_ALREADY_IN_CART, false);
            else if (isEnrolled)
                return new response_1.ResponseError(400, constants_1.default.error.ERROR_ALREADY_ENROLLED, false);
            else {
                const addCourseToCart = await configs_1.default.db.cartDetail.create({
                    data: {
                        course_id: courseId,
                        cart_id: cartId,
                    },
                });
                if (addCourseToCart)
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_ADD_CART, true);
                else
                    return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const removeCourseFromCart = async (req) => {
    try {
        const userId = Number(req.user_id);
        const { cart_detail_id } = req.params;
        const cartDetailId = Number(cart_detail_id);
        const isCartExist = await configs_1.default.db.cart.findFirst({
            where: {
                user_id: userId,
            },
        });
        let cartId = 0;
        if (!isCartExist) {
            const createCart = await configs_1.default.db.cart.create({
                data: {
                    user_id: userId,
                },
            });
            cartId = createCart.id;
        }
        else {
            cartId = isCartExist.id;
        }
        const isExistInCart = await configs_1.default.db.cartDetail.findFirst({
            where: {
                id: cartDetailId,
                cart_id: cartId,
            },
        });
        if (!isExistInCart)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_COURSE_NOT_FOUND_IN_CART, false);
        else {
            const removeCourseFromCart = await configs_1.default.db.cartDetail.delete({
                where: {
                    id: isExistInCart.id,
                },
            });
            if (removeCourseFromCart)
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_REMOVE_CART, true);
            else
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const changeSaveForLater = async (req) => {
    try {
        const userId = Number(req.user_id);
        const { cart_detail_id } = req.params;
        const cartDetailId = Number(cart_detail_id);
        const isCartExist = await configs_1.default.db.cart.findFirst({
            where: {
                user_id: userId,
            },
        });
        let cartId = 0;
        if (!isCartExist) {
            const createCart = await configs_1.default.db.cart.create({
                data: {
                    user_id: userId,
                },
            });
            cartId = createCart.id;
        }
        else {
            cartId = isCartExist.id;
        }
        const isExistInCart = await configs_1.default.db.cartDetail.findFirst({
            where: {
                id: cartDetailId,
                cart_id: cartId,
            },
        });
        if (!isExistInCart)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_COURSE_NOT_FOUND_IN_CART, false);
        else {
            const changeSaveForLater = await configs_1.default.db.cartDetail.update({
                where: {
                    id: isExistInCart.id,
                },
                data: {
                    saved_for_later: !isExistInCart.saved_for_later,
                },
            });
            if (changeSaveForLater)
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_SAVE_FOR_LATER, true);
            else
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllCart = async (req) => {
    try {
        const userId = Number(req.user_id);
        const isCartExist = await configs_1.default.db.cart.findFirst({
            where: {
                user_id: userId,
            },
        });
        let cartId = 0;
        if (!isCartExist) {
            const createCart = await configs_1.default.db.cart.create({
                data: {
                    user_id: userId,
                },
            });
            cartId = createCart.id;
        }
        else {
            cartId = isCartExist.id;
        }
        const getAllCart = await configs_1.default.db.cartDetail.findMany({
            where: {
                cart_id: cartId,
                course: {
                    is_delete: false,
                },
            },
            include: {
                course: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        const cart_items = getAllCart.map((cartDetail) => {
            const course = {
                course_id: cartDetail.course.id,
                title: cartDetail.course.title,
                slug: cartDetail.course.slug,
                thumbnail: cartDetail.course.thumbnail,
                average_rating: cartDetail.course.average_rating,
                number_of_rating: cartDetail.course.number_of_rating,
                number_of_enrolled: cartDetail.course.number_of_enrolled,
                author: cartDetail.course.user,
                price: cartDetail.course.price,
                sale_price: cartDetail.course.sale_price,
                sale_until: cartDetail.course.sale_until,
            };
            const cart_item = {
                cart_detail_id: cartDetail.id,
                saved_for_later: cartDetail.saved_for_later,
                course,
            };
            return cart_item;
        });
        const data = {
            cart_id: cartId,
            cart_items,
        };
        if (!getAllCart)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_CART_NOT_FOUND, false);
        else {
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_CART, true, data);
        }
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const cartSerives = { addCourseToCart, removeCourseFromCart, changeSaveForLater, getAllCart };
exports.default = cartSerives;
