"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const helper_1 = require("../utils/helper");
const sendCertifier = async (req) => {
    const userId = req.user_id;
    const courseId = Number(req.body.course_id);
    const isCourseExist = await configs_1.default.db.course.findFirst({
        where: {
            id: courseId,
            is_delete: false,
        },
        include: {
            user: true,
        },
    });
    if (!isCourseExist)
        return new response_1.ResponseError(404, constants_1.default.error.ERROR_COURSE_NOT_FOUND, false);
    const isUserExist = await configs_1.default.db.user.findFirst({
        where: {
            id: userId,
            is_deleted: false,
        },
    });
    if (!isUserExist)
        return new response_1.ResponseError(404, constants_1.default.error.ERROR_USER_NOT_FOUND, false);
    //check enrolled
    const isEnrolled = await configs_1.default.db.enrolled.findFirst({
        where: {
            course_id: courseId,
            user_id: userId,
            is_done: true,
            is_pass: false,
        },
    });
    if (!isEnrolled)
        return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
    const apiCaller = configs_1.default.apiCaller;
    const getGroups = await apiCaller("GET", "groups");
    const groupId = getGroups.data.data[0].id;
    const date = (0, helper_1.convertDateForCertifer)(new Date());
    const email = isUserExist.email;
    const name = isUserExist.first_name + " " + isUserExist.last_name;
    const mentor = isCourseExist.user.first_name + " " + isCourseExist.user.last_name;
    const courseName = isCourseExist.title;
    const data = {
        recipient: { name, email },
        issueDate: date.issueDate,
        expiryDate: date.expiryDate,
        customAttributes: { "custom.mentor": mentor, "custom.course_name": courseName },
        groupId,
    };
    const createCertificate = await apiCaller("POST", "credentials", data);
    if (createCertificate.status > 299 || createCertificate.status < 200) {
        console.log("error created", createCertificate.data.error.message);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    const uniqueId = createCertificate.data.id;
    const publicId = createCertificate.data.publicId;
    const publishCertificate = await apiCaller("POST", `credentials/${uniqueId}/issue`);
    if (publishCertificate.status > 299 || publishCertificate.status < 200) {
        console.log("error created", publishCertificate.data.error.message);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    const sendCertifier = await apiCaller("POST", `credentials/${uniqueId}/send`, { deliveryMethod: "email" });
    if (sendCertifier.status > 299 || sendCertifier.status < 200) {
        console.log("error created", sendCertifier.data.error.message);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    const storeCertificate = await configs_1.default.db.certificate.create({
        data: {
            id: uniqueId,
            public_id: publicId,
            recipient_id: userId,
            course_id: courseId,
            group_id: groupId,
            status: "issued",
        },
    });
    const checkDoneEnrolled = await configs_1.default.db.enrolled.update({
        where: {
            id: isEnrolled.id,
        },
        data: {
            is_done: true,
        },
    });
    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DATA, true, { public_id: publicId });
};
const CertifierServices = {
    sendCertifier,
};
exports.default = CertifierServices;
