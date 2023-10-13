import Joi, { ObjectSchema } from "joi";
import constants from "../utils/constants";

type enrolledCourse = {
    course_id: number;
};
export const enrolledCourseSchema: ObjectSchema<enrolledCourse> = Joi.object({
    course_id: Joi.number().required().messages({
        "number.base": constants.ERROR_COURSE_ID_NUMBER,
        "any.required": constants.ERROR_COURSE_ID_REQUIRED,
    }),
});

type CreateCourse = {
    title: string;
    slug: string;
    summary: string;
    description: string;
    // thumbnail: Express.Multer.File;
    categories: Array<number>;
    status: boolean;
    price: number;
};

export const createCourseSchema: ObjectSchema<CreateCourse> = Joi.object({
    title: Joi.string().trim().required().messages({
        "any.required": constants.ERROR_COURSE_TITLE_REQUIRED,
        "string.base": constants.ERROR_COURSE_TITLE_STRING,
    }),
    slug: Joi.string()
        .trim()
        .required()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .messages({
            "any.required": constants.ERROR_COURSE_SLUG_REQUIRED,
            "string.base": constants.ERROR_COURSE_SLUG_STRING,
            "string.regex": constants.ERROR_COURSE_SLUG_MALFORMED,
        }),

    status: Joi.required().messages({
        "any.required": constants.ERROR_COURSE_STATUS_REQUIRED,

        "bool.base": constants.ERROR_COURSE_STATUS_BOOLEAN,
    }),

    description: Joi.string().trim().required().messages({
        "any.required": constants.ERROR_COURSE_DESCRIPTION_REQUIRED,
        "string.base": constants.ERROR_COURSE_DESCRIPTION_STRING,
    }),

    summary: Joi.string().trim().required().messages({
        "any.required": constants.ERROR_COURSE_SUMMARY_REQUIRED,
        "string.base": constants.ERROR_COURSE_SUMMARY_STRING,
    }),

    categories: Joi.array<number[]>().required().messages({
        "any.required": constants.ERROR_COURSE_CATEGORIES_REQUIRED,
    }),

    thumbnail: Joi.required().messages({
        "any.required": constants.ERROR_COURSE_THUMBNAIL_REQUIRED,
    }),

    price: Joi.required().messages({
        "any.required": constants.ERROR_COURSE_PRICE_REQUIRED,
        "number.base": constants.ERROR_COURSE_PRICE_NUMBER,
    }),
});

type UpdateCourse = {
    //id: number;
    title: string;
    slug: string;
    summary: string;
    description: string;
    thumbnail: Express.Multer.File;
    categories: Array<number>;
    status: boolean;
    price: number;
};

export const updateCourseSchema: ObjectSchema<UpdateCourse> = Joi.object({
    course_id: Joi.number(),
    title: Joi.string().trim().required().messages({
        "any.required": constants.ERROR_COURSE_TITLE_REQUIRED,
        "string.base": constants.ERROR_COURSE_TITLE_REQUIRED,
    }),
    slug: Joi.string().trim().required().messages({
        "any.required": constants.ERROR_COURSE_SLUG_REQUIRED,
        "string.base": constants.ERROR_COURSE_SLUG_STRING,
        "string.regex": constants.ERROR_COURSE_SLUG_MALFORMED,
    }),

    status: Joi.required().messages({
        "any.required": constants.ERROR_COURSE_STATUS_REQUIRED,
    }),

    description: Joi.string().trim().required().messages({
        "any.required": constants.ERROR_COURSE_DESCRIPTION_REQUIRED,
        "string.base": constants.ERROR_COURSE_DESCRIPTION_STRING,
    }),

    summary: Joi.string().trim().required().messages({
        "any.required": constants.ERROR_COURSE_SUMMARY_REQUIRED,
        "string.base": constants.ERROR_COURSE_SUMMARY_STRING,
    }),

    categories: Joi.array<number[]>().required().messages({
        "any.required": constants.ERROR_COURSE_CATEGORIES_REQUIRED,
    }),

    thumbnail: Joi.string(),
    price: Joi.required().messages({
        "any.required": constants.ERROR_COURSE_PRICE_REQUIRED,
        "number.base": constants.ERROR_COURSE_PRICE_NUMBER,
    }),
});

const courseSchema = {
    enrolledCourseSchema,
    createCourseSchema,
    updateCourseSchema,
};
export default courseSchema;
