import { IRequestWithId } from "~/types/request";
import { db } from "../configs/db.config";
import express, { Request, Response } from "express";
import configs from "../configs";
import { OutstandingCourse } from "src/types/course";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../utils/constants";

const getProfile = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user = await db.user.findFirst({
            where: {
                id: req.user_id,
                is_verify: true,
            },
            select: {
                first_name: true,
                last_name: true,
                url_avatar: true,
                description: true,
                email: true,
            },
        });

        if (!user) return new ResponseError(404, constants.ERROR_USER_NOT_FOUND, false);
        return new ResponseSuccess(200, constants.SUCCESS_REQUEST, true, user);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
    }
};

const updateProfile = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { first_name, last_name, description } = req.body;
        const user = await db.user.findFirst({
            where: {
                id: req.user_id,
                is_verify: true,
            },
        });
        if (!user) return new ResponseError(404, constants.ERROR_USER_NOT_FOUND, false);
        const isUpdate = await db.user.update({
            where: {
                id: req.user_id,
            },
            data: {
                first_name: first_name,
                last_name: last_name,
                description: description,
            },
        });
        if (!isUpdate) return new ResponseSuccess(200, constants.SUCCESS_REQUEST, false); //Missing Request body
        return new ResponseSuccess(200, constants.SUCCESS_REQUEST, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
    }
};

const changeAvatar = async (req: IRequestWithId, res: Response) => {
    try {
        const { user_id } = req.body;
        const userId = parseInt(user_id);
        const isFoundUserById = await configs.db.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!isFoundUserById) {
            return res.status(400).json();
        }
        // Xu li upload anh toi cloudinary o day
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
const getAuthorProfile = async (req: Request): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const user_id = parseInt(id);
        const user = await db.user.findFirst({
            where: {
                id: user_id,
                is_verify: true,
            },
            select: {
                first_name: true,
                last_name: true,
                url_avatar: true,
                description: true,
                courses: {
                    where: {
                        is_delete: false,
                    },
                    include: {
                        course_categories: {
                            select: {
                                Category: {
                                    select: {
                                        id: true,
                                        title: true,
                                        url_image: true,
                                        description: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user) return new ResponseError(404, constants.ERROR_USER_NOT_FOUND, false);

        const courses: OutstandingCourse[] = [];

        user?.courses.map((course) => {
            const data: OutstandingCourse = {
                id: course.id,
                thumbnail: course.thumbnail,
                title: course.title,
                slug: course.slug,
                categories: course.course_categories.map((cate) => (cate as any).Category),
                author: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    id: user_id,
                },
                created_at: course.created_at,
                updated_at: course.updated_at,
            };
            courses.push(data);
        });

        const data = {
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                url_avatar: user.url_avatar,
                description: user.description,
            },
            courses: courses,
        };
        return new ResponseSuccess(200, constants.SUCCESS_REQUEST, true, data);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.ERROR_INTERNAL_SERVER, false);
    }
};

const UserService = {
    getProfile,
    updateProfile,
    changeAvatar,
    getAuthorProfile,
};

export default UserService;
