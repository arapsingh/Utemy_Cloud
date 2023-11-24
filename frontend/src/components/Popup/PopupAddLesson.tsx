import React, { useRef, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { AddLesson as AddLessonType } from "../../types/lesson";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { lessonActions } from "../../redux/slices";
import { addLessonValidationSchema } from "../../validations/lesson";
import toast, { Toaster } from "react-hot-toast";
// import { errorMessages, fileType } from "../utils/contants";
import constants from "../../constants";

type AddLessonModalProps = {
    handleDelete: () => void;
    handleCancel: () => void;
    handleRerender: () => void;
    id: number;
};

const PopupAddLesson: React.FC<AddLessonModalProps> = (props) => {
    const isLoading = useAppSelector((state) => state.lessonSlice.isLoading) ?? false;
    const [error, setError] = useState("");
    const [video, setVideo] = useState<File | null>(null);
    const dispatch = useAppDispatch();
    const formikRef = useRef(null);
    const initialValue: AddLessonType = {
        title: "",
        video: null,
        section_id: "",
    };

    const handleChangeVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        const video_file: File = event.currentTarget.files![0];
        if (video_file) {
            if (video_file.size > 1024 * 1024 * 100) {
                setError(constants.error.ERROR_VIDEO_TOO_BIG);
            } else {
                const video_extension = video_file.type;
                if (
                    video_extension === constants.util.VIDEO_MP4 ||
                    video_extension === constants.util.VIDEO_MKV ||
                    video_extension === constants.util.VIDEO_MOV
                ) {
                    setVideo(video_file);
                } else {
                    setError(constants.error.ERROR_VIDEO_NOT_SUPPORTED);
                }
            }
        }
    };

    const handleOnSubmit = (values: AddLessonType) => {
        console.log(video);
        if (video) {
            let formData = new FormData();
            formData.append("title", values.title);
            formData.append("section_id", props.id.toString());
            formData.append("video", video as File);
            dispatch(lessonActions.createLesson(formData))
                .then((response) => {
                    if (response.payload) {
                        if (response.payload.status_code !== 200) {
                            toast.error(response.payload.message);
                        } else {
                            toast.success(response.payload.message);
                            props.handleRerender();
                            props.handleCancel();
                        }
                    }
                })
                .catch((error: any) => {
                    toast.error(error);
                });
        } else {
            setError(constants.error.ERROR_VIDEO_IS_REQUIRED);
        }
    };

    return (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <Toaster />
            <div className="  max-w-[360px] tablet:max-w-[550px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] bg-background mx-auto tablet:mx-0 flex-1">
                <div className="w-full p-[12px]">
                    <h1 className="text-3xl mb-1 font-bold text-center text-lightblue text-title">ADD NEW LESSON</h1>
                    <Formik
                        validationSchema={addLessonValidationSchema}
                        initialValues={initialValue}
                        onSubmit={handleOnSubmit}
                        innerRef={formikRef}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit} className="text-sm mb-1 tablet:text-xl font-medium">
                                <div className="px-5 py-3">
                                    <label htmlFor="title" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Title
                                    </label>{" "}
                                    <br />
                                    <Field
                                        type="text"
                                        name="title"
                                        className={`w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                            formik.errors.title && formik.touched.title && "border-error"
                                        } `}
                                    />
                                    <br />
                                    <ErrorMessage
                                        name="title"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="px-5 py-3 ">
                                    <label htmlFor="video" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Upload video
                                    </label>{" "}
                                    <br />
                                    <input
                                        id="video"
                                        ref={formikRef}
                                        type="file"
                                        name="video"
                                        className={` file-input file-input-bordered file-input-info w-full ${
                                            error !== "" ? "border-red border-[1px]" : ""
                                        } `}
                                        onChange={handleChangeVideo}
                                    />
                                    {error !== "" && (
                                        <span className=" m-auto text-[15px] text-error font-medium ">{error}</span>
                                    )}
                                </div>

                                <div className="flex justify-end px-4">
                                    <button
                                        type="submit"
                                        name="save_button"
                                        className="text-white btn btn-info text-lg"
                                        disabled={error !== "" || isLoading}
                                    >
                                        {isLoading ? "Loading..." : "Save"}
                                    </button>
                                    <button onClick={props.handleCancel} type="button" className="btn text-lg ml-2">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default PopupAddLesson;
