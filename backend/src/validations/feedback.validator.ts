import Joi, { ObjectSchema } from "joi";
import constants from "../constants";

type createFeedback = {
    content: string;
};
const createFeedbackSchema: ObjectSchema<createFeedback> = Joi.object({
    content: Joi.string().trim().max(300).messages({
        "string.base": constants.error.ERROR_RATING_CONTENT_STRING,
        "string.max": constants.error.ERROR_RATING_CONTENT_MAX,
    }),
});

const feedbackSchema = {
    createFeedbackSchema,
};
export default feedbackSchema;
