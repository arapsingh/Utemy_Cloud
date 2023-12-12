import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useQueryParams from "../../hooks/useQueryParams";
import { useAppDispatch } from "../../hooks/hooks";
import { vnpayActions, cartActions } from "../../redux/slices";
import { FaceSmileIcon, FaceFrownIcon } from "@heroicons/react/24/outline";

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
        const newZoomValue = 0.6; // Đặt giá trị mong muốn

        // Kiểm tra nếu trình duyệt hỗ trợ thuộc tính zoom
        if ('zoom' in document.documentElement.style) {
          document.documentElement.style.zoom = `${newZoomValue}`;
        }       
        dispatch(vnpayActions.vnpayIpn(data)).then((response) => {
            if (response.payload?.status_code === 200) dispatch(cartActions.getAllCart());
        });
    }, [dispatch]);
    const success = vnp_ResponseCode === "00" && vnp_TransactionStatus === "00";
    const invoiceId = vnp_OrderInfo.split(":")[1];
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md max-w-[500px] w-full">
                <div className="flex gap-2 ">
                    <h1 className={`text-3xl ${success ? "text-lightblue" : "text-error"} font-bold mb-4`}>
                        {success ? "Payment Successful" : "Payment Failed"}
                    </h1>
                    {success ? (
                        <FaceSmileIcon className="w-8 h-8 text-lightblue" />
                    ) : (
                        <FaceFrownIcon className="w-8 h-8 text-error " />
                    )}
                </div>

                <h2 className="text-2xl font-bold mb-4 text-black">Thông tin đơn hàng</h2>
                <p className="text-black">Mã hóa đơn: {invoiceId}</p>
                <p className="text-black">Tổng số tiền: {(vnp_Amount / 100).toLocaleString()}đ</p>
                <p className="text-black">Mã ngày thanh toán: {vnp_PayDate}</p>
                {success ? (
                    <p className="text-black mb-6">
                        Cảm ơn vì đã tin tưởng Utemy, giao dịch của bạn đã thành công, chúc bạn học tập vui vẻ
                    </p>
                ) : (
                    <p className="text-black mb-6">
                        Có vẻ đã có vấn đề với giao dịch của bạn. Vui lòng liên hệ với ngân hàng và thử lại sau
                    </p>
                )}

                <Link to="/history-transaction" className="flex flex-col items-center justify-center">
                    <button className="text-white btn-info btn hover:bg-lightblue/60 focus:outline-none">
                        Trở về trang lịch sử giao dịch
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default VnPayReturn;
