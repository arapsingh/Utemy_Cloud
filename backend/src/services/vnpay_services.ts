import { IRequestWithId } from "../types/request";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { vnpayParams } from "../types/vnpay.type";
import crypto from "crypto";
import moment from "moment";
import qs from "qs";
import sortObject from "sort-object";
import { create } from "domain";

const vnpayIpn = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const {
            vnp_Amount,
            vnp_BankCode,
            vnp_CardType,
            vnp_BankTranNo,
            vnp_OrderInfo,
            vnp_PayDate,
            vnp_ResponseCode,
            vnp_TmnCode,
            vnp_TransactionNo,
            vnp_TransactionStatus,
            vnp_TxnRef,
        } = req.body;

        const orderInfo = vnp_OrderInfo?.toString() as string;
        const invoiceId = Number(orderInfo.split(":")[1]);
        console.log(invoiceId);
        const isTransactionSuccess = vnp_ResponseCode === "00" && vnp_TransactionStatus === "00";
        if (isTransactionSuccess) {
            const isInvoiceExist = await configs.db.invoice.findFirst({
                where: {
                    id: invoiceId,
                    is_success: false,
                },
            });
            if (!isInvoiceExist) return new ResponseError(404, "Invoice not found", false);
            const invoiceDetail = await configs.db.invoice.update({
                where: {
                    id: invoiceId,
                },
                data: {
                    is_success: true,
                },
            });
            const cartDetail = await configs.db.cart.findFirst({
                where: {
                    user_id: invoiceDetail?.user_id,
                },
            });
            if (!cartDetail) return new ResponseError(404, "Cart not found", false);
            const boughtCourses = await configs.db.cartDetail.findMany({
                where: {
                    cart_id: cartDetail.id,
                    saved_for_later: false,
                },
            });
            const createEnrolledData = boughtCourses.map((course) => {
                const temp = {
                    user_id: invoiceDetail.user_id,
                    course_id: course.course_id,
                };
                return temp;
            });
            const createEnrolled = await configs.db.enrolled.createMany({
                data: createEnrolledData,
            });
            const clearCart = await configs.db.cartDetail.deleteMany({
                where: {
                    cart_id: cartDetail.id,
                    saved_for_later: false,
                },
            });

            const createTransactionData = await configs.db.transaction.create({
                data: {
                    invoice_id: invoiceId,
                    vnp_amount: Number(vnp_Amount),
                    vnp_bank_code: vnp_BankCode as string,
                    vnp_bank_tran_no: vnp_BankTranNo as string,
                    vnp_card_type: vnp_CardType as string,
                    vnp_order_info: vnp_OrderInfo as string,
                    vnp_pay_date: vnp_PayDate as string,
                    vnp_response_code: vnp_ResponseCode as string,
                    vnp_tmn_code: vnp_TmnCode as string,
                    vnp_transaction_no: vnp_TransactionNo as string,
                    vnp_txn_ref: vnp_TxnRef as string,
                },
            });
            if (createEnrolled && clearCart && createTransactionData) {
                const data = { RspCode: "00", Message: "success" };
                return new ResponseSuccess(200, "Transaction success", true, data);
            } else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        } else {
            const data = { RspCode: "99", Message: "fail" };
            return new ResponseSuccess(200, "Transaction failed", false, data);
        }
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createPaymentUrl = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { invoice_id: invoiceId, amount, bank_code: bankCode, language } = req.body;
        const date = new Date();
        const createDate = moment(date).format("YYYYMMDDHHmmss");
        const expiredDate = moment(new Date(date.getTime() + 20 * 60 * 1000)).format("YYYYMMDDHHmmss");

        const ipAddr = "127.0.0.1";
        //     req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
        // // req.connection.socket.remoteAddress;
        // console.log("req ip", req.ip);
        // console.log("ipaddr", ipAddr);
        // ::1

        const tmnCode = encodeURIComponent(configs.general.vnp_TmnCode as string);
        const secretKey = configs.general.vnp_HashSecret;
        // console.log("secret", secretKey);
        let vnpUrl = configs.general.vnp_Url;
        const returnUrl = encodeURIComponent(configs.general.vnp_ReturnUrl as string);
        const orderId = moment(date).format("DDHHmmss");

        let locale = language;
        if (locale === null || locale === "") {
            locale = "vn";
        }
        const currCode = "VND";
        let vnp_Params: vnpayParams = {
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
        vnp_Params["vnp_TmnCode"] = tmnCode as string;
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
        vnp_Params = sortObject(vnp_Params);
        // console.log("params ", typeof vnp_Params, vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        // console.log("sign data", typeof signData, signData);
        console.log(typeof secretKey, secretKey);
        const hmac = crypto.createHmac("sha512", secretKey as string);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        // console.log("params update????", typeof vnp_Params, vnp_Params);
        vnpUrl += "?" + qs.stringify(vnp_Params, { encode: false });
        // console.log("url", typeof vnpUrl, vnpUrl);
        return new ResponseSuccess(200, constants.success.SUCCESS_REQUEST, true, vnpUrl);
    } catch (error) {
        console.log("err", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const vnpayService = { vnpayIpn, createPaymentUrl };
export default vnpayService;
