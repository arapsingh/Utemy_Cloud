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
import { calDayRemains, getCourseIncludes } from "../../utils/helper";
// import { orderLesson } from "../../types/lesson";
import { convertStringDate } from "../../utils/helper";
import AuthorDropdown from "./AuthorDropdown";

import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import {
    CheckIcon,
    ClockIcon,
    PlayCircleIcon,
    BookOpenIcon,
    GlobeAsiaAustraliaIcon,
    TicketIcon,
} from "@heroicons/react/24/outline";

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
    const courseDetail: CourseDetailType = useAppSelector((state) => state.courseSlice.courseDetail) ?? {};
    const ratings: RatingType[] = useAppSelector((state) => state.ratingSlice.ratings) ?? [];
    const totalRatingPage: number = useAppSelector((state) => state.ratingSlice.totalPage) ?? Number(1);
    const [activeTab, setActiveTab] = useState("Description");
    const { duration, lessonCount } = getCourseIncludes(courseDetail);
    // const orderLesson: orderLesson[] = useAppSelector((state) => state.courseSlice.orderLesson);
    const role: string = useAppSelector((state) => state.courseSlice.role) ?? "Unenrolled";
    const isGetLoadingCourse: boolean = useAppSelector((state) => state.courseSlice.isGetLoading) ?? false;
    const ratingPercent = useAppSelector((state) => state.ratingSlice.ratingPercent) ?? [];
    const hasSalePrice =
        courseDetail.sale_price &&
        courseDetail.price &&
        courseDetail.sale_price < courseDetail.price &&
        courseDetail.sale_until &&
        new Date(courseDetail.sale_until) > new Date();

    let dayRemains = undefined;
    if (hasSalePrice) dayRemains = calDayRemains(courseDetail.sale_until as string);

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
            score: 0,
        };
        dispatch(ratingActions.getListRatingOfCourseBySlug(values));
        dispatch(ratingActions.getRatingPercentOfCourse(slug as string));
    };
    const handleAfterPromotion = () => {
        dispatch(courseActions.getCourseDetail(slug as string));
    };
    useEffect(() => {
        const newZoomValue = 0.6; // Đặt giá trị mong muốn

        // Kiểm tra nếu trình duyệt hỗ trợ thuộc tính zoom
        if ('zoom' in document.documentElement.style) {
          document.documentElement.style.zoom = `${newZoomValue}`;
        }  
        dispatch(courseActions.getCourseDetail(slug as string)).then((response) => {
            if (response.payload && response.payload.status_code !== 200) {
                setIsNotFound(true);
            }
        });
    }, [dispatch, slug, isNotFound]);
    useEffect(() => {
        const newZoomValue = 0.6; // Đặt giá trị mong muốn

        // Kiểm tra nếu trình duyệt hỗ trợ thuộc tính zoom
        if ('zoom' in document.documentElement.style) {
          document.documentElement.style.zoom = `${newZoomValue}`;
        }  
        if (courseDetail.course_id && isLogin) {
            dispatch(courseActions.getRightOfCourse(courseDetail.course_id));
            dispatch(ratingActions.getUserRating(courseDetail.course_id));
        }
    }, [dispatch, courseDetail.course_id, isLogin]);
    useEffect(() => {
        const newZoomValue = 0.6; // Đặt giá trị mong muốn

        // Kiểm tra nếu trình duyệt hỗ trợ thuộc tính zoom
        if ('zoom' in document.documentElement.style) {
          document.documentElement.style.zoom = `${newZoomValue}`;
        }  
        if (courseDetail.number_of_rating > 0) {
            const values: GetRating = {
                slug: slug as string,
                page_index: pageIndex,
                score: 0,
            };
            dispatch(ratingActions.getListRatingOfCourseBySlug(values));
            dispatch(ratingActions.getRatingPercentOfCourse(slug as string));
        }
    }, [dispatch, courseDetail, pageIndex]);
    const handleFilterRatings = (scoreFilter: number) => {
        if (courseDetail.number_of_rating > 0) {
            setPageIndex(1);
            const values: GetRating = {
                slug: slug as string,
                page_index: 1,
                score: scoreFilter,
            };
            dispatch(ratingActions.getListRatingOfCourseBySlug(values));
        }
    };
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
                                    className="h-[300px] w-full m-auto rounded-lg tablet:h-[400px] object-contain"
                                />
                            </div>
                            <div className=" flex-1 object-right flex flex-col gap-4 px-3 pb-3 laptop:pt-3">
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h2 className="text-2xl laptop:text-3xl font-bold text-title mb-3 tablet:w-[300px] xl:w-[600px]">
                                            {courseDetail.title}
                                        </h2>
                                        {isLogin && role === constants.util.ROLE_AUTHOR && (
                                            <AuthorDropdown
                                                handleTogglePromotion={handleTogglePromotion}
                                                handleDelete={() => {
                                                    setIsOpenDeleteModal(!isOpenDeleteModal);
                                                    setIdItem(courseDetail.course_id as number);
                                                }}
                                                courseDetail={courseDetail}
                                            />
                                        )}
                                    </div>
                                    <p className="text-xl laptop:text-2xl font-medium italic mb-3">
                                        {courseDetail.summary}
                                    </p>
                                    <div className=" mb-3">
                                        <span className="text-xl laptop:text-l font-bold">Tác giả: </span>
                                        <Link
                                            to={`/profile/${courseDetail.author?.user_id}`}
                                            className="text-xl laptop:text-l underline font-medium text-blue-600"
                                        >
                                            {courseDetail.author?.first_name}
                                            <span> {courseDetail.author?.last_name} </span>
                                        </Link>
                                    </div>
                                    <div className="flex items-center l font-medium mb-3">
                                        <span className="text-xl laptop:text-l font-bold mr-2">Đánh giá:</span>
                                        <p className="font-bold text-xl ml-2  text-[#EAB308]">
                                            {courseDetail.average_rating}
                                        </p>
                                        <TotalRating
                                            ratingId={0}
                                            totalScore={Number(courseDetail.average_rating)}
                                            isForCourse={true}
                                        />
                                        <a
                                            href="#Rating"
                                            className="text-m  ml-2 hover:cursor-pointer underline text-lightblue"
                                            onClick={() => {
                                                const button = document.getElementById("Rating");
                                                button?.click();
                                            }}
                                        >
                                            ({courseDetail.number_of_rating} xếp hạng)
                                        </a>
                                        <p className="text-m  ml-2 ">{courseDetail.number_of_enrolled} học viên</p>
                                    </div>
                                    <div className="flex items-center text-xl font-medium mb-3">
                                        <span className="text-xl laptop:text-l font-bold mr-2">Cập nhật gần đây:</span>
                                        <p className="text-l  ml-2 ">
                                            {courseDetail.updated_at
                                                ? convertStringDate(courseDetail.updated_at.toString())
                                                : convertStringDate(new Date().toString())}
                                        </p>
                                    </div>
                                    {hasSalePrice ? (
                                        <div className="text-xl font-bold laptop:text-l mb-3">
                                            Giá:
                                            <span className=" font-extrabold font-OpenSans text-lightblue ">
                                                {" "}
                                                {courseDetail.sale_price?.toLocaleString()}đ{" "}
                                            </span>{" "}
                                            <span className="font-normal italic text-sm line-through ">
                                                {" "}
                                                {courseDetail.price?.toLocaleString()}đ{" "}
                                            </span>{" "}
                                            <span className=" font-extrabold font-OpenSans ml-2 text-lightblue ">
                                                {" "}
                                                {dayRemains} days left
                                            </span>{" "}
                                        </div>
                                    ) : (
                                        <div className="text-xl font-bold laptop:text-l mb-3">
                                            Giá:
                                            <span className="font-extrabold font-OpenSans">
                                                {" "}
                                                {courseDetail.price?.toLocaleString()}đ{" "}
                                            </span>{" "}
                                        </div>
                                    )}
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
                        <div className="mt-8">
                            <Tabs value={activeTab} placeholder={undefined}>
                                <TabsHeader
                                    className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 w-1/2"
                                    indicatorProps={{
                                        className: "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
                                    }}
                                    placeholder={undefined}
                                >
                                    <Tab
                                        key={"Description"}
                                        value={"Description"}
                                        onClick={() => setActiveTab("Description")}
                                        className={activeTab === "Description" ? "text-gray-900" : ""}
                                        placeholder={undefined}
                                    >
                                        Nội dung khóa học
                                    </Tab>
                                    <Tab
                                        key={"Study"}
                                        value={"Study"}
                                        onClick={() => setActiveTab("Study")}
                                        className={activeTab === "Study" ? "text-gray-900" : ""}
                                        placeholder={undefined}
                                    >
                                        Nội dung bài học
                                    </Tab>

                                    <Tab
                                        id="Rating"
                                        key={"Rating"}
                                        value={"Rating"}
                                        onClick={() => setActiveTab("Rating")}
                                        className={activeTab === "Rating" ? "text-gray-900" : ""}
                                        placeholder={undefined}
                                    >
                                        Đánh giá
                                    </Tab>
                                </TabsHeader>
                                <TabsBody placeholder={undefined}>
                                    <TabPanel key="Study" value="Study">
                                        <div className="w-1/2">
                                            {courseDetail.study &&
                                                courseDetail.study.length > 0 &&
                                                courseDetail.study.map((study: any) => {
                                                    return (
                                                        <div className="flex gap-1 items-start shrink-0">
                                                            <CheckIcon className="w-6 h-6 shrink-0" />
                                                            <p className="text-xl">{study}</p>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </TabPanel>
                                    <TabPanel key="Description" value="Description">
                                        <div className="w-full flex gap-10">
                                            <div className="w-1/2">
                                                <div className="my-4">
                                                    <h2 className=" tablet:text-2xl font-bold mb-3">Yêu cầu</h2>
                                                    <ul className="list-disc">
                                                        {courseDetail.requirement &&
                                                            courseDetail.requirement.length > 0 &&
                                                            courseDetail.requirement.map((req: any) => {
                                                                return <li className="ml-5">{req}</li>;
                                                            })}
                                                    </ul>
                                                </div>
                                                <div className="my-4 description-course">
                                                    <h2 className=" tablet:text-2xl font-bold mb-3">Mô tả</h2>
                                                    <div
                                                        className=""
                                                        dangerouslySetInnerHTML={{ __html: courseDetail.description }}
                                                    ></div>
                                                </div>
                                                <div className="table-of-content my-4">
                                                    <h2 className="text-xl tablet:text-2xl font-bold mb-3">
                                                        Nội dung khóa học
                                                    </h2>
                                                    <span className="w-[60px] h-1 bg-black block mb-4"></span>
                                                    {!courseDetail.sections ||
                                                        (courseDetail.sections.length === 0 && (
                                                            <p className="mt-4 text-xl text-center text-lightblue font-bold">
                                                                Khóa học này chưa có nội dung gì
                                                            </p>
                                                        ))}
                                                    {courseDetail.sections?.map((section: Section, index: number) => {
                                                        return (
                                                            <Accordion
                                                                // orderLesson={orderLesson}
                                                                disable={true}
                                                                key={index}
                                                                isDisplayBtn={false}
                                                                section={section}
                                                                redirectToWatchVideo={
                                                                    isLogin && !(role === constants.util.ROLE_USER)
                                                                }
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div className="w-1/2 ">
                                                <div className="w-3/4 bg-white shadow-md rounded-md border-gray-400  items-center flex flex-col">
                                                    <p className="text-lg ">Khóa học bao gồm</p>
                                                    <table className="table">
                                                        <tbody>
                                                            <tr className="flex justify-between shrink-0">
                                                                <td className="flex gap-1 items-center">
                                                                    <ClockIcon className="w-4 h-4" />
                                                                    Giờ học video
                                                                </td>
                                                                <td>{duration}</td>
                                                            </tr>
                                                            <tr className="flex justify-between shrink-0">
                                                                <td className="flex gap-1 items-center">
                                                                    <PlayCircleIcon className="w-4 h-4" />
                                                                    Số bài học
                                                                </td>
                                                                <td>{lessonCount}</td>
                                                            </tr>
                                                            <tr className="flex justify-between shrink-0">
                                                                <td className="flex gap-1 items-center">
                                                                    <BookOpenIcon className="w-4 h-4" />
                                                                    Số chương
                                                                </td>
                                                                <td>{courseDetail.number_of_section}</td>
                                                            </tr>
                                                            <tr className="flex justify-between shrink-0">
                                                                <td className="flex gap-1 items-center">
                                                                    <GlobeAsiaAustraliaIcon className="w-4 h-4" />
                                                                    Ngôn ngữ
                                                                </td>
                                                                <td>Việt Nam</td>
                                                            </tr>
                                                            <tr className="flex justify-between shrink-0">
                                                                <td className="flex gap-1 items-center">
                                                                    <TicketIcon className="w-4 h-4" />
                                                                    Quyền truy cập vĩnh viễn trọn đời
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel key="Rating" value="Rating">
                                        <div id="#Rating">
                                            {isGetLoadingCourse ? (
                                                <p className="mt-4 text-2x text-center font-bold">Loading</p>
                                            ) : (
                                                <CommentSection
                                                    ratingPercent={ratingPercent}
                                                    averageRating={courseDetail.average_rating}
                                                    ratings={ratings}
                                                    handleFilterRatings={handleFilterRatings}
                                                    handleTogglePopupRating={handleTogglePopupRating}
                                                    role={role}
                                                    isLogin={isLogin}
                                                />
                                            )}
                                            {totalRatingPage > 1 ? (
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
                                                <p className="mt-4 text-2xl text-error text-center font-bold">
                                                    Khóa học này chưa có đánh giá
                                                </p>
                                            )}
                                        </div>
                                    </TabPanel>
                                </TabsBody>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetail;
