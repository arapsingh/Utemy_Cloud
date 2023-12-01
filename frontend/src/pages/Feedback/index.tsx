import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { feedbackActions } from "../../redux/slices";
import { images } from "../../assets";
import RatingInPopup from "../CourseDetail/RatingInPopup";
import toast from "react-hot-toast";

const Feedback: React.FC = () => {
    const [feedbackContent, setFeedbackContent] = useState<string>("");
    const [ratingValue, setRatingValue] = useState(5); // Default rating value

    const dispatch = useAppDispatch();
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rating = parseInt(event.target.id);
        setRatingValue(rating);
    };

    const handleFeedbackSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            event.preventDefault(); // Prevent automatic redirection
    
            if (!isLogin) {
                console.log("User is not logged in. Feedback not submitted.");
                return;
            }
    
            // Kiểm tra nếu content hoặc score là undefined
            if (feedbackContent === "" || ratingValue === undefined) {
                toast.error("Feedback content cannot be null!");
                return;
            }
    
            // Gọi hàm Redux để gửi feedback
            dispatch(feedbackActions.createMyFeedback({ content: feedbackContent, score: ratingValue }));
    
            // Sau khi gửi feedback, bạn có thể chuyển người dùng đến trang chính hoặc hiển thị một thông báo thành công.
            console.log("Feedback submitted successfully");
            toast.success("Submit successfully!")
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error submitting feedback:", error);
            toast.error('An error occurred while submitting feedback. Please try again later.');
        }
    };
    

    return (
        <div className=" h-[calc(80vh-100px)] flex items-center flex-col mt-[100px] space-y-[10px] ">
            <center className="grid grid-cols-2">
                {/* Column 2: Form */}
                <form className="bg-footer p-8 rounded-md border border-gray-500 mx-auto" style={{ marginTop: '50px' }}>
                    <div className="col-span-1">
                        {/* Section 1: Logo and Your Feedback */}
                        <div className="flex justify-between flex items-center flex-row border-b-2 border-gray-500 pb-4">
                            <div>
                                <img
                                    src={images.FeedbackLogo}
                                    alt="Feedback"
                                    style={{ width: "80px", height: "80px" }}
                                />
                            </div>
                            <div>
                                <span className="text-gray-500 text-4xl block">Your Feedback</span>
                            </div>
                        </div>

                        {/* Section 2: Thank You and Rating */}
                        <div className="mt-6 border-b-2 border-gray-500 pb-4 gap-4">
                            <div>
                                <span className="text-gray-500 text-xl ">
                                    We would like your feedback to improve our website!
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500 text-xl ">Rating Us here</span>
                            </div>
                            <div style={{ fontSize: "40px" /* other styles */ }}>
                                <RatingInPopup score={ratingValue} handleCheck={handleCheck} />
                            </div>{" "}
                        </div>

                        {/* Section 3: Feedback Categories (Buttons) */}

                        {/* Section 4: Text Area and Submit Button */}
                        <div className="mt-4">
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
                            <button
                                onClick={handleFeedbackSubmit}
                                className="btn btn-info text-white p-3 rounded-md hover:bg-blue-700"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>

                {/* Column 3: Contact Information */}
                <form className="bg-gray-200 p-8 rounded-md border border-gray-500 mx-auto" style={{ marginTop: '50px' }}>
                <div>
                    <div className="flex justify-between flex items-center flex-row border-b-2 border-gray-500 pb-4">
                    <div>
                    <img src={images.ContactLogo} alt="Contact" style={{ width: "80px", height: "80px" }} />

                    </div>
                    <div>
                    <h2 className="text-gray-400 text-4xl block">Contact Information</h2>

                    </div>
                    </div>
                    <div
                        className="col-span-1 contact-info text-left text-base"
                        style={{ marginTop: "100px", marginBottom: "50px", marginLeft: "70px", fontSize: "20px" }}
                    >
                        <ul className="space-y-4" style={{ marginLeft: "50px" }}>
                            <li>
                                Website:{" "}
                                <a
                                    href="https://utemy.vercel.app/"
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
                                <a href="https://web.facebook.com/luvsfakeaf" target="_blank" rel="noopener noreferrer">
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
                        <h3 className="my-4" style={{ marginLeft: "50px" }}>
                            Office Address:
                        </h3>
                        <p className="mb-4" style={{ marginLeft: "50px" }}>
                            So 1 Vo Van Ngan, TP Thu Duc, Ho Chi Minh, Viet Nam
                        </p>
                    </div>
                </div>
                </form>
            </center>
        </div>
    );
};

export default Feedback;
