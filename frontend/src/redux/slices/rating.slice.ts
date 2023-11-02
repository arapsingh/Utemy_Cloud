import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Rating, RatingCourse, GetRating, ListRating } from "../../types/rating";
import { Response } from "../../types/response";
import apis from "../../api";

type RatingSliceType = {
    ratings: Rating[];
    totalRecord: number;
    totalPage: number;
    isLoading: boolean;
    isGetLoading: boolean;
};

const initialState: RatingSliceType = {
    ratings: [],
    totalRecord: 0,
    totalPage: 0,
    isLoading: false,
    isGetLoading: false,
};
export const ratingCourse = createAsyncThunk<Response<null>, RatingCourse, { rejectValue: Response<null> }>(
    "rating/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.ratingApis.ratingCourse(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getListRatingOfCourseBySlug = createAsyncThunk<
    Response<ListRating>,
    GetRating,
    { rejectValue: Response<null> }
>("rating/all", async (body, ThunkAPI) => {
    try {
        const response = await apis.ratingApis.getListRatingOfCourseBySlug(body);
        return response.data as Response<ListRating>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
export const ratingSlice = createSlice({
    name: "rating",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(ratingCourse.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(ratingCourse.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(ratingCourse.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getListRatingOfCourseBySlug.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getListRatingOfCourseBySlug.fulfilled, (state, action) => {
            state.ratings = action.payload.data?.ratings as Rating[];
            state.totalPage = action.payload.data?.total_page as number;
            state.isGetLoading = false;
        });
        builder.addCase(getListRatingOfCourseBySlug.rejected, (state) => {
            state.isGetLoading = false;
        });
    },
});

export const {} = ratingSlice.actions;

export default ratingSlice.reducer;
