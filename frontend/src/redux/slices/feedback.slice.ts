import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import { Feedback } from "../../types/feedback";
import apis from "../../api";
type FeedbackSliceType = {
    feedbacks: Feedback[];
    isGetLoading: boolean;
    totalPage: number;
    totalRecord: number;
};

export const getAllFeedbacks = createAsyncThunk<Response<Feedback[]>, number, { rejectValue: Response<null> }>(
    "feedback/all",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.feedbackApis.getAllFeedbacks(body);
            return response.data as Response<Feedback[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
const initialState: FeedbackSliceType = {
    feedbacks: [],
    totalPage: 0,
    totalRecord: 0,
    isGetLoading: false,
};

export const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllFeedbacks.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAllFeedbacks.fulfilled, (state, action: any) => {
            state.feedbacks = action.payload.data.data as Feedback[];
            state.totalPage = action.payload.data.total_page;
            state.totalRecord = action.payload.data.total_record;
            state.isGetLoading = false;
        });
        builder.addCase(getAllFeedbacks.rejected, (state) => {
            state.isGetLoading = false;
        });
    },
});

export const {} = feedbackSlice.actions;

export default feedbackSlice.reducer;
