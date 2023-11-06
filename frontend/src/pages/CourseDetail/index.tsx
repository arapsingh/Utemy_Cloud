import React, { useEffect, useState } from "react";
import { Navbar, Accordion, DeleteModal, Spin, TotalRating, Pagination } from "../../components";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { Section } from "../../types/section";
import { Course as CourseDetailType } from "../../types/course";
import { GetRating, Rating as RatingType } from "../../types/rating";
// import { Section as SectionType } from "../../types/section";
import { Link } from "react-router-dom";
import NotFound from "../NotFound";
import { courseActions, ratingActions } from "../../redux/slices";
import PopupRating from "./PopupRating";

import toast from "react-hot-toast";
import AuthorButton from "./AuthorButton";
import GuestButton from "./GuestButton";
import SubscribeUserButton from "./SubscribeUserButton";
import UnsubscribeModal from "./UnsubcribeModal";
import PopupPromotion from "./PopupPromotion";
import CommentSection from "./CommentSection";
import constants from "../../constants";
// import { orderLesson } from "../../types/lesson";
type CourseDetailProps = {
    isLogin: boolean;
};

const CourseDetail: React.FC<CourseDetailProps> = ({ isLogin }) => {
    let { slug } = useParams();
    const dispatch = useAppDispatch();
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [isOpenPopupRating, setIsOpenPopupRating] = useState<boolean>(false);
    const [isOpenUnsubscribeModal, setIsOpenUnsubscribeModal] = useState<boolean>(false);
    const [isOpenPromotionPopup, setIsOpenPromotionPopup] = useState<boolean>(false);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const [idItem, setIdItem] = useState<number>(-1);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const navigate = useNavigate();
    // const sectionOfCourse: SectionType[] = useAppSelector((state) => state.sectionSlice.sections);
    const courseDetail: CourseDetailType = useAppSelector((state) => state.courseSlice.courseDetail) ?? {};
    const ratings: RatingType[] = useAppSelector((state) => state.ratingSlice.ratings) ?? [];
    const totalRatingPage: number = useAppSelector((state) => state.ratingSlice.totalPage) ?? Number(1);

    // const orderLesson: orderLesson[] = useAppSelector((state) => state.courseSlice.orderLesson);
    const role: string = useAppSelector((state) => state.courseSlice.role) ?? "Unenrolled";
    const isGetLoadingCourse: boolean = useAppSelector((state) => state.courseSlice.isGetLoading) ?? false;
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < Number(1)) {
            setPageIndex(totalRatingPage);
        } else if (pageIndex > totalRatingPage) setPageIndex(Number(1));
        else {
            setPageIndex(pageIndex);
        }
        return;
    };
    const handleDeleteCourse = () => {
        dispatch(courseActions.deleteCourse(idItem)).then((response) => {
            if (response.payload) {
                if (response.payload.status_code === 200) {
                    toast.success(response.payload.message);
                    navigate("/my-courses");
                } else {
                    toast.error(response.payload.message);
                }
            }
        });
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };

    const handleCancelModal = () => {
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };
    const handleTogglePopupRating = () => {
        setIsOpenPopupRating(!isOpenPopupRating);
    };
    const handleToggleUnsubcribeCourse = () => {
        setIsOpenUnsubscribeModal(!isOpenUnsubscribeModal);
    };
    const handleTogglePromotion = () => {
        setIsOpenPromotionPopup(!isOpenPromotionPopup);
    };
    const handleAfterVote = () => {
        dispatch(courseActions.getCourseDetail(slug as string));
        const values: GetRating = {
            slug: slug as string,
            page_index: pageIndex,
        };
        dispatch(ratingActions.getListRatingOfCourseBySlug(values));
    };
    const handleAfterPromotion = () => {
        dispatch(courseActions.getCourseDetail(slug as string));
    };
    useEffect(() => {
        dispatch(courseActions.getCourseDetail(slug as string)).then((response) => {
            if (response.payload && response.payload.status_code !== 200) {
                setIsNotFound(true);
            }
        });
    }, [dispatch, slug, isNotFound]);
    useEffect(() => {
        if (courseDetail.course_id && isLogin) {
            dispatch(courseActions.getRightOfCourse(courseDetail.course_id));
        }
    }, [dispatch, courseDetail.course_id, isLogin]);
    useEffect(() => {
        if (courseDetail.number_of_rating > 0) {
            const values: GetRating = {
                slug: slug as string,
                page_index: pageIndex,
            };
            dispatch(ratingActions.getListRatingOfCourseBySlug(values));
        }
    }, [dispatch, courseDetail, pageIndex]);

    if (isNotFound) return <NotFound />;

    return (
        <>
            {isOpenPopupRating && (
                <PopupRating
                    handleAfterVote={handleAfterVote}
                    handleCancel={handleTogglePopupRating}
                    course_id={courseDetail.course_id}
                />
            )}
            {isOpenDeleteModal && <DeleteModal handleDelete={handleDeleteCourse} handleCancel={handleCancelModal} />}
            {isOpenUnsubscribeModal && (
                <UnsubscribeModal handleCancel={handleToggleUnsubcribeCourse} course_id={courseDetail.course_id} />
            )}
            {isOpenPromotionPopup && (
                <PopupPromotion
                    handleAfterPromotion={handleAfterPromotion}
                    handleCancel={handleTogglePromotion}
                    course={courseDetail}
                />
            )}
            <Navbar />
            {isGetLoadingCourse && <Spin />}
            <div className="container mx-auto mt-[100px] laptop:mt-0">
                <div className="min-h-screen h-full px-4 tablet:px-[60px]">
                    <div className="mt-4 container mx-auto p-4">
                        <div className="flex flex-col gap-4 laptop:flex-row shadow-xl bg-lightblue/10 rounded-lg">
                            <div className=" flex-1 w-full laptop:max-w-[600px] max-h-[400px] bg-gray-600 rounded-lg">
                                <img
                                    src={courseDetail.thumbnail}
                                    alt={courseDetail.title}
                                    className="h-[300px] w-full m-auto rounded-lg tablet:h-[400px] object-cover"
                                />
                            </div>
                            <div className=" flex-1 object-right flex flex-col gap-4 px-3 pb-3 laptop:pt-3">
                                <div className="flex-1">
                                    <h2 className="text-2xl laptop:text-3xl font-bold text-title mb-3 tablet:w-[300px] xl:w-[600px] truncate ...">
                                        {courseDetail.title}
                                    </h2>
                                    <p className="text-xl laptop:text-2xl font-medium italic mb-3">
                                        {courseDetail.summary}
                                    </p>

                                    <div className=" mb-3">
                                        <span className="text-xl laptop:text-2xl font-bold">Author: </span>
                                        <Link
                                            to={`/profile/${courseDetail.author?.user_id}`}
                                            className="text-xl laptop:text-2xl underline font-medium text-blue-600"
                                        >
                                            {courseDetail.author?.first_name}
                                            <span> {courseDetail.author?.last_name} </span>
                                        </Link>
                                    </div>
                                    <div className="flex items-center text-xl laptop:text-3xl font-medium mb-3">
                                        <span className="text-xl laptop:text-2xl font-bold mr-2">Ratings:</span>
                                        <TotalRating
                                            ratingId={0}
                                            totalScore={Number(courseDetail.average_rating)}
                                            isForCourse={true}
                                        />
                                        <p className="italic text-xl laptop:text-2xl ml-2 ">
                                            {courseDetail.average_rating}
                                        </p>
                                    </div>
                                    <div className="flex items-center text-xl mb-3 laptop:text-2xl font-bold">
                                        <span className="mr-2">Status:</span>
                                        <p className="font-normal">
                                            {courseDetail.status === false ? "Incompleted" : " Completed"}
                                        </p>
                                    </div>
                                    <div className="text-xl laptop:text-2xl mb-3">
                                        <span className=" font-bold">Price: </span>
                                        <span className="font-normal"> {courseDetail.price} </span>
                                    </div>
                                </div>
                                <div className="flex-1 flex items-end gap-2 flex-wrap">
                                    {isLogin && role === constants.util.ROLE_AUTHOR && (
                                        <AuthorButton
                                            handleTogglePromotion={handleTogglePromotion}
                                            handleDelete={() => {
                                                setIsOpenDeleteModal(!isOpenDeleteModal);
                                                setIdItem(courseDetail.course_id as number);
                                            }}
                                            courseDetail={courseDetail}
                                        />
                                    )}
                                    {isLogin && role === constants.util.ROLE_ENROLLED && (
                                        <SubscribeUserButton
                                            handleTogglePopupRating={handleTogglePopupRating}
                                            handleToggleUnsubscribeCourse={handleToggleUnsubcribeCourse}
                                            courseDetail={courseDetail}
                                        />
                                    )}
                                    {(!isLogin || role === constants.util.ROLE_USER) && (
                                        <GuestButton isLogin={isLogin} course_id={courseDetail.course_id} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="description my-4">
                                <h2 className="text-xl tablet:text-3xl font-bold mb-3">Description</h2>
                                <span className="w-[60px] h-1 bg-black block"></span>
                                <p className="mt-2 text-[20px]">{courseDetail.description}</p>
                            </div>

                            <div className="table-of-content my-4">
                                <h2 className="text-xl tablet:text-3xl font-bold mb-3">Table of Content</h2>
                                <span className="w-[60px] h-1 bg-black block mb-4"></span>
                                {courseDetail.sections?.map((section: Section, index: number) => {
                                    return (
                                        <Accordion
                                            // orderLesson={orderLesson}
                                            disable={true}
                                            key={index}
                                            isDisplayBtn={false}
                                            section={section}
                                            redirectToWatchVideo={isLogin && !(role === constants.util.ROLE_USER)}
                                        />
                                    );
                                })}
                            </div>
                            {isGetLoadingCourse ? (
                                <p className="mt-4 text-2x text-center font-bold">Loading</p>
                            ) : (
                                <CommentSection ratings={ratings} />
                            )}
                            {ratings.length > 10 ? (
                                <div className="flex justify-end my-4">
                                    <Pagination
                                        handleChangePageIndex={handleChangePageIndex}
                                        totalPage={totalRatingPage}
                                        currentPage={pageIndex}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                            {ratings.length === 0 && (
                                <p className="mt-4 text-2xl text-error text-center font-bold">Such empty</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetail;
