import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { feedbackActions } from "../../redux/slices";
import { images } from "../../assets";
import RatingInPopup from "../CourseDetail/RatingInPopup";

const Feedback: React.FC = () => {
    const [feedbackContent, setFeedbackContent] = useState<string>("");
    const [ratingValue, setRatingValue] = useState(5); // Default rating value

    const dispatch = useAppDispatch();
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);
    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rating = parseInt(event.target.id);
        setRatingValue(rating);
    };
    const handleFeedbackSubmit = async () => {
        try {
            if (!isLogin) {
                console.log("User is not logged in. Feedback not submitted.");
                return;
            }
            // Gọi hàm Redux để gửi feedback
            dispatch(feedbackActions.createMyFeedback({ content: feedbackContent }));

            // Sau khi gửi feedback, bạn có thể chuyển người dùng đến trang chính hoặc hiển thị một thông báo thành công.
            console.log("Feedback submitted successfully");
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error submitting feedback:", error);
        }
    };

    return (
        <>
            <div className="bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 h-[calc(80vh-100px)] flex items-center flex-col mt-[100px] space-y-[10px] ">
                <center className="grid grid-cols-3">
                    {/* Column 2: Form */}
                    <div className="col-span-1">
                        <img src={images.FeedbackLogo} alt="Feedback" style={{ width: "130px", height: "140px" }} />
                        <div className=" tracking-widest" style={{ marginLeft: "20px" }}>
                            <span className="text-gray-500 text-6xl block">
                                <span>Feedback</span>
                            </span>
                            <span className="text-gray-500 text-xl">Please provide your feedback below:</span>
                        </div>
                        <div className="mt-6">
                            <textarea
                                rows={10}
                                cols={60}
                                value={feedbackContent}
                                onChange={(e) => setFeedbackContent(e.target.value)}
                                placeholder="Enter your feedback here..."
                                className="border p-2 rounded-md"
                            />
                        </div>
                        <div className="mt-4">
                            <span className="text-gray-500 text-xl ">Rating Us here</span>
                        </div>
                        <div>
                            <RatingInPopup score={ratingValue} handleCheck={handleCheck} />
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={handleFeedbackSubmit}
                                className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-700"
                            >
                                Submit
                            </button>
                        </div>
                        <div className="mt-4">
                            <Link
                                to={"/"}
                                className="text-gray-500 font-mono text-xl bg-gray-200 p-3 rounded-md hover:shadow-md"
                            >
                                Homepage
                            </Link>
                        </div>
                    </div>
                    {/* Column 4: Thank You Form */}
                    <div className="col-span-1">
                        {/* Thank You Form Content */}
                        <img src={images.ThankLetter} alt="ThankLetter" style={{ width: "780px", height: "780px" }} />
                        {/* Additional Thank You Content or Form */}
                    </div>
                    {/* Column 3: Contact Information */}
                    <div>
                        <img src={images.ContactLogo} alt="Contact" style={{ width: "160px", height: "160px" }} />
                        <h2 className="text-gray-400 text-6xl block">Contact Information</h2>
                        <div
                            className="col-span-1 contact-info text-left text-base"
                            style={{ marginTop: "100px", marginBottom: "50px", marginLeft: "70px", fontSize: "20px" }}
                        >
                            <ul className="space-y-4" style={{marginLeft: "50px"}}>
                                <li>
                                    Website:{" "}
                                    <a
                                        href="https://utemy-cloud-frontend.vercel.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        utemy.com
                                    </a>
                                </li>
                                <li>
                                    Email: <a href="mailto:utemyvietnam@gmail.com">utemyvietnam@gmail.com</a>
                                </li>
                                <li>Phone: +84 xxx xxx xxx</li>
                                <li>
                                    Facebook:{" "}
                                    <a
                                        href="https://web.facebook.com/luvsfakeaf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        utemy
                                    </a>
                                </li>
                                <li>
                                    Zalo:{" "}
                                    <a href="https://zalo.me/utemy" target="_blank" rel="noopener noreferrer">
                                        utemy
                                    </a>
                                </li>
                            </ul>
                            <h3 className="my-4" style={{marginLeft: "50px"}}>Office Address:</h3>
                            <p className="mb-4" style={{marginLeft: "50px"}}>So 1 Vo Van Ngan, TP Thu Duc, Ho Chi Minh, Viet Nam</p>
                        </div>
                    </div>
                </center>
            </div>
        </>
    );
};

export default Feedback;
