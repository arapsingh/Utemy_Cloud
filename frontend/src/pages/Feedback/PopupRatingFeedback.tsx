import React, { useRef, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import RatingInPopup from "../CourseDetail/RatingInPopup";
import { Toaster } from "react-hot-toast";
import { ratingValidationSchema } from "../../validations/rating";
import { DeleteModal } from "../../components";

type RatingCourseProps = {
    handleAfterVote: () => void;
    handleCancel: () => void;
    //course_id: number | undefined;
};

const PopupRating: React.FC<RatingCourseProps> = (props) => {
    const [isDisplayDelete, setIsDisplayDelete] = useState(false);
    const [ratingValue, setRatingValue] = useState(5); // Default rating value
    const formikRef = useRef(null);
    const isLoading = false; // Set to true if needed

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rating = parseInt(event.target.id);
        setRatingValue(rating);
    };

    const handleOnSubmit = (values: any) => {
        // Handle the form submission if needed
        console.log("Form submitted with values:", values);
    };

    const handleToggleDelete = () => {
        setIsDisplayDelete(!isDisplayDelete);
    };

    return (
        <>
            <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
                {isDisplayDelete && <DeleteModal handleDelete={() => {}} handleCancel={handleToggleDelete} />}
                <Toaster />
                <div className="max-w-[360px] tablet:max-w-[550px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] bg-background mx-auto tablet:mx-0 flex-1">
                    <div className="w-full p-[12px]">
                        <Formik
                            validationSchema={ratingValidationSchema}
                            initialValues={{ content: "" }}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                        >
                            {(formik) => (
                                <form onSubmit={formik.handleSubmit} className="text-sm mb-1 tablet:text-xl font-medium">
                                    <div className="px-5 py-3 flex items-center space-x-4">
                                        <label htmlFor="title" className="text-sm mb-1 tablet:text-xl font-medium">
                                            Vote: {ratingValue}
                                        </label>
                                        <RatingInPopup score={ratingValue} handleCheck={handleCheck} />
                                    </div>
                                    <div className="px-5 py-3">
                                        <label htmlFor="title" className="text-sm mb-1 tablet:text-xl font-medium">
                                            Comment:
                                        </label>
                                        <br />
                                        <Field
                                            as="textarea"
                                            name="content"
                                            className={`w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                                formik.errors.content && formik.touched.content && "border-error"
                                            }`}
                                        />
                                        <br />
                                        <ErrorMessage
                                            name="content"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>

                                    <div className="flex justify-end px-4">
                                        <button
                                            type="submit"
                                            name="save_button"
                                            className="btn btn-info text-white text-lg"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Loading..." : "Save"}
                                        </button>
                                        <button
                                            onClick={props.handleCancel}
                                            type="button"
                                            className="btn text-lg ml-2"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Loading..." : "Cancel"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PopupRating;
