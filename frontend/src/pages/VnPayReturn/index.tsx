import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useQueryParams from "../../hooks/useQueryParams";
import { useAppDispatch } from "../../hooks/hooks";
import { vnpayActions } from "../../redux/slices";

const VnPayReturn = () => {
    const dispatch = useAppDispatch();
    const {
        vnp_Amount,
        vnp_BankCode,
        vnp_BankTranNo,
        vnp_CardType,
        vnp_OrderInfo,
        vnp_PayDate,
        vnp_ResponseCode,
        vnp_TmnCode,
        vnp_TransactionNo,
        vnp_TransactionStatus,
        vnp_TxnRef,
    } = useQueryParams();
    const data = {
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
    };
    useEffect(() => {
        dispatch(vnpayActions.vnpayIpn(data));
    });
    const success = vnp_ResponseCode === "00" && vnp_TransactionStatus === "00";
    const invoiceId = vnp_OrderInfo.split(":")[1];
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md max-w-[500px] w-full">
                <h1 className="text-3xl text-lightblue font-bold mb-4">
                    {success ? "Payment Successful" : "Payment Failed"}
                </h1>
                <h2 className="text-2xl font-bold mb-4">Order Info</h2>
                <p>Invoice ID: {invoiceId}</p>
                <p>Total money: đ{(vnp_Amount / 100).toLocaleString()}</p>
                <p>Pay date: {vnp_PayDate}</p>
                {success ? (
                    <p className="text-gray-600 mb-6">Thank you for your payment. Your transaction was successful.</p>
                ) : (
                    <p className="text-gray-600 mb-6">
                        Oops! Something went wrong with your payment. Please try again later.
                    </p>
                )}

                <Link className="flex flex-col items-center justify-center" to="/">
                    <button className="  text-white btn-info btn hover:bg-lightblue/60 focus:outline-none">
                        Back to Home
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default VnPayReturn;
