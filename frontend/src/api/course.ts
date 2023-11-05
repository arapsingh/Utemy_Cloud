import apiCaller from "../api-config/apiCaller";
import { SearchMyCourseEnrolledCourse } from "../types/course";

const createCourse = async (values: FormData) => {
    const path = "course";
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const editCourse = async (values: FormData) => {
    const path = "course";
    console.log(values.get("title"));
    const reponse = await apiCaller("PATCH", path, values);
    return reponse;
};
const getMyCourses = async (values: SearchMyCourseEnrolledCourse) => {
    const path = `course/my?page_index=${values.pageIndex}&search_item=${values.keyword}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getEnrolledCourses = async (values: SearchMyCourseEnrolledCourse) => {
    const path = `course/enrolled?page_index=${values.pageIndex}&search_item=${values.keyword}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const deleteCourse = async (values: number) => {
    const path = `course/${values}`;
    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const getCourseDetail = async (values: string) => {
    const path = `course/${values}`;
    const reponse = await apiCaller("GET", path, values);
    return reponse;
};
const getCourseDetailById = async (values: number) => {
    const path = `course/detail/${values}`;
    const reponse = await apiCaller("GET", path, values);
    return reponse;
};
const getRightOfCourse = async (values: number) => {
    const path = `course/right/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTop10Rate = async () => {
    const path = `course/top10`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTop10Enrolled = async () => {
    const path = `course/top-enrolled`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const courseApis = {
    createCourse,
    getMyCourses,
    getEnrolledCourses,
    deleteCourse,
    getCourseDetail,
    getRightOfCourse,
    getTop10Rate,
    getTop10Enrolled,
    getCourseDetailById,
    editCourse,
};

export default courseApis;
