"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../common/response");
const common_1 = require("../common");
const configs_1 = __importDefault(require("../configs"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const nodemailer_config_1 = require("../configs/nodemailer.config");
const constants_1 = __importDefault(require("../constants"));
const login = async (req) => {
    try {
        const { email, password } = req.body;
        const isFoundUser = await configs_1.default.db.user.findFirst({
            where: {
                email: email,
                is_deleted: false,
            },
        });
        if (!isFoundUser) {
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_USER_NOT_FOUND, false);
        }
        const isUserPassword = await bcryptjs_1.default.compare(password, isFoundUser.password);
        if (!isUserPassword)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_WRONG_PASSWORD, false);
        if (!isFoundUser.is_verify) {
            const payload = {
                email: isFoundUser.email,
                id: isFoundUser.id,
            };
            const token = jsonwebtoken_1.default.sign(payload, configs_1.default.general.JWT_SECRET_KEY, {
                expiresIn: configs_1.default.general.TOKEN_ACCESS_EXPIRED_TIME,
            });
            const link = `${configs_1.default.general.DOMAIN_NAME}/verify-email/${token}`;
            const html = (0, nodemailer_config_1.setSignupEmail)(link);
            const mailOptions = {
                from: "Utemy",
                to: `${isFoundUser.email}`,
                subject: "Utemy - Verification email",
                text: "You recieved message from Utemy",
                html: html,
            };
            const isSendEmailSuccess = (0, common_1.sendMail)(mailOptions);
            if (isSendEmailSuccess) {
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CHECK_MAIL, true);
            }
            else {
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
            }
        }
        else {
            const accessToken = jsonwebtoken_1.default.sign({
                user_id: isFoundUser.id,
                is_admin: isFoundUser.is_admin,
            }, configs_1.default.general.JWT_SECRET_KEY, {
                expiresIn: configs_1.default.general.TOKEN_ACCESS_EXPIRED_TIME,
            });
            const refreshToken = jsonwebtoken_1.default.sign({
                user_id: isFoundUser.id,
                is_admin: isFoundUser.is_admin,
            }, configs_1.default.general.JWT_SECRET_KEY, {
                expiresIn: configs_1.default.general.TOKEN_REFRESH_EXPIRED_TIME,
            });
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_LOGIN, true, {
                accessToken,
                refreshToken,
            });
        }
    }
    catch (error) {
        console.log(error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const refreshAccessToken = async (req) => {
    try {
        const refreshTokenRaw = req.headers.rftoken;
        const refreshToken = refreshTokenRaw.split(" ")[1];
        if (!refreshToken)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        const isVerifyRefreshToken = jsonwebtoken_1.default.verify(refreshToken, configs_1.default.general.JWT_SECRET_KEY);
        if (isVerifyRefreshToken) {
            const newAccessToken = jsonwebtoken_1.default.sign({
                user_id: isVerifyRefreshToken.user_id,
                is_admin: isVerifyRefreshToken.is_admin,
            }, configs_1.default.general.JWT_SECRET_KEY, {
                expiresIn: configs_1.default.general.TOKEN_ACCESS_EXPIRED_TIME,
            });
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_REFRESH_TOKEN, true, {
                accessToken: newAccessToken,
            });
        }
        else {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_TOKEN, false);
        }
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_LOGIN_AGAIN, false);
        }
        else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_LOGIN_AGAIN, false);
        }
        else if (error instanceof jsonwebtoken_1.NotBeforeError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_LOGIN_AGAIN, false);
        }
        return new response_1.ResponseError(400, error, false);
    }
};
const signup = async (req) => {
    try {
        const { first_name, last_name, email, password, confirm_password } = req.body;
        if (password !== confirm_password)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_CONFIRM_PASSWORD, false);
        const isExistUser = await configs_1.default.db.user.findUnique({
            where: {
                email,
            },
        });
        if (isExistUser) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_EMAIL_USED, false);
        }
        else {
            const hashedPassword = await bcryptjs_1.default.hash(password, configs_1.default.general.HASH_SALT);
            const createUser = await configs_1.default.db.user.create({
                data: {
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                },
            });
            if (createUser) {
                const payload = {
                    email: createUser.email,
                    id: createUser.id,
                };
                const token = jsonwebtoken_1.default.sign(payload, configs_1.default.general.JWT_SECRET_KEY, {
                    expiresIn: configs_1.default.general.TOKEN_ACCESS_EXPIRED_TIME,
                });
                const link = `${configs_1.default.general.DOMAIN_NAME}/verify-email/${token}`;
                const html = (0, nodemailer_config_1.setSignupEmail)(link);
                const mailOptions = {
                    from: "Utemy",
                    to: `${createUser.email}`,
                    subject: "Utemy - Verification email",
                    text: "You recieved message from Utemy",
                    html: html,
                };
                const isSendEmailSuccess = (0, common_1.sendMail)(mailOptions);
                if (isSendEmailSuccess) {
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_SIGNUP, true);
                }
                else {
                    return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                }
            }
            else {
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    }
    catch (error) {
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const resendVerifyEmail = async (req) => {
    try {
        console.log("verify");
        const { email } = req.body;
        const isExistUser = await configs_1.default.db.user.findUnique({
            where: {
                email,
            },
        });
        if (!isExistUser) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_USER_NOT_FOUND, false);
        }
        else {
            const payload = {
                email: isExistUser.email,
                id: isExistUser.id,
            };
            const token = jsonwebtoken_1.default.sign(payload, configs_1.default.general.JWT_SECRET_KEY, {
                expiresIn: configs_1.default.general.TOKEN_ACCESS_EXPIRED_TIME,
            });
            const link = `${configs_1.default.general.DOMAIN_NAME}/verify-email/${token}`;
            const html = (0, nodemailer_config_1.setSignupEmail)(link);
            const mailOptions = {
                from: "Utemy",
                to: `${isExistUser.email}`,
                subject: "Utemy - Verification email",
                text: "You recieved message from Utemy",
                html: html,
            };
            const isSendEmailSuccess = (0, common_1.sendMail)(mailOptions);
            if (isSendEmailSuccess) {
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CHECK_MAIL, true);
            }
            else {
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    }
    catch (error) {
        console.log("verify", error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const verifyEmail = async (req) => {
    try {
        const { token } = req.params;
        const isVerifyToken = jsonwebtoken_1.default.verify(token, configs_1.default.general.JWT_SECRET_KEY);
        if (isVerifyToken) {
            const user = await configs_1.default.db.user.findUnique({
                where: {
                    email: isVerifyToken.email,
                },
            });
            if (user?.is_verify) {
                return new response_1.ResponseError(400, constants_1.default.error.ERROR_ALREADY_VERIFY, false);
            }
            else {
                const verifyUser = await configs_1.default.db.user.update({
                    where: {
                        email: user?.email,
                    },
                    data: {
                        is_verify: true,
                    },
                });
                if (verifyUser) {
                    const createCart = await configs_1.default.db.cart.create({
                        data: {
                            user_id: verifyUser.id,
                        },
                    });
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_VERIFY_EMAIL, true);
                }
                else {
                    return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        }
        else {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_TOKEN, false);
        }
    }
    catch (error) {
        console.log(error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const forgotPassword = async (req) => {
    try {
        const { email } = req.body;
        const user = await configs_1.default.db.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_USER_NOT_FOUND, false);
        }
        else {
            const payload = {
                email: user.email,
                id: user.id,
            };
            const token = jsonwebtoken_1.default.sign(payload, configs_1.default.general.JWT_SECRET_KEY, {
                expiresIn: configs_1.default.general.TOKEN_ACCESS_EXPIRED_TIME,
            });
            const link = `${configs_1.default.general.DOMAIN_NAME}/reset-password/${token}`;
            const html = (0, nodemailer_config_1.setResetEmail)(link);
            const mailOptions = {
                from: "Utemy",
                to: `${user.email}`,
                subject: "Utemy - Reset password email",
                text: "You recieved message from Utemy",
                html: html,
            };
            const isSendEmailSuccess = (0, common_1.sendMail)(mailOptions);
            if (isSendEmailSuccess) {
                const asignToken = await configs_1.default.db.user.update({
                    where: {
                        email,
                    },
                    data: {
                        token,
                    },
                });
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_FORGOT_PASSWORD, true);
            }
            else {
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    }
    catch (error) {
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const resendForgotPasswordEmail = async (req) => {
    try {
        const { email } = req.body;
        const user = await configs_1.default.db.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_USER_NOT_FOUND, false);
        }
        else {
            const payload = {
                email: user.email,
                id: user.id,
            };
            const token = jsonwebtoken_1.default.sign(payload, configs_1.default.general.JWT_SECRET_KEY, {
                expiresIn: configs_1.default.general.TOKEN_ACCESS_EXPIRED_TIME,
            });
            const link = `${configs_1.default.general.DOMAIN_NAME}/reset-password/${token}`;
            const html = (0, nodemailer_config_1.setResetEmail)(link);
            const mailOptions = {
                from: "Utemy",
                to: `${user.email}`,
                subject: "Utemy - Reset password email",
                text: "You recieved message from Utemy",
                html: html,
            };
            const isSendEmailSuccess = (0, common_1.sendMail)(mailOptions);
            if (isSendEmailSuccess) {
                const asignToken = await configs_1.default.db.user.update({
                    where: {
                        email,
                    },
                    data: {
                        token,
                    },
                });
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_FORGOT_PASSWORD, true);
            }
            else {
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    }
    catch (error) {
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const resetPassword = async (req) => {
    try {
        const { new_password, confirm_password, token } = req.body;
        const isVerifyToken = jsonwebtoken_1.default.verify(token, configs_1.default.general.JWT_SECRET_KEY);
        if (!isVerifyToken) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_TOKEN, false);
        }
        else {
            const hashedPassword = await bcryptjs_1.default.hash(new_password, configs_1.default.general.HASH_SALT);
            if (hashedPassword) {
                const isFoundUser = await configs_1.default.db.user.findUnique({
                    where: {
                        email: isVerifyToken.email,
                    },
                });
                if (!isFoundUser)
                    return new response_1.ResponseError(404, constants_1.default.error.ERROR_USER_NOT_FOUND, false);
                else if (isFoundUser.token === token) {
                    const changePassword = await configs_1.default.db.user.update({
                        where: {
                            email: isFoundUser.email,
                        },
                        data: {
                            password: hashedPassword,
                            token: null,
                        },
                    });
                    if (changePassword) {
                        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_RESET_PASSWORD, true);
                    }
                    else {
                        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                    }
                }
                else {
                    return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_TOKEN, false);
                }
            }
            else {
                console.log("fail");
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    }
    catch (error) {
        console.log(error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const changePassword = async (req) => {
    try {
        const { current_password, new_password, confirm_password } = req.body;
        const id = req.user_id;
        const isFoundUser = await configs_1.default.db.user.findUnique({
            where: {
                id,
            },
        });
        if (!isFoundUser) {
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_USER_NOT_FOUND, false);
        }
        else {
            const isOldPasswordValid = await bcryptjs_1.default.compare(current_password, isFoundUser.password);
            if (isOldPasswordValid) {
                const hashedNewPassword = await bcryptjs_1.default.hash(new_password, configs_1.default.general.HASH_SALT);
                const changePassword = await configs_1.default.db.user.update({
                    where: {
                        id,
                    },
                    data: {
                        password: hashedNewPassword,
                    },
                });
                if (changePassword) {
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CHANGE_PASSWORD, true);
                }
                else {
                    return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                }
            }
            else {
                return new response_1.ResponseError(400, constants_1.default.error.ERROR_WRONG_CURRENT_PASSWORD, false);
            }
        }
    }
    catch (error) {
        console.log(error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getMe = async (req) => {
    try {
        const id = req.user_id;
        const isFoundUser = await configs_1.default.db.user.findUnique({
            where: {
                id,
            },
        });
        if (isFoundUser) {
            const userInformation = {
                user_id: isFoundUser.id,
                email: isFoundUser.email,
                first_name: isFoundUser.first_name,
                last_name: isFoundUser.last_name,
                url_avatar: isFoundUser.url_avatar,
                description: isFoundUser.description,
                is_admin: isFoundUser.is_admin,
            };
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_REQUEST, true, userInformation);
        }
        else {
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_USER_NOT_FOUND, false);
        }
    }
    catch (error) {
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const AuthServices = {
    login,
    refreshAccessToken,
    signup,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    getMe,
    resendVerifyEmail,
    resendForgotPasswordEmail,
};
exports.default = AuthServices;
