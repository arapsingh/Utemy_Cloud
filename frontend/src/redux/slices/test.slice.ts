import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import apis from "../../api";
type TestSliceType = {
    isLoading: boolean;
    test: any;
};

export const getTestByTestId = createAsyncThunk<Response<any>, number, { rejectValue: Response<null> }>(
    "test/1",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.testApis.getTestByTestId(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);

const initialState: TestSliceType = {
    isLoading: false,
    test: {},
};

export const testSlice = createSlice({
    name: "test",
    initialState,
    reducers: {
        // setLecture: (state, action) => {
        //     state.lecture = action.payload as Lecture;
        // },
    },
    extraReducers: (builder) => {
        builder.addCase(getTestByTestId.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getTestByTestId.fulfilled, (state, action) => {
            state.test = action.payload.data as any;
            state.isLoading = false;
        });
        builder.addCase(getTestByTestId.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const {} = testSlice.actions;

export default testSlice.reducer;
