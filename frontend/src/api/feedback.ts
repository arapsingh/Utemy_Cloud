import apiCaller from "../api-config/apiCaller";
import { FeedbackContent } from "../types/feedback";

const getAllFeedbacks = async (values: number) => {
    const path = `feedback?page_index=${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const createMyFeedback = async (values: FeedbackContent) => {
    const path = 'feedback/';
    const response = await apiCaller("POST", path, values);
    return response;
}
const feedbackApis = {
    getAllFeedbacks,
    createMyFeedback
};

export default feedbackApis;
