"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const crypto_1 = __importDefault(require("crypto"));
const moment_1 = __importDefault(require("moment"));
const qs_1 = __importDefault(require("qs"));
const sort_object_1 = __importDefault(require("sort-object"));
const vnpayIpn = async (req) => {
    try {
        const { vnp_Amount, vnp_BankCode, vnp_CardType, vnp_BankTranNo, vnp_OrderInfo, vnp_PayDate, vnp_ResponseCode, vnp_TmnCode, vnp_TransactionNo, vnp_TransactionStatus, vnp_TxnRef, } = req.body;
        const orderInfo = vnp_OrderInfo?.toString();
        const invoiceId = Number(orderInfo.split(":")[1]);
        console.log(invoiceId);
        const isTransactionSuccess = vnp_ResponseCode === "00" && vnp_TransactionStatus === "00";
        if (isTransactionSuccess) {
            const isInvoiceExist = await configs_1.default.db.invoice.findFirst({
                where: {
                    id: invoiceId,
                    is_success: false,
                },
            });
            if (!isInvoiceExist)
                return new response_1.ResponseError(404, "Invoice not found", false);
            const invoiceDetail = await configs_1.default.db.invoice.update({
                where: {
                    id: invoiceId,
                },
                data: {
                    is_success: true,
                },
            });
            const cartDetail = await configs_1.default.db.cart.findFirst({
                where: {
                    user_id: invoiceDetail?.user_id,
                },
            });
            if (!cartDetail)
                return new response_1.ResponseError(404, "Cart not found", false);
            const boughtCourses = await configs_1.default.db.cartDetail.findMany({
                where: {
                    cart_id: cartDetail.id,
                    saved_for_later: false,
                },
                include: {
                    course: {
                        select: {
                            id: true,
                            number_of_enrolled: true,
                        },
                    },
                },
            });
            const createEnrolledData = boughtCourses.map((course) => {
                const temp = {
                    user_id: invoiceDetail.user_id,
                    course_id: course.course_id,
                };
                return temp;
            });
            // console.log("create enrolled data", createEnrolledData);
            const updateCourseEnrolledData = boughtCourses.map((course) => {
                return course.course_id;
            });
            // console.log("update data", updateCourseEnrolledData);
            const createEnrolled = await configs_1.default.db.enrolled.createMany({
                data: createEnrolledData,
            });
            // console.log("createEnrolled", createEnrolled);
            const updateCourseEnrolled = await configs_1.default.db.course.updateMany({
                where: {
                    id: {
                        in: updateCourseEnrolledData,
                    },
                },
                data: {
                    number_of_enrolled: {
                        increment: 1,
                    },
                },
            });
            // console.log("update enrolled", updateCourseEnrolled);
            const clearCart = await configs_1.default.db.cartDetail.deleteMany({
                where: {
                    cart_id: cartDetail.id,
                    saved_for_later: false,
                },
            });
            const createTransactionData = await configs_1.default.db.transaction.create({
                data: {
                    invoice_id: invoiceId,
                    vnp_amount: Number(vnp_Amount),
                    vnp_bank_code: vnp_BankCode,
                    vnp_bank_tran_no: vnp_BankTranNo,
                    vnp_card_type: vnp_CardType,
                    vnp_order_info: vnp_OrderInfo,
                    vnp_pay_date: vnp_PayDate,
                    vnp_response_code: vnp_ResponseCode,
                    vnp_tmn_code: vnp_TmnCode,
                    vnp_transaction_no: vnp_TransactionNo,
                    vnp_txn_ref: vnp_TxnRef,
                },
            });
            if (createEnrolled && clearCart && createTransactionData) {
                const data = { RspCode: "00", Message: "success" };
                return new response_1.ResponseSuccess(200, "Transaction success", true, data);
            }
            else
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
        else {
            const data = { RspCode: "99", Message: "fail" };
            return new response_1.ResponseSuccess(200, "Transaction failed", false, data);
        }
    }
    catch (error) {
        console.log(error);
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createPaymentUrl = async (req) => {
    try {
        const { invoice_id: invoiceId, amount, bank_code: bankCode, language } = req.body;
        const date = new Date();
        const createDate = (0, moment_1.default)(date).format("YYYYMMDDHHmmss");
        const expiredDate = (0, moment_1.default)(new Date(date.getTime() + 20 * 60 * 1000)).format("YYYYMMDDHHmmss");
        const ipAddr = "127.0.0.1";
        //     req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
        // // req.connection.socket.remoteAddress;
        // console.log("req ip", req.ip);
        // console.log("ipaddr", ipAddr);
        // ::1
        const tmnCode = encodeURIComponent(configs_1.default.general.vnp_TmnCode);
        const secretKey = configs_1.default.general.vnp_HashSecret;
        // console.log("secret", secretKey);
        let vnpUrl = configs_1.default.general.vnp_Url;
        const returnUrl = encodeURIComponent(configs_1.default.general.vnp_ReturnUrl);
        const orderId = (0, moment_1.default)(date).format("DDHHmmss");
        let locale = language;
        if (locale === null || locale === "") {
            locale = "vn";
        }
        const currCode = "VND";
        let vnp_Params = {
            vnp_Version: "",
            vnp_Command: "",
            vnp_TmnCode: "",
            vnp_Locale: "",
            vnp_CurrCode: "",
            vnp_TxnRef: "",
            vnp_OrderInfo: "",
            vnp_OrderType: "",
            vnp_Amount: 0,
            vnp_ReturnUrl: "",
            vnp_IpAddr: "",
            vnp_CreateDate: "",
            // vnp_BankCode: "NCB",
            // vnp_ExpireDate: "",
        };
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = orderId;
        vnp_Params["vnp_OrderInfo"] = encodeURIComponent(`Invoice:${invoiceId}`);
        vnp_Params["vnp_OrderType"] = "other";
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;
        // vnp_Params["vnp_ExpireDate"] = expiredDate;
        if (bankCode !== null && bankCode !== "") {
            vnp_Params["vnp_BankCode"] = bankCode;
        }
        vnp_Params = (0, sort_object_1.default)(vnp_Params);
        // console.log("params ", typeof vnp_Params, vnp_Params);
        const signData = qs_1.default.stringify(vnp_Params, { encode: false });
        // console.log("sign data", typeof signData, signData);
        // console.log(typeof secretKey, secretKey);
        const hmac = crypto_1.default.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        // console.log("params update????", typeof vnp_Params, vnp_Params);
        vnpUrl += "?" + qs_1.default.stringify(vnp_Params, { encode: false });
        // console.log("url", typeof vnpUrl, vnpUrl);
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_REQUEST, true, vnpUrl);
    }
    catch (error) {
        // console.log("err", error);
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const vnpayService = { vnpayIpn, createPaymentUrl };
exports.default = vnpayService;
