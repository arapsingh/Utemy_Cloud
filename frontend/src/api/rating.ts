import apiCaller from "../api-config/apiCaller";
import { RatingCourse, GetRating } from "../types/rating";

const ratingCourse = async (values: RatingCourse) => {
    const path = "rating";
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const getListRatingOfCourseBySlug = async (values: GetRating) => {
    const path = `course/${values.slug}/ratings?page_index=${values.page_index}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};

const ratingApis = {
    ratingCourse,
    getListRatingOfCourseBySlug,
};

export default ratingApis;
