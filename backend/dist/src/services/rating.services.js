"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const ratingCourse = async (req) => {
    try {
        const { score, content, course_id } = req.body;
        const user_id = req.user_id;
        const isFoundCourse = await configs_1.default.db.course.findFirst({
            where: {
                id: Number(course_id),
            },
        });
        if (!isFoundCourse)
            return new response_1.ResponseError(401, constants_1.default.error.ERROR_COURSE_NOT_FOUND, false);
        const courseId = isFoundCourse.id;
        const isEnrolled = await configs_1.default.db.enrolled.findFirst({
            where: {
                course_id: courseId,
                user_id,
            },
        });
        if (!isEnrolled) {
            return new response_1.ResponseError(401, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        }
        else {
            const isAlreadyRating = await configs_1.default.db.rating.findFirst({
                where: {
                    user_id,
                    course_id: courseId,
                },
            });
            if (isAlreadyRating) {
                console.log(isAlreadyRating);
                return new response_1.ResponseError(400, constants_1.default.error.ERROR_ALREADY_RATING, false);
            }
            const ratingCourse = await configs_1.default.db.rating.create({
                data: {
                    user_id,
                    course_id,
                    score,
                    content,
                },
            });
            const ratingListOfCourse = await configs_1.default.db.rating.findMany({
                where: {
                    course_id,
                },
            });
            if (ratingListOfCourse.length > 0) {
                const ratingSum = ratingListOfCourse.reduce((sum, rating) => {
                    return sum + rating.score;
                }, 0);
                const average_rating = Number((ratingSum / ratingListOfCourse.length).toFixed(1));
                const updateRatingCourse = await configs_1.default.db.course.update({
                    where: {
                        id: course_id,
                    },
                    data: {
                        average_rating,
                        number_of_rating: isFoundCourse.number_of_rating + 1,
                    },
                });
                if (updateRatingCourse) {
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_RATING, true);
                }
                else {
                    return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                }
            }
            else {
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
const editRatingCourse = async (req) => {
    try {
        const { rating_id, content, score } = req.body;
        const user_id = req.user_id;
        const isRatingExist = await configs_1.default.db.rating.findFirst({
            where: {
                id: rating_id,
            },
        });
        if (!isRatingExist) {
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_RATING_NOT_FOUND, false);
        }
        else {
            if (isRatingExist.user_id !== user_id) {
                console.log(isRatingExist.user_id);
                return new response_1.ResponseError(401, constants_1.default.error.ERROR_UNAUTHORIZED, false);
            }
            const course_id = isRatingExist.course_id;
            const updateRatingCourse = await configs_1.default.db.rating.update({
                where: {
                    id: rating_id,
                },
                data: {
                    content,
                    score,
                },
            });
            const ratingListOfCourse = await configs_1.default.db.rating.findMany({
                where: {
                    course_id,
                },
            });
            if (ratingListOfCourse.length > 0) {
                const ratingSum = ratingListOfCourse.reduce((sum, rating) => {
                    return sum + rating.score;
                }, 0);
                const average_rating = Number((ratingSum / ratingListOfCourse.length).toFixed(1));
                const updateRatingCourse = await configs_1.default.db.course.update({
                    where: {
                        id: course_id,
                    },
                    data: {
                        average_rating,
                    },
                });
                if (updateRatingCourse) {
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true);
                }
                else {
                    return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                }
            }
            else {
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
const deleteRatingCourse = async (req) => {
    try {
        const { rating_id } = req.params;
        const user_id = req.user_id;
        const isRatingExist = await configs_1.default.db.rating.findFirst({
            where: {
                id: Number(rating_id),
            },
        });
        if (!isRatingExist)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_RATING_NOT_FOUND, false);
        else if (isRatingExist.user_id !== user_id)
            return new response_1.ResponseError(401, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        else {
            const isFoundCourse = await configs_1.default.db.course.findFirst({
                where: {
                    id: isRatingExist.course_id,
                },
            });
            if (!isFoundCourse)
                return new response_1.ResponseError(404, constants_1.default.error.ERROR_COURSE_NOT_FOUND, false);
            else {
                const course_id = isFoundCourse.id;
                const deleteRating = await configs_1.default.db.rating.delete({
                    where: {
                        id: Number(rating_id),
                    },
                });
                const ratingListOfCourse = await configs_1.default.db.rating.findMany({
                    where: {
                        course_id,
                    },
                });
                if (ratingListOfCourse.length > 0) {
                    const ratingSum = ratingListOfCourse.reduce((sum, rating) => {
                        return sum + rating.score;
                    }, 0);
                    const average_rating = Number((ratingSum / ratingListOfCourse.length).toFixed(1));
                    const updateRatingCourse = await configs_1.default.db.course.update({
                        where: {
                            id: course_id,
                        },
                        data: {
                            average_rating,
                            number_of_rating: isFoundCourse.number_of_rating - 1,
                        },
                    });
                    if (updateRatingCourse) {
                        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true);
                    }
                    else {
                        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                    }
                }
                else {
                    const updateRatingCourse = await configs_1.default.db.course.update({
                        where: {
                            id: course_id,
                        },
                        data: {
                            average_rating: 0,
                            number_of_rating: 0,
                        },
                    });
                    if (updateRatingCourse) {
                        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true);
                    }
                    else {
                        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                    }
                }
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
const getUserRatingOfCourse = async (req) => {
    try {
        const user_id = req.user_id;
        const { course_id } = req.params;
        const isFoundCourse = await configs_1.default.db.course.findFirst({
            where: {
                id: Number(course_id),
            },
        });
        if (!isFoundCourse)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_COURSE_NOT_FOUND, false);
        else {
            const ratingOfUser = await configs_1.default.db.rating.findFirst({
                where: {
                    user_id,
                    course_id: Number(course_id),
                },
                include: {
                    User: {
                        select: {
                            url_avatar: true,
                            first_name: true,
                            last_name: true,
                            id: true,
                        },
                    },
                },
            });
            if (!ratingOfUser)
                return new response_1.ResponseError(404, constants_1.default.error.ERROR_RATING_NOT_FOUND, false);
            const ratingOfUserResponse = {
                id: ratingOfUser.id,
                user_id: ratingOfUser.user_id,
                first_name: ratingOfUser.User.first_name,
                last_name: ratingOfUser.User.last_name,
                url_avatar: ratingOfUser.User.url_avatar,
                score: ratingOfUser.score,
                content: ratingOfUser.content,
                created_at: ratingOfUser.created_at.toString(),
            };
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, ratingOfUserResponse);
        }
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const ratingServices = {
    ratingCourse,
    editRatingCourse,
    deleteRatingCourse,
    getUserRatingOfCourse,
};
exports.default = ratingServices;
