import { IRequestWithId } from "../types/request";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";

// const mostEnrolledCategory = async (req: IRequestWithId): Promise<ResponseBase> => {
//     try {
//     } catch (error) {
//         if (error instanceof PrismaClientKnownRequestError) {
//             return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
//         }
//         return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
//     }
// };
const courseCount = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const courseCount = await configs.db.course.count();
        const data = {
            course_count: courseCount,
        };
        if (courseCount) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const moneyCalculation = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const moneyCalculation = await configs.db.invoice.aggregate({
            _sum: {
                total_money: true,
            },
        });
        const data = {
            total_money: moneyCalculation._sum.total_money,
        };
        if (moneyCalculation) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const userCount = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userCount = await configs.db.user.count();
        const data = {
            total_user: userCount,
        };
        if (userCount) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const categoryCourseCount = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const categoryCourseCount = await configs.db.courseCategory.groupBy({
            by: ["category_id"],
            _count: {
                course_id: true,
            },
        });
        const categories = await configs.db.category.findMany();
        const categoryHashTable: Record<number | string, string> = categories.reduce((acc: any, category) => {
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
        if (categoryCourseCount) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, convertData);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const categoryEnrolledCount = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const categoryCourseCount = await configs.db
            .$queryRaw`select sum(number_of_enrolled) as total_enrolled, category_id, category.title FROM utemy.courses_categories 
        left join course on courses_categories.course_id = course.id left join category on courses_categories.category_id= category.id group by category_id;`;

        if (categoryCourseCount)
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, categoryCourseCount);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const categoryMoneyCount = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const categoryMoneyCount = await configs.db
            .$queryRaw`select  category.id as category_id, category.title as category_title, sum(invoice_detail.paid_price) as total_money_from_category from courses_categories left join course 
            on courses_categories.course_id = course. id right join invoice_detail on invoice_detail.course_id = course.id left join category 
            on courses_categories.category_id = category.id group by category_title;`;

        if (categoryMoneyCount)
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, categoryMoneyCount);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const statisticServices = {
    categoryCourseCount,
    courseCount,
    categoryEnrolledCount,
    categoryMoneyCount,
    moneyCalculation,
    userCount,
};
export default statisticServices;
