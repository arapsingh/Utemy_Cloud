import * as Yup from "yup";
import constants from "../constants";

export const changePasswordValidationSchema = Yup.object({
    current_password: Yup.string().trim().required(constants.error.ERROR_NEW_PASSWORD_REQUIRED),
    new_password: Yup.string()
        .trim()
        .min(8, constants.error.ERROR_PASSWORD_MIN)
        .max(32, constants.error.ERROR_NEW_PASSWORD_MAX)
        .required(constants.error.ERROR_NEW_PASSWORD_REQUIRED),
    confirm_password: Yup.string()
        .trim()
        .min(8, constants.error.ERROR_PASSWORD_MIN)
        .max(32, constants.error.ERROR_NEW_PASSWORD_MAX)
        .required(constants.error.ERROR_CONFIRM_PASSWORD_REQUIRED)
        .oneOf([Yup.ref("new_password")], constants.error.ERROR_CONFIRM_NEW_PASSWORD),
});

export const updateProfileValidationSchema = Yup.object({
    first_name: Yup.string()
        .trim()
        .max(32, constants.error.ERROR_FIRST_NAME_MAX)
        .required(constants.error.ERROR_FIRST_NAME_REQUIRED),
    last_name: Yup.string()
        .trim()
        .max(32, constants.error.ERROR_LAST_NAME_MAX)
        .required(constants.error.ERROR_LAST_NAME_REQUIRED),
    description: Yup.string()
        .trim()
        .min(8, constants.error.ERROR_DESCRIPTION_TOO_SHORT)
        .max(200, constants.error.ERROR_DESCRIPTION_TOO_MAX)
        .required(constants.error.ERROR_DESCRIPTION_REQUIRED),
});
