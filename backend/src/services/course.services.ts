import { IRequestWithId } from "../types/request";
import { db } from "../configs/db.config";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import { generateUniqueSlug } from "../utils/helper";
import { Prisma } from "@prisma/client";
import constants from "../constants";
import helper from "../helper";
import { RatingResponse } from "../types/rating.type";
const getRightOfCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const course_id = parseInt(req.params.course_id);
        const isAuthor = await configs.db.course.findFirst({
            where: {
                id: course_id,
                author_id: user_id,
            },
        });
        if (isAuthor) {
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, { role: "Author" });
        }
        const isEnrolled = await configs.db.enrolled.findFirst({
            where: {
                course_id: course_id,
                user_id: user_id,
            },
        });
        if (isEnrolled) {
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, { role: "Enrolled" });
        }
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, { role: "Unenrolled" });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    const file = req.file;
    const { title, slug, description, summary, categories, status, price } = req.body;
    const user_id = req.user_id;
    try {
        let fullPathConverted = "";
        if (file) fullPathConverted = helper.ConvertHelper.convertFilePath(file.path);
        const listCategoryId = categories.split(",").map((item: number) => ({
            category_id: Number(item),
        }));
        const convertedStatus = status === "true" ? true : false;

        const uniqueSlug = generateUniqueSlug(slug);
        if (user_id) {
            const isCreateCourse = await db.course.create({
                data: {
                    title: title,
                    slug: uniqueSlug,
                    description: description,
                    summary: summary,
                    thumbnail: fullPathConverted,
                    author_id: user_id,
                    status: convertedStatus,
                    price: Number(price),
                    course_categories: {
                        create: listCategoryId,
                    },
                },
                include: {
                    user: true, // Liên kết tới bảng User
                    enrolleds: true, // Liên kết tới bảng Enrolled
                    ratings: true, // Liên kết tới bảng Rating
                    sections: {
                        include: {
                            Lesson: true, // Liên kết tới bảng Lesson bên trong bảng Section
                        },
                    },
                },
            });
            if (isCreateCourse) {
                return new ResponseSuccess(201, constants.success.SUCCESS_CREATE_DATA, true);
            }
        }
        return new ResponseError(400, constants.error.ERROR_CREATE_COURSE_FAILED, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const editCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    const { course_id } = req.params;
    const { title, slug, summary, description, categories, status, thumbnail, price } = req.body;
    const courseid = +course_id;
    try {
        const isFoundCourseById = await configs.db.course.findFirst({
            where: {
                id: courseid,
                is_delete: false,
            },
        });
        if (!isFoundCourseById) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }
        const updatedCourse = await configs.db.course.update({
            where: {
                id: courseid,
            },
            data: {
                title: title,
                slug: slug,
                summary: summary,
                description: description,
                status: status,
                thumbnail: thumbnail,
                price: price,
            },
        });
        if (!updatedCourse) {
            return new ResponseError(400, constants.error.ERROR_MISSING_REQUEST_BODY, false);
        }
        await db.courseCategory.deleteMany({
            where: { course_id: courseid },
        });
        const isUpdateCategory = await db.courseCategory.createMany({
            data: categories.map((category: number) => ({
                course_id: courseid,
                category_id: category,
            })),
        });
        if (!isUpdateCategory) return new ResponseError(400, constants.error.ERROR_MISSING_REQUEST_BODY, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { course_id } = req.params;
        const courseId = +course_id;
        // Check if the course exists
        const existingCourse = await db.course.findUnique({
            where: {
                id: courseId,
            },
        });

        if (!existingCourse) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }

        // Set is_delete field to true to mark the course as deleted
        await db.course.update({
            where: {
                id: courseId,
            },
            data: {
                is_delete: true,
            },
        });
        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const buyCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const ratingCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { slug } = req.params;
        const { score, content } = req.body;
        const user_id = req.user_id as number;
        const isFoundCourse = await configs.db.course.findFirst({
            where: {
                slug,
            },
        });
        if (!isFoundCourse) return new ResponseError(401, constants.error.ERROR_COURSE_NOT_FOUND, false);
        const course_id = isFoundCourse.id;
        const isEnrolled = await configs.db.enrolled.findFirst({
            where: {
                course_id,
                user_id,
            },
        });
        if (!isEnrolled) {
            return new ResponseError(401, constants.error.ERROR_UNAUTHORZIED, false);
        } else {
            const isAlreadyRating = await configs.db.rating.findFirst({
                where: {
                    user_id,
                    course_id,
                },
            });
            if (isAlreadyRating) return new ResponseError(400, constants.error.ERROR_ALREADY_RATING, false);
            const ratingCourse = await configs.db.rating.create({
                data: {
                    user_id,
                    course_id,
                    score,
                    content,
                },
            });
            const ratingListOfCourse = await configs.db.rating.findMany({
                where: {
                    course_id,
                },
            });
            if (ratingListOfCourse.length > 0) {
                const ratingSum = ratingListOfCourse.reduce((sum, rating) => {
                    return sum + rating.score;
                }, 0);
                const average_rating = Number((ratingSum / ratingListOfCourse.length).toFixed(1));
                const updateRatingCourse = await configs.db.course.update({
                    where: {
                        id: course_id,
                    },
                    data: {
                        average_rating,
                        number_of_rating: isFoundCourse.number_of_rating + 1,
                    },
                });
                if (updateRatingCourse) {
                    return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_RATING, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }

        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const editRatingCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { rating_id, content, score } = req.body;
        const user_id = req.user_id;
        const isRatingExist = await configs.db.rating.findFirst({
            where: {
                id: rating_id,
            },
        });
        if (!isRatingExist) {
            return new ResponseError(404, constants.error.ERROR_RATING_NOT_FOUND, false);
        } else {
            if (isRatingExist.user_id !== user_id) {
                console.log(isRatingExist.user_id);
                return new ResponseError(401, constants.error.ERROR_UNAUTHORZIED, false);
            }
            const course_id = isRatingExist.course_id;
            const updateRatingCourse = await configs.db.rating.update({
                where: {
                    id: rating_id,
                },
                data: {
                    content,
                    score,
                },
            });
            const ratingListOfCourse = await configs.db.rating.findMany({
                where: {
                    course_id,
                },
            });
            if (ratingListOfCourse.length > 0) {
                const ratingSum = ratingListOfCourse.reduce((sum, rating) => {
                    return sum + rating.score;
                }, 0);
                const average_rating = Number((ratingSum / ratingListOfCourse.length).toFixed(1));
                const updateRatingCourse = await configs.db.course.update({
                    where: {
                        id: course_id,
                    },
                    data: {
                        average_rating,
                    },
                });
                if (updateRatingCourse) {
                    return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteRatingCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { rating_id } = req.body;
        const user_id = req.user_id;
        const isRatingExist = await configs.db.rating.findFirst({
            where: {
                id: rating_id,
            },
        });
        if (!isRatingExist) return new ResponseError(404, constants.error.ERROR_RATING_NOT_FOUND, false);
        else if (isRatingExist.user_id !== user_id)
            return new ResponseError(401, constants.error.ERROR_UNAUTHORZIED, false);
        else {
            const isFoundCourse = await configs.db.course.findFirst({
                where: {
                    id: isRatingExist.course_id,
                },
            });
            if (!isFoundCourse) return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
            else {
                const course_id = isFoundCourse.id;
                const deleteRating = await configs.db.rating.delete({
                    where: {
                        id: rating_id,
                    },
                });
                const ratingListOfCourse = await configs.db.rating.findMany({
                    where: {
                        course_id,
                    },
                });
                if (ratingListOfCourse.length > 0) {
                    const ratingSum = ratingListOfCourse.reduce((sum, rating) => {
                        return sum + rating.score;
                    }, 0);
                    const average_rating = Number((ratingSum / ratingListOfCourse.length).toFixed(1));
                    const updateRatingCourse = await configs.db.course.update({
                        where: {
                            id: course_id,
                        },
                        data: {
                            average_rating,
                            number_of_rating: isFoundCourse.number_of_rating - 1,
                        },
                    });
                    if (updateRatingCourse) {
                        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
                    } else {
                        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                    }
                } else {
                    const updateRatingCourse = await configs.db.course.update({
                        where: {
                            id: course_id,
                        },
                        data: {
                            average_rating: 0,
                            number_of_rating: 0,
                        },
                    });
                    if (updateRatingCourse) {
                        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
                    } else {
                        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                    }
                }
            }
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getListRatingOfCourse = async (req: Request): Promise<ResponseBase> => {
    try {
        const { page_index: pageIndex } = req.query;
        const { slug } = req.params;
        const pageSize = configs.general.PAGE_SIZE;
        const isFoundCourse = await configs.db.course.findUnique({
            where: {
                slug: slug,
            },
            select: {
                id: true,
            },
        });
        if (!isFoundCourse) return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        else {
            const ratingList = await configs.db.rating.findMany({
                skip: pageSize * (Number(pageIndex) - 1),
                take: pageSize,
                where: {
                    course_id: isFoundCourse.id,
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
                orderBy: {
                    created_at: "desc",
                },
            });

            const totalRecord = await configs.db.rating.count({
                where: {
                    course_id: isFoundCourse.id,
                },
            });
            const ratingListData: RatingResponse[] = [];
            ratingList.map((item) => {
                const rating: RatingResponse = {
                    id: item.id,
                    user_id: item.user_id,
                    first_name: item.User.first_name,
                    last_name: item.User.last_name,
                    url_avatar: item.User.url_avatar,
                    score: item.score,
                    content: item.content,
                    created_at: item.created_at.toString(),
                };
                return ratingListData.push(rating);
            });
            const totalPage = Math.ceil(totalRecord / pageSize);
            const ratingListResponseData = {
                total_record: totalRecord,
                total_page: totalPage,
                data: ratingListData,
            };

            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, ratingListResponseData);
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getUserRatingOfCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const { course_id } = req.body;
        const isFoundCourse = await configs.db.course.findFirst({
            where: {
                id: course_id,
            },
        });
        if (!isFoundCourse) return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        else {
            const ratingOfUser = await configs.db.rating.findFirst({
                where: {
                    user_id,
                    course_id,
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
            if (!ratingOfUser) return new ResponseError(404, constants.error.ERROR_RATING_NOT_FOUND, false);
            const ratingOfUserResponse: RatingResponse = {
                id: ratingOfUser.id,
                user_id: ratingOfUser.user_id,
                first_name: ratingOfUser.User.first_name,
                last_name: ratingOfUser.User.last_name,
                url_avatar: ratingOfUser.User.url_avatar,
                score: ratingOfUser.score,
                content: ratingOfUser.content,
                created_at: ratingOfUser.created_at.toString(),
            };

            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, ratingOfUserResponse);
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getTop10Course = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const top10Courses = await configs.db.courseCategory.findMany({
            take: 10,
            orderBy: {
                Course: {
                    average_rating: "desc",
                },
            },
            select: {
                Course: {
                    select: {
                        id: true,
                        title: true,
                        summary: true,
                        thumbnail: true,
                        average_rating: true,
                        number_of_rating: true,
                        number_of_enrolled: true,
                        slug: true,
                        user: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                            },
                        },
                    },
                },
                Category: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        // Định dạng dữ liệu theo cấu trúc yêu cầu
        const formattedData = top10Courses.map((courseCategory) => ({
            course_id: courseCategory.Course?.id,
            title: courseCategory.Course?.title,
            summary: courseCategory.Course?.summary,
            thumbnail: courseCategory.Course?.thumbnail,
            average_rating: courseCategory.Course?.average_rating,
            number_of_rating: courseCategory.Course?.number_of_rating,
            number_of_enrolled: courseCategory.Course?.number_of_enrolled,
            author: {
                id: courseCategory.Course?.user.id,
                first_name: courseCategory.Course?.user.first_name,
                last_name: courseCategory.Course?.user.last_name,
            },
            slug: courseCategory.Course?.slug,
            category: courseCategory.Category,
        }));

        // Đảm bảo top10Courses có dữ liệu
        if (top10Courses.length === 0) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }
        // Trả về danh sách top 10 khóa học
        return new ResponseSuccess(200, constants.success.SUCCESS_REQUEST, true, formattedData);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const searchMyCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const searchMyEnrolledCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCourseDetail = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const changeThumbnail = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const file = req.file;
        const { course_id } = req.body;
        if (file) {
            const isCourseExist = await configs.db.course.findFirst({
                where: {
                    id: course_id,
                },
            });
            if (!isCourseExist) {
                return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
            } else {
                if (isCourseExist.author_id !== req.user_id) {
                    return new ResponseError(401, constants.error.ERROR_UNAUTHORZIED, false);
                } else {
                    const oldThumbnailPath = isCourseExist.thumbnail;
                    const changeThumbnail = await configs.db.course.update({
                        where: {
                            id: course_id,
                        },
                        data: {
                            thumbnail: file.path,
                        },
                    });
                    if (changeThumbnail) {
                        await helper.FileHelper.destroyedFileIfFailed(oldThumbnailPath as string);
                        return new ResponseSuccess(200, constants.success.SUCCESS_CHANGE_THUMBNAIL, true);
                    } else {
                        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                    }
                }
            }
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const CourseServices = {
    getRightOfCourse,
    createCourse,
    editCourse,
    deleteCourse,
    buyCourse,
    ratingCourse,
    editRatingCourse,
    deleteRatingCourse,
    getListRatingOfCourse,
    getUserRatingOfCourse,
    getTop10Course,
    searchMyCourse,
    searchMyEnrolledCourse,
    getAllCourse,
    getCourseDetail,
    changeThumbnail,
};

export default CourseServices;
