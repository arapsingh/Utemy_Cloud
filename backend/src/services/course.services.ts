import { IRequestWithId } from "../types/request";
import { db } from "../configs/db.config";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../utils/constants";
import { generateUniqueSlug } from "../utils/helper";
import { Prisma } from "@prisma/client";
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
            return new ResponseSuccess(200, constants.SUCCESS_GET_DATA, true, { role: "Author" });
        }
        const isEnrolled = await configs.db.enrolled.findFirst({
            where: {
                course_id: course_id,
                user_id: user_id,
            },
        });
        if (isEnrolled) {
            return new ResponseSuccess(200, constants.SUCCESS_GET_DATA, true, { role: "Enrolled" });
        }
        return new ResponseSuccess(200, constants.SUCCESS_GET_DATA, true, { role: "Unenrolled" });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
    }
};
const createCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    const { title, slug, description, summary, categories, status, thumbnail, price } = req.body;
    const user_id = req.user_id;
    try {
        const listCategoryId = categories.map((item: number) => ({
            category_id: item,
        }));

        const uniqueSlug = generateUniqueSlug(slug);
        if (user_id) {
            const isCreateCourse = await db.course.create({
                data: {
                    title: title,
                    slug: uniqueSlug,
                    description: description,
                    summary: summary,
                    thumbnail: thumbnail,
                    author_id: user_id,
                    status: status,
                    price: price,
                    total_rating: 0, // Giá trị mặc định cho total_rating
                    number_of_rating: 0, // Giá trị mặc định cho number_of_rating
                    number_of_enrolled: 0, // Giá trị mặc định cho number_of_enrolled
                    sale_price: 0, // Giá trị mặc định cho sale_price
                    sale_until: new Date(), // Giá trị mặc định cho sale_until
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
                return new ResponseSuccess(201, constants.SUCCESS_CREATE_DATA, true);
            }
        }
        return new ResponseError(400, constants.ERROR_CREATE_COURSE_FAILED, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
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
            return new ResponseError(404, constants.ERROR_COURSE_NOT_FOUND, false);
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
            return new ResponseError(400, constants.ERROR_MISSING_REQUEST_BODY, false);
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
        if (!isUpdateCategory) return new ResponseError(400, constants.ERROR_MISSING_REQUEST_BODY, false);
        return new ResponseSuccess(200, constants.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
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
            return new ResponseError(404, constants.ERROR_COURSE_NOT_FOUND, false);
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
        return new ResponseSuccess(200, constants.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
    }
};
const buyCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
    }
};
const ratingCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
    }
};
const editRatingCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
    }
};
const getListRatingOfCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
    }
};
const getUserRatingOfCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
    }
};
const getTop10Course = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const top10Courses = await configs.db.courseCategory.findMany({
            take: 10,
            orderBy: {
                Course: {
                    total_rating: "desc",
                },
            },
            select: {
                Course: {
                    select: {
                        id: true,
                        title: true,
                        summary: true,
                        thumbnail: true,
                        total_rating: true,
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
            total_rating: courseCategory.Course?.total_rating,
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
            return new ResponseError(404, constants.ERROR_COURSE_NOT_FOUND, false);
        }
        // Trả về danh sách top 10 khóa học
        return new ResponseSuccess(200, constants.SUCCESS_REQUEST, true, formattedData);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
    }
};

const searchMyCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
    }
};
const searchMyEnrolledCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
    }
};
const getCourseDetail = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
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
