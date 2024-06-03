"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const createReport = async (req) => {
    try {
        const { course_id, is_lecture, lecture_id, title, content } = req.body;
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isCourseExist = await configs_1.default.db.course.findFirst({
            where: {
                id: Number(course_id),
            },
        });
        if (!isCourseExist)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        let data = {
            course_id: Number(course_id),
            content,
            user_id,
            is_handle: false,
            title,
        };
        if (is_lecture)
            data = { ...data, lecture_id: Number(lecture_id), is_lecture: true };
        const createReport = await configs_1.default.db.report.create({
            data,
        });
        if (!createReport)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_REPORT, true);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getReportByCourseId = async (req) => {
    try {
        const { course_id } = req.params;
        const { page_index: pageIndex } = req.query;
        const pageSize = configs_1.default.general.PAGE_SIZE;
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const getReport = await configs_1.default.db.report.findMany({
            where: {
                course_id: Number(course_id),
            },
            orderBy: {
                created_at: "desc",
            },
            include: {
                lecture: {
                    include: {
                        lesson: true,
                        test: true,
                    },
                },
                course: true,
            },
            take: pageSize,
            skip: (Number(pageIndex) - 1) * pageSize,
        });
        if (!getReport)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        const totalRecord = await configs_1.default.db.report.count({
            where: {
                course_id: Number(course_id),
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const reports = getReport.map((report) => {
            let lecture = null;
            if (report.lecture) {
                const content = report.lecture.type === "Lesson" ? report.lecture.lesson : report.lecture.test;
                lecture = { lecture_id: report.lecture.id, content };
            }
            const temp = {
                ...report,
                report_id: report.id,
                lecture,
            };
            return temp;
        });
        const data = {
            data: reports,
            total_page: totalPage,
            total_record: totalRecord,
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_APPROVAL, true, data);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllReportWithPagination = async (req) => {
    try {
        const { page_index: pageIndex, search_item: searchItem } = req.query;
        const pageSize = configs_1.default.general.PAGE_SIZE;
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const getReport = await configs_1.default.db.report.findMany({
            where: {
                is_handle: false,
                course: {
                    title: {
                        contains: searchItem?.toString(),
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
            include: {
                lecture: {
                    include: {
                        test: true,
                        lesson: true,
                    },
                },
                course: true,
            },
            take: pageSize,
            skip: (Number(pageIndex) - 1) * pageSize,
        });
        if (!getReport)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        const totalRecord = await configs_1.default.db.report.count({
            where: {
                is_handle: false,
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const reports = getReport.map((report) => {
            let lecture = null;
            if (report.lecture) {
                const content = report.lecture.type === "Lesson" ? report.lecture.lesson : report.lecture.test;
                lecture = { lecture_id: report.lecture.id, content };
            }
            const temp = {
                ...report,
                report_id: report.id,
                lecture,
            };
            return temp;
        });
        const data = {
            data: reports,
            total_page: totalPage,
            total_record: totalRecord,
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_APPROVAL, true, data);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const handleReport = async (req) => {
    try {
        const { report_id } = req.params;
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isReportExist = await configs_1.default.db.report.findFirst({
            where: {
                id: Number(report_id),
                is_handle: false,
            },
        });
        if (!isReportExist)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const handleReport = await configs_1.default.db.report.update({
            where: {
                id: Number(report_id),
            },
            data: {
                is_handle: true,
            },
        });
        if (!handleReport)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_HANDLE_REPORT, true);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const ReportServices = {
    createReport,
    getReportByCourseId,
    handleReport,
    getAllReportWithPagination,
};
exports.default = ReportServices;
