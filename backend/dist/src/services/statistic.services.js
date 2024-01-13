"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const courseCount = async (req) => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const courseCount = await configs_1.default.db.course.count({
            where: {
                is_delete: false,
            },
        });
        const data = {
            course_count: courseCount,
        };
        if (courseCount)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, data);
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const moneyCalculation = async (req) => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const moneyCalculation = await configs_1.default.db.invoice.aggregate({
            _sum: {
                total_money: true,
            },
        });
        const data = {
            total_money: moneyCalculation._sum.total_money,
        };
        if (moneyCalculation)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, data);
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const userCount = async (req) => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const userCount = await configs_1.default.db.user.count({
            where: {
                is_deleted: false,
            },
        });
        const data = {
            total_user: userCount,
        };
        if (userCount)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, data);
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const invoiceCount = async (req) => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const invoiceCount = await configs_1.default.db.transaction.count();
        const data = {
            total_invoice: invoiceCount,
        };
        if (invoiceCount)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, data);
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const categoryCourseCount = async (req) => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const categoryCourseCount = await configs_1.default.db.courseCategory.groupBy({
            by: ["category_id"],
            _count: {
                course_id: true,
            },
        });
        const categories = await configs_1.default.db.category.findMany();
        const categoryHashTable = categories.reduce((acc, category) => {
            acc[category.id] = category.title;
            return acc;
        }, {});
        const convertData = categoryCourseCount.map((categoryCourse) => {
            const temp = {
                id: categoryCourse.category_id,
                title: categoryHashTable[categoryCourse.category_id],
                course_count: categoryCourse._count.course_id,
            };
            return temp;
        });
        if (categoryCourseCount)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, convertData);
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const categoryEnrolledCount = async (req) => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const categoryCourseCount = await configs_1.default.db
            .$queryRaw `select sum(number_of_enrolled) as total_enrolled, category_id, title from (select number_of_enrolled, category_id, category.title as title from course left join courses_categories on courses_categories.course_id = course.id 
                left join category on courses_categories.category_id = category.id where number_of_enrolled != 0 ) as temp_table group by category_id;`;
        if (categoryCourseCount)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, categoryCourseCount);
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const categoryMoneyCount = async (req) => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const categoryMoneyCount = await configs_1.default.db
            .$queryRaw `select  category.id as category_id, category.title as category_title, sum(invoice_detail.paid_price) as total_money_from_category from courses_categories left join course 
            on courses_categories.course_id = course. id right join invoice_detail on invoice_detail.course_id = course.id left join category 
            on courses_categories.category_id = category.id group by category_title;`;
        if (categoryMoneyCount)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, categoryMoneyCount);
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const ratingPercent = async (req) => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const ratingCount = await configs_1.default.db
            .$queryRaw `select count(course.id) as number_of_courses, round(average_rating) as rounded_rating from course group by round(average_rating) order by rounded_rating limit 5 offset 1`;
        const courseHasRatingCount = await configs_1.default.db.course.count({
            where: {
                NOT: {
                    average_rating: 0,
                },
            },
        });
        const data = ratingCount.map((rating) => {
            const temp = {
                title: rating.rounded_rating,
                percent: Number((Number(Number(rating.number_of_courses) / Number(courseHasRatingCount)) * 100).toFixed(2)),
            };
            return temp;
        });
        if (ratingCount)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, data);
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        console.log(error);
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const moneyByMonth = async (req) => {
    try {
        const { year } = req.params;
        const userId = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const moneyByMonthQuery = await configs_1.default.db
            .$queryRaw `select sum(total_money) as total_money_month, month(created_at) as month_label from invoice where is_success = 1 and year(created_at) = ${year} group by month(created_at);`;
        const monthThatHasMoney = moneyByMonthQuery.reduce((acc, month) => {
            acc[month.month_label] = month.total_money_month;
            return acc;
        }, {});
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const data = months.map((month) => {
            return {
                month_label: month,
                total_money_month: monthThatHasMoney[month] || 0,
            };
        });
        if (moneyByMonthQuery)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, data);
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const statisticServices = {
    categoryCourseCount,
    courseCount,
    categoryEnrolledCount,
    categoryMoneyCount,
    moneyCalculation,
    userCount,
    ratingPercent,
    moneyByMonth,
    invoiceCount,
};
exports.default = statisticServices;
