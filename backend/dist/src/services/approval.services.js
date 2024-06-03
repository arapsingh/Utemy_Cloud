"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const createApproval = async (req) => {
    try {
        const { course_id } = req.body;
        const user_id = req.user_id;
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isCourseExist = await configs_1.default.db.course.findFirst({
            where: {
                id: Number(course_id),
                status: false,
            },
        });
        if (!isCourseExist)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const createApproval = await configs_1.default.db.approval.create({
            data: {
                course_id: Number(course_id),
            },
        });
        if (!createApproval)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_APPROVAL, true, createApproval);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getApprovalsWithPagination = async (req) => {
    try {
        const { page_index: pageIndex, search_item: searchItem } = req.query;
        const pageSize = configs_1.default.general.PAGE_SIZE;
        const user_id = req.user_id;
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: Number(user_id),
                is_admin: true,
            },
        });
        const getApprovals = await configs_1.default.db.approval.findMany({
            take: pageSize,
            skip: (Number(pageIndex) - 1) * pageSize,
            where: {
                is_handle: false,
                course: {
                    title: {
                        contains: searchItem?.toString(),
                    },
                },
            },
            orderBy: {
                created_at: "asc",
            },
            include: {
                course: {
                    select: {
                        title: true,
                        thumbnail: true,
                        slug: true,
                        id: true,
                    },
                },
            },
        });
        if (!getApprovals)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        const mappedData = getApprovals.map((approval) => {
            const temp = {
                approval_id: approval.id,
                course_id: approval.course.id,
                course_title: approval.course.title,
                course_thumbnail: approval.course.thumbnail,
                course_slug: approval.course.slug,
                created_at: approval.created_at,
            };
            return temp;
        });
        const totalRecord = await configs_1.default.db.approval.count({
            where: {
                is_handle: false,
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const data = {
            total_page: totalPage,
            totalRecord: totalRecord,
            data: mappedData,
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
const ApprovalServices = {
    createApproval,
    getApprovalsWithPagination,
};
exports.default = ApprovalServices;
