import { Response } from "../../types/response";
import apis from "../../api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getTotalUser = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/total-user",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getTotalUser();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTotalMoney = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/total-money",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getTotalMoney();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTotalCourse = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/total-course",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getTotalCourse();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getCategoryCourse = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/cate-course",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getCategoryCourse();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getCategoryEnrolled = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/cate-enrolled",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getCategoryEnrolled();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getCategoryMoney = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/cate-money",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getCategoryMoney();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);

type StatisticSliceType = {
    totalMoney: number;
    totalCourse: number;
    totalUser: number;
    categoryCourse: any;
    categoryEnrolled: any;
    categoryMoney: any;
    isGetLoading: boolean;
};

const initialState: StatisticSliceType = {
    totalMoney: 0,
    totalCourse: 0,
    totalUser: 0,
    categoryCourse: {},
    categoryEnrolled: {},
    categoryMoney: {},
    isGetLoading: false,
};

export const statisticSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getTotalUser.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTotalUser.fulfilled, (state, action) => {
            state.totalUser = action.payload.data.total_user;
            state.isGetLoading = false;
        });
        builder.addCase(getTotalUser.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTotalMoney.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTotalMoney.fulfilled, (state, action) => {
            state.totalMoney = action.payload.data.total_money;
            state.isGetLoading = false;
        });
        builder.addCase(getTotalMoney.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTotalCourse.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTotalCourse.fulfilled, (state, action) => {
            state.totalCourse = action.payload.data.course_count;
            state.isGetLoading = false;
        });
        builder.addCase(getTotalCourse.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getCategoryCourse.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCategoryCourse.fulfilled, (state, action) => {
            state.categoryCourse = action.payload.data;
            state.isGetLoading = false;
        });
        builder.addCase(getCategoryCourse.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getCategoryMoney.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCategoryMoney.fulfilled, (state, action) => {
            state.categoryMoney = action.payload.data;
            state.isGetLoading = false;
        });
        builder.addCase(getCategoryMoney.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getCategoryEnrolled.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCategoryEnrolled.fulfilled, (state, action) => {
            state.categoryEnrolled = action.payload.data;
            state.isGetLoading = false;
        });
        builder.addCase(getCategoryEnrolled.rejected, (state) => {
            state.isGetLoading = false;
        });
    },
});

export const {} = statisticSlice.actions;

export default statisticSlice.reducer;
