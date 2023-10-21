import { IRequestWithId } from "../types/request";
import { db } from "../configs/db.config";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";

const addSection = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { course_id, title } = req.body;
        const isDeletedCourse = await configs.db.course.findFirst({
            where: {
                is_delete: true,
                id: course_id,
            },
        });
        if (isDeletedCourse) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }
        const addsection = await configs.db.section.create({
            data: {
                title: title,
                course_id: course_id,
            },
        });
        if (addsection) return new ResponseSuccess(201, constants.success.SUCCESS_REQUEST, true);
        return new ResponseError(400, constants.error.ERROR_VALIDATION_FAILED, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const editSection = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const section_id = parseInt(id);

        const isAuthor = await configs.db.section.findFirst({
            include: {
                Course: true,
            },
            where: {
                id: section_id,
                Course: {
                    author_id: req.user_id,
                },
            },
        });
        if (!isAuthor) {
            return new ResponseError(403, constants.error.ERROR_UNAUTHORIZED, false);
        }
        if (isAuthor.Course?.is_delete) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }
        if (isAuthor.is_delete) {
            return new ResponseError(404, constants.error.ERROR_SECTION_NOT_FOUND, false);
        }
        const editsection = await configs.db.section.update({
            where: {
                id: section_id,
            },
            data: {
                title: title,
            },
        });
        if (editsection) return new ResponseSuccess(200, constants.success.SUCCESS_REQUEST, true);
        return new ResponseError(400, constants.error.ERROR_VALIDATION_FAILED, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const deleteSection = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const section_id = parseInt(id);
        const isAuthor = await configs.db.section.findFirst({
            include: {
                Course: true,
            },
            where: {
                id: section_id,
                Course: {
                    author_id: req.user_id,
                },
            },
        });
        if (!isAuthor) {
            return new ResponseError(403, constants.error.ERROR_UNAUTHORIZED, false);
        }
        if (isAuthor.Course?.is_delete) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }
        if (isAuthor.is_delete) {
            return new ResponseError(404, constants.error.ERROR_SECTION_NOT_FOUND, false);
        }
        const lessonDeleteList = await configs.db.lesson.findMany({
            where: {
                section_id: section_id,
            },
        });
        const isDelete = await configs.db.section.update({
            where: {
                id: section_id,
            },
            data: {
                is_delete: true,
            },
        });
        if (isDelete) {
            const isDeleteLesson = await configs.db.lesson.updateMany({
                where: {
                    section_id: section_id,
                },
                data: {
                    is_delete: true,
                },
            });
            if (isDeleteLesson) return new ResponseSuccess(200, constants.success.SUCCESS_REQUEST, true);
        }
        return new ResponseError(400, constants.error.ERROR_VALIDATION_FAILED, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const SectionService = {
    addSection,
    editSection,
    deleteSection,
};

export default SectionService;
