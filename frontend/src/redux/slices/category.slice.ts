import { Response } from "../../types/response";
import { Category } from "../../types/category";
import apis from "../../api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const get5Categories = createAsyncThunk<Response<Category[]>, void, { rejectValue: Response<null> }>(
    "category/top5",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.categoryApis.get5Categories();
            return response.data as Response<Category[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getCategories = createAsyncThunk<Response<Category[]>, void, { rejectValue: Response<null> }>(
    "category/full",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.categoryApis.getCategories();
            return response.data as Response<Category[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
type CategorySliceType = {
    top5categories: Category[];
    categories: Category[];
    totalPage: number;
    isLoading: boolean;
    isGetLoading: boolean;
};

const initialState: CategorySliceType = {
    top5categories: [],
    categories: [],
    totalPage: 0,
    isLoading: false,
    isGetLoading: false,
};
export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(get5Categories.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(get5Categories.fulfilled, (state, action) => {
            state.top5categories = action.payload.data as Category[];
            state.isGetLoading = false;
        });
        builder.addCase(get5Categories.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getCategories.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload.data as Category[];
            state.isGetLoading = false;
        });
        builder.addCase(getCategories.rejected, (state) => {
            state.isGetLoading = false;
        });
    },
});

export const {} = categorySlice.actions;

export default categorySlice.reducer;
