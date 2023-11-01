import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import { Course } from "../../types/course";
import apis from "../../api";

type CourseSliceType = {
    courses: Course[];
    totalPage: number;
    isLoading: boolean;
    isGetLoading: boolean;
    isUpload: boolean;
};

const initialState: CourseSliceType = {
    courses: [],
    totalPage: 0,
    isLoading: false,
    isGetLoading: false,
    isUpload: false,
};
export const createCourses = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
    "course/createCourse",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.createCourse(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers: {},
});

export const {} = courseSlice.actions;

export default courseSlice.reducer;
