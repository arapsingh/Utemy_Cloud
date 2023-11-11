import React, { useEffect, useState, useRef } from "react";
import { Formik, ErrorMessage, Field } from "formik";
import { editCourseValidationSchema } from "../../validations/course";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { CustomeSelect } from "../../components";
import { categoryActions, courseActions } from "../../redux/slices";
import { EditCourse, Course, StatusOption } from "../../types/course";
import { Category as CategoryType } from "../../types/category";
import slugify from "slugify";
import toast from "react-hot-toast";
import { previewImage } from "../../utils/helper";

type Options = {
    value: number;
    label: string;
};

const customStyles = {
    control: (styles: any) => ({
        ...styles,
        position: "static",
        transform: "none",
        borderRadius: "0.375rem",
        padding: "10px",
        boxShadow: "",
    }),
    option: (styles: any) => ({
        ...styles,
    }),
    menu: (styles: any) => ({
        ...styles,
        borderRadius: "0.375rem",
        boxShadow: "0 1px 2px, 0 2px 4px",
    }),
};
type props = {
    course_id: number;
};

const EditForm: React.FC<props> = (props) => {
    const [errorImage, setErrorImage] = useState<boolean>(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const categories = useAppSelector((state) => state.categorySlice.categories); // all category
    const categoriesOptionsTemp = categories.map((category) => {
        const option: Options = {
            value: category.category_id,
            label: category.title,
        };
        return option;
    });
    const [categoriesOptions, setCategoriesOptions] = useState<Options[]>(categoriesOptionsTemp);
    // danh sach cac option cua hop chon category
    const courseDetail: Course = useAppSelector((state) => state.courseSlice.courseDetail);
    const courseCategories = courseDetail.categories; // danh sach cac category cua course
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);
    const imageRef = useRef<HTMLImageElement>(null);
    const navigate = useNavigate();
    const chosenOptionsCategories: Options[] = [];
    courseCategories.forEach((category: CategoryType) => {
        const temp: Options = {
            value: category.category_id,
            label: category.title,
        };

        chosenOptionsCategories.push(temp);
    });
    const initialStatus: StatusOption = {
        value: courseDetail.status,
        label: courseDetail.status ? "Completed" : "Incompleted",
    };
    const initialValue: EditCourse = {
        title: courseDetail.title,
        summary: courseDetail.summary,
        categories: chosenOptionsCategories,
        status: initialStatus,
        description: courseDetail.description,
        course_id: Number(props.course_id),
        slug: courseDetail.slug,
        price: Number(courseDetail.price),
        thumbnail: null,
    };
    const courseStatus: string = courseDetail.status ? "Completed" : "Incompleted";
    const dispatch = useAppDispatch();
    const statusOptions = [
        {
            value: true,
            label: "Completed",
        },
        {
            value: false,
            label: "Incompleted",
        },
    ];

    useEffect(() => {
        dispatch(categoryActions.getCategories());
    }, [dispatch, props.course_id]);

    useEffect(() => {
        // lọc đưa các category chưa được chọn vào box
        let createTemp = [...courseCategories];
        let cateTemp = [...categories];
        const cateOptionsTemp: any = [];
        createTemp.forEach((category: any) => {
            const index = cateTemp.findIndex((item: any) => item.category_id === category.category_id);
            if (index >= 0) {
                cateTemp.splice(index, 1);
            }
        });
        cateTemp.forEach((category: CategoryType) => {
            const temp: Options = {
                value: category.category_id,
                label: category.title,
            };
            cateOptionsTemp.push(temp);
        });
        setCategoriesOptions(cateOptionsTemp);
    }, [courseCategories, categories]);

    const handleChangeCategories = (event: any, formik: any) => {
        let createdTemp = JSON.parse(JSON.stringify(event));
        let cateTemp = JSON.parse(JSON.stringify(categories));
        const cateOptionsTemp: any = [];
        createdTemp.forEach((category: any) => {
            const index = cateTemp.findIndex((item: any) => item.id === category.value);
            if (index >= 0) {
                cateTemp.splice(index, 1);
            }
        });
        cateTemp.forEach((category: CategoryType) => {
            const temp: Options = {
                value: category.category_id,
                label: category.title,
            };
            cateOptionsTemp.push(temp);
        });
        setCategoriesOptions(cateOptionsTemp);
        formik.setFieldValue("categories", event);
    };

    const onChangeInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files![0] && event.currentTarget.files![0].size > 1024 * 1024 * 4) {
            setErrorImage(true);
        } else {
            setErrorImage(false);
            setThumbnail(event.currentTarget.files![0]);
            const thumbnail = event.currentTarget.files![0];
            previewImage(thumbnail, imageRef, courseDetail.thumbnail);
        }
    };

    const handleChangeStatus = (event: any, formik: any) => {
        formik.setFieldValue("status", event.value as boolean);
    };

    const handleOnSubmit = (values: EditCourse) => {
        console.log("Submit");
        const categories = values.categories.map((item: any) => item.value);
        const slug = slugify(values.title.toLowerCase());
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("course_id", props.course_id.toString());
        formData.append("slug", slug);
        formData.append("description", values.description);
        formData.append("summary", values.summary);
        formData.append("status", values.status.toString());
        formData.append("price", values.price.toString());
        formData.append("categories", categories.toString());
        formData.append("thumbnail", thumbnail as File);

        dispatch(courseActions.editCourse(formData)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(courseActions.getCourseDetailById(props.course_id));
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
        //previewImage(thumbnail, imageRef);
    };

    return (
        <>
            {isGetLoading !== true && (
                <>
                    <div className="px-4 tablet:px-[60px]">
                        <div className="flex-1 p-4 laptop:flex laptop:gap-4">
                            <div className="flex flex-col justify-center items-center gap-4 laptop:items-start laptop:justify-start">
                                <div className="">
                                    <img
                                        ref={imageRef}
                                        src={`${courseDetail.thumbnail}`}
                                        alt={courseDetail.title}
                                        className="w-60 h-60 rounded-lg outline-none border border-dashed border-black tablet:w-80 tablet:h-80 laptop:h-96 laptop:w-96"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="text-center tablet:text-start">
                                        <p className="text-lg font-medium">Upload thumbnail</p>
                                        <p className={`${errorImage ? "text-red-500" : ""}  italic`}>
                                            Size of the image is less than 4MB
                                        </p>
                                    </div>
                                    <input
                                        name="thumbnail"
                                        type="file"
                                        accept=".png, .jpg"
                                        className="file-input file-input-bordered file-input-info w-full max-w-xs"
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            onChangeInputFile(event);
                                        }}
                                    />
                                </div>
                            </div>
                            <Formik
                                initialValues={initialValue}
                                validationSchema={editCourseValidationSchema}
                                onSubmit={handleOnSubmit}
                            >
                                {(formik) => (
                                    <form
                                        onSubmit={formik.handleSubmit}
                                        className="mt-4 laptop:mt-0 flex-1 flex flex-col border border-dashed border-black rounded-lg p-4 bg-background shadow-lg"
                                    >
                                        <div className="flex flex-col gap-2 shrink-0 mb-2 tablet:flex-row tablet:gap-0">
                                            <div className="flex-1 flex flex-col tablet:mr-8">
                                                <label
                                                    htmlFor="title"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Title
                                                </label>
                                                <Field
                                                    id="title"
                                                    name="title"
                                                    type="text"
                                                    className={`px-2 py-4 rounded-lg border-[1px] outline-none w-full  ${
                                                        formik.errors.title && formik.touched.title
                                                            ? "border-error"
                                                            : ""
                                                    }`}
                                                />
                                                <ErrorMessage
                                                    name="title"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>

                                            <div className="flex-1 flex flex-col">
                                                <label
                                                    htmlFor="price"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Price
                                                </label>
                                                <Field
                                                    id="price"
                                                    name="price"
                                                    type="text"
                                                    className={`px-2 py-4 border-[1px] outline-none w-full rounded-lg ${
                                                        formik.errors.price && formik.touched.price
                                                            ? "border-error"
                                                            : ""
                                                    }`}
                                                />
                                                <ErrorMessage
                                                    name="price"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <label
                                                htmlFor="summary"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Summary
                                            </label>
                                            <Field
                                                id="summary"
                                                name="summary"
                                                type="text"
                                                className={`px-2 py-4 border-[1px] outline-none w-full rounded-lg ${
                                                    formik.errors.summary && formik.touched.summary
                                                        ? "border-error"
                                                        : ""
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="summary"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="title" className="text-sm mb-1 font-medium tablet:text-xl">
                                                Categories
                                            </label>
                                            <div
                                                className={`${
                                                    formik.errors.categories && formik.touched.categories
                                                        ? "border-error"
                                                        : ""
                                                } border-[1px] rounded-md`}
                                            >
                                                <Field
                                                    name="categories"
                                                    component={CustomeSelect}
                                                    handleOnchange={(e: any) => handleChangeCategories(e, formik)}
                                                    options={categoriesOptions}
                                                    isMulti={true}
                                                    defautlValues={chosenOptionsCategories}
                                                    styles={customStyles}
                                                />
                                            </div>
                                            <ErrorMessage
                                                name="categories"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="status" className="text-sm mb-1 font-medium tablet:text-xl">
                                                Status
                                            </label>
                                            <Field
                                                className="w-full"
                                                name="status"
                                                component={CustomeSelect}
                                                handleOnchange={(e: any) => handleChangeStatus(e, formik)}
                                                options={statusOptions}
                                                isMulti={false}
                                                placeholder={`${courseStatus}`}
                                                styles={customStyles}
                                            />
                                            <ErrorMessage
                                                name="status"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <label
                                                htmlFor="description"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Description
                                            </label>
                                            <Field
                                                id="description"
                                                as="textarea"
                                                name="description"
                                                type="text"
                                                className={`flex-1 w-full resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none ${
                                                    formik.errors.description && formik.touched.description
                                                        ? "border-error"
                                                        : ""
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="description"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button
                                                className={`text-white btn btn-info hover:opacity-75  text-lg  `}
                                                disabled={isLoading}
                                                type="submit"
                                            >
                                                {isLoading ? <span className="loading loading-spinner"></span> : ""}
                                                {isLoading ? "Loading..." : "Save"}
                                            </button>
                                            <button
                                                className="btn text-lg ml-2 "
                                                type="submit"
                                                onClick={() => navigate("/my-courses")}
                                                disabled={isLoading}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default EditForm;
