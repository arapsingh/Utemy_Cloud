import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { getHistoryInvoices, getInvoiceById } from "../../redux/slices/invoice.slice";
import TransactionCard from "../../components/Card/HistoryTransactionCard";

const HistoryTransaction = () => {
    const dispatch = useAppDispatch();
    const [searchInvoiceId, setSearchInvoiceId] = useState<number | string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchMode, setSearchMode] = useState(false);
    const [searchResult, setSearchResult] = useState<any[]>([]); // Dữ liệu kết quả tìm kiếm
    const historyTrans = useAppSelector((state) => state.invoiceSlice.invoices);
    useEffect(() => {
        // const newZoomValue = 0.6; // Đặt giá trị mong muốn

        // // Kiểm tra nếu trình duyệt hỗ trợ thuộc tính zoom
        // if ('zoom' in document.documentElement.style) {
        //   document.documentElement.style.zoom = `${newZoomValue}`;
        // }  
        if (!searchMode) {
            // Gọi API với trang hiện tại khi không ở chế độ tìm kiếm
            dispatch(
                getHistoryInvoices({
                    page_index: currentPage,
                    page_size: 10,
                    user_id: 0,
                    total_money: 0,
                    is_success: false,
                    created_at: "",
                    invoice_detail: [],
                    invoice_items: [],
                    invoice_id: 0,
                }),
            );
        }
    }, [dispatch, currentPage, searchMode]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleSearch = () => {
        if (searchInvoiceId !== "") {
            setSearchMode(true);
            // Gọi hàm dispatch để gửi request API tìm kiếm
            dispatch(getInvoiceById(Number(searchInvoiceId)))
                .then((response) => {
                    // Lưu kết quả tìm kiếm vào state
                    const data = response.payload?.data;
                    // const dataArray = data ? [data] : [];
                    console.log("data:", data);
                    setSearchResult(data ? [data] : []);
                })
                .catch((error) => {
                    // Xử lý khi có lỗi trong quá trình tìm kiếm
                    console.error("Error searching:", error);
                    setSearchResult([]); // Đặt state trở lại rỗng nếu có lỗi
                });
        } else {
            setSearchMode(false); // Set searchMode to false when the search input is empty
            setSearchResult([]); // Clear searchResult when the search input is empty
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md max-w-[800px] w-full">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl text-lightblue font-bold">Transaction History</h1>
                    <Link to="/" className="flex items-center">
                        <button className="text-white btn-info btn hover:bg-lightblue/60 focus:outline-none">
                            Back to Home
                        </button>
                    </Link>
                </div>
                <div className="mb-4">
                    <label htmlFor="invoiceId" className="text-lg font-semibold">
                        Search by Invoice ID:
                    </label>
                    <input
                        type="text"
                        id="invoiceId"
                        value={searchInvoiceId}
                        onChange={(e) => setSearchInvoiceId(e.target.value)}
                        className="border p-2 rounded mx-2"
                    />
                    <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded">
                        Search
                    </button>
                </div>
                <div>
                    {searchMode ? (
                        // Hiển thị kết quả tìm kiếm
                        <div>
                            {searchResult.length === 0 ? (
                                <p>No results found.</p>
                            ) : (
                                <div>
                                    <h2>Search Results:</h2>
                                    {searchResult.map((result) => (
                                        <TransactionCard key={result.id} historyTran={result} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        // Ẩn danh sách lịch sử giao dịch khi ở chế độ tìm kiếm
                        <div>
                            <h2>Transaction History:</h2>
                            {historyTrans.map((historyTran) => (
                                <TransactionCard key={historyTran.invoice_id} historyTran={historyTran} />
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-blue-500 text-white px-4 py-2 rounded-l"
                    >
                        Previous
                    </button>
                    <span className="mx-2 text-lg font-semibold bg-blue-500 text-white px-4 py-2 rounded">
                        {currentPage}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HistoryTransaction;
