const error = {
    //etc
    ERROR_INTERNAL_SERVER: "Internal server",
    ERROR_BAD_REQUEST: " Bad request",
    ERROR_UNAUTHORZIED: "Unauthorized",
    ERROR_MISSING_REQUEST_BODY: "Missing request body",
    ERROR_VALIDATION_FAILED: "Validation failed",
    ERROR_UNAUTHORIZED: "Unauthorized",
    //confirm password
    ERROR_CONFIRM_PASSWORD: "Confirm password and password must be the same",
    ERROR_CONFIRM_NEW_PASSWORD: "Confirm password and new password must be the same",
    ERROR_CONFIRM_PASSWORD_REQUIRED: "Confirm password is required",
    //email
    ERROR_EMAIL_USED: "Email is already used",
    ERROR_ALREADY_VERIFY: "Email is already verified",
    ERROR_EMAIL_STRING: "Email must be a string",
    ERROR_EMAIL_REQUIRED: "Email is required",
    ERROR_EMAIL_FORMAT: "Email is wrong format, Ex: example@gmail.com",
    ERROR_EMAIL_MAX: "Email must be under 50 chars",
    //password
    ERROR_PASSWORD_STRING: "Password must be string",
    ERROR_PASSWORD_REQUIRED: "Password is required",
    ERROR_PASSWORD_MAX: "Password must be under 20 chars",
    ERROR_PASSWORD_MIN: "Password must be more than 20 chars",
    ERROR_WRONG_PASSWORD: "Wrong password",
    // current passsword
    ERROR_CURRENT_PASSWORD_STRING: "Current password must be string",
    ERROR_CURRENT_PASSWORD_REQUIRED: "Current password is required",
    ERROR_CURRENT_PASSWORD_MAX: "Current password must be under 20 chars",
    ERROR_CURRENT_PASSWORD_MIN: "Current password must be more than 20 chars",
    ERROR_WRONG_CURRENT_PASSWORD: "Wrong current password",
    //new password
    ERROR_NEW_PASSWORD_STRING: "New password must be string",
    ERROR_NEW_PASSWORD_REQUIRED: "New password is required",
    ERROR_NEW_PASSWORD_MAX: "New password must be under 20 chars",
    ERROR_NEW_PASSWORD_MIN: "New password must be more than 20 chars",
    //token
    ERROR_BAD_TOKEN: "Bad token",
    ERROR_TOKEN_STRING: "Token must be a string",
    ERROR_TOKEN_REQUIRED: "Token is requried",
    //first name
    ERROR_FIRST_NAME_STRING: "First name must be string",
    ERROR_FIRST_NAME_REQURIED: "First name is requrie",
    ERROR_FIRST_NAME_MAX: "First name must be under 30 chars",
    //last name
    ERROR_LAST_NAME_STRING: "Last name must be string",
    ERROR_LAST_NAME_REQURIED: "Last name is requried",
    ERROR_LAST_NAME_MAX: "Last name must be under 30 chars",
    //user
    ERROR_USER_NOT_FOUND: "Wrong email or user doesn't exist",
    //category
    ERROR_CATEGORY_NOT_FOUND: "Category doesn't exist",
    //lesson
    ERROR_LESSON_NOT_FOUND: "Lesson doesn't exist",

    //description
    ERROR_DESCRIPTION_STRING: "Description must be string",
    ERROR_DESCRIPTION_REQUIRED: "Description is required",
    ERROR_DESCRIPTION_TOO_MAX: "Description is too long",
    ERROR_DESCRIPTION_TOO_SHORT: "Description is too short",

    //course
    ERROR_COURSE_NOT_FOUND: "Course not found",
    ERROR_COURSE_TITLE_REQUIRED: "Course's title is required",
    ERROR_COURSE_TITLE_STRING: "Course's title must be string",
    ERROR_COURSE_TITLE_TOO_LONG: "Course's title is too long",
    ERROR_COURSE_ID_REQUIRED: "Course's ID is required",
    ERROR_COURSE_ID_NUMBER: "Course's ID must be a number",
    ERROR_COURSE_ID_INTEGER: "Course's ID must be integer",
    ERROR_COURSE_SLUG_REQUIRED: "Course's slug is required",
    ERROR_COURSE_SLUG_STRING: "Course's slug must be string",
    ERROR_COURSE_SLUG_MALFORMED: "Course's slug is malformed",
    ERROR_COURSE_STATUS_REQUIRED: "Course's status is required",
    ERROR_COURSE_STATUS_BOOLEAN: "Course's status must be boolean",
    ERROR_COURSE_DESCRIPTION_REQUIRED: "Course's description is required",
    ERROR_COURSE_DESCRIPTION_STRING: "Course's description must be string",
    ERROR_COURSE_SUMMARY_REQUIRED: "Course's summary is required",
    ERROR_COURSE_SUMMARY_STRING: "Course's summary must be string",
    ERROR_COURSE_CATEGORIES_REQUIRED: "Course's categories is required",
    ERROR_COURSE_THUMBNAIL_REQUIRED: "Course's thumbnail is required",
    ERROR_COURSE_PRICE_REQUIRED: "Price is required",
    ERROR_COURSE_PRICE_NUMBER: "Price must be number",
    ERROR_CREATE_COURSE_FAILED: "Create course failed",

    //section
    ERROR_SECTION_NOT_FOUND: "Section not found",
    ERROR_SECTION_ID_REQUIRED: "Section's ID is required",
    ERROR_SECTION_ID_NUMBER: "Section's ID must be a number",
    ERROR_SECTION_ID_INTEGER: "Section's ID must be integer",
};
export default error;
