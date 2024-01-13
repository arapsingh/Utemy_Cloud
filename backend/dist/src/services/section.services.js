"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const jsonwebtoken_1 = require("jsonwebtoken");
const lesson_services_1 = __importDefault(require("./lesson.services"));
const addSection = async (req) => {
    try {
        const { course_id, title } = req.body;
        const isDeletedCourse = await configs_1.default.db.course.findFirst({
            where: {
                is_delete: true,
                id: course_id,
            },
        });
        if (isDeletedCourse) {
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_COURSE_NOT_FOUND, false);
        }
        const addsection = await configs_1.default.db.section.create({
            data: {
                title: title,
                course_id: course_id,
            },
        });
        if (addsection)
            return new response_1.ResponseSuccess(201, constants_1.default.success.SUCCESS_REQUEST, true);
        return new response_1.ResponseError(400, constants_1.default.error.ERROR_VALIDATION_FAILED, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const editSection = async (req) => {
    try {
        const { title, section_id } = req.body;
        const isAuthor = await configs_1.default.db.section.findFirst({
            include: {
                Course: true,
            },
            where: {
                id: Number(section_id),
                Course: {
                    author_id: req.user_id,
                },
            },
        });
        if (!isAuthor) {
            return new response_1.ResponseError(403, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        }
        if (isAuthor.Course?.is_delete) {
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_COURSE_NOT_FOUND, false);
        }
        if (isAuthor.is_delete) {
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_SECTION_NOT_FOUND, false);
        }
        const editsection = await configs_1.default.db.section.update({
            where: {
                id: Number(section_id),
            },
            data: {
                title: title,
            },
        });
        if (editsection)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_REQUEST, true);
        return new response_1.ResponseError(400, constants_1.default.error.ERROR_VALIDATION_FAILED, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteSection = async (req) => {
    try {
        const { section_id } = req.params;
        const isFoundSection = await configs_1.default.db.section.findFirst({
            include: {
                Course: true,
            },
            where: {
                id: Number(section_id),
                Course: {
                    author_id: req.user_id,
                },
            },
        });
        if (!isFoundSection) {
            return new response_1.ResponseError(403, constants_1.default.error.ERROR_SECTION_NOT_FOUND, false);
        }
        if (isFoundSection.Course?.is_delete) {
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_COURSE_NOT_FOUND, false);
        }
        if (isFoundSection.is_delete) {
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_SECTION_NOT_FOUND, false);
        }
        const isDelete = await configs_1.default.db.section.update({
            where: {
                id: Number(section_id),
            },
            data: {
                is_delete: true,
            },
        });
        if (isDelete) {
            const isDeleteLecture = await configs_1.default.db.lecture.updateMany({
                where: {
                    section_id: Number(section_id),
                },
                data: {
                    is_delete: true,
                },
            });
            if (isDeleteLecture) {
                const deletedLecture = await configs_1.default.db.lecture.findMany({
                    where: {
                        section_id: Number(section_id),
                        is_delete: true,
                    },
                });
                deletedLecture.forEach(async (lecture) => {
                    if (lecture.type === "Lesson")
                        lesson_services_1.default.deleteLesson(lecture.id);
                    else
                        console.log("delete test");
                    // const fullPathDeConverted = await helper.ConvertHelper.deConvertFilePath(lesson.url_video);
                    // await helper.FileHelper.destroyedVideoIfFailed(fullPathDeConverted);
                });
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_REQUEST, true);
            }
        }
        return new response_1.ResponseError(400, constants_1.default.error.ERROR_VALIDATION_FAILED, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllSectionByCourseId = async (req) => {
    try {
        const { course_id } = req.params;
        const isFoundSection = await configs_1.default.db.section.findMany({
            where: {
                course_id: parseInt(course_id),
                is_delete: false,
                Course: {
                    is_delete: false,
                },
            },
            include: {
                Lecture: {
                    where: {
                        is_delete: false,
                    },
                    select: {
                        id: true,
                        type: true,
                        lesson: true,
                        test: true,
                    },
                    orderBy: {
                        created_at: "asc",
                    },
                },
                Course: {
                    select: {
                        is_delete: true,
                    },
                },
            },
        });
        if (isFoundSection) {
            const sections = isFoundSection.map((section) => {
                const lecture = section.Lecture.map((lecture) => {
                    let content;
                    if (lecture.type === "Lesson")
                        content = lecture.lesson;
                    else
                        content = lecture.test;
                    const tempLecture = {
                        lecture_id: lecture.id,
                        type: lecture.type,
                        content,
                    };
                    return tempLecture;
                });
                const temp = {
                    title: section.title,
                    updated_at: section.updated_at,
                    id: section.id,
                    lecture,
                };
                return temp;
            });
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, sections);
        }
        return new response_1.ResponseError(400, constants_1.default.error.ERROR_VALIDATION_FAILED, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, error.toString(), false);
        }
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return new response_1.ResponseError(400, error.message, false);
        }
        else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return new response_1.ResponseError(401, error.message, false);
        }
        else if (error instanceof jsonwebtoken_1.NotBeforeError) {
            return new response_1.ResponseError(401, error.message, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const SectionService = {
    addSection,
    editSection,
    deleteSection,
    getAllSectionByCourseId,
};
exports.default = SectionService;
