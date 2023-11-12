import { IRequestWithId } from "../types/request";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";

const checkout = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const {
            vnp_Amount,
            vnp_BankCode,
            vnp_BankTranNo,
            vnp_CardType,
            vnp_OrderInfo, //Invoice invoice_id
            vnp_PayDate,
            vnp_ResponseCode,
            vnp_TmnCode,
            vnp_TransactionNo,
            vnp_TxnRef,
            vnp_SecureHashType,
            vnp_SecureHash,
        } = req.query;
        const orderInfo = vnp_OrderInfo?.toString() as string;
        const invoiceId = Number(orderInfo.split(" ")[1]);
        const isTransactionSuccess = vnp_ResponseCode === "00";
        if (isTransactionSuccess) {
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
            const clearCart = await configs.db.cartDetail.deleteMany({
                where: {
                    cart_id: cartDetail?.id,
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
                    vnp_secure_hash_type: vnp_SecureHashType as string,
                    vnp_secure_hash: vnp_SecureHash as string,
                },
            });
            if (invoiceDetail && clearCart && createTransactionData)
                return new ResponseSuccess(200, "Transaction success", true);
            else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        } else {
            return new ResponseError(500, "Transaction failed", false);
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const vnpayService = { checkout };
export default vnpayService;
