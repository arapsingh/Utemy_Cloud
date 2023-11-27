import apiCaller from "../api-config/apiCaller";
import { GetAllFeedback } from "../types/feedback";

const getAllFeedbacks = async (values: GetAllFeedback) => {
    const path = `feedback?page_index=${values.pageIndex}&evaluate=${values.evaluate}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};

const feedbackApis = {
    getAllFeedbacks,
};

export default feedbackApis;
