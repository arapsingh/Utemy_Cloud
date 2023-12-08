import { Response } from "../../types/response";
import apis from "../../api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { QuizGroupType, QuizType } from "../../types/quiz";

export const getAllCart = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "quiz/group/getall",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.cartApis.getAllCart();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);

type QuizSliceType = {
    quizGroupList: QuizGroupType[];
    quizList: QuizType[];
    quizShow: QuizType;
};

const initialState: QuizSliceType = {
    quizGroupList: [],
    quizList: [],
    quizShow: {
        quiz_id: 0,
        question: "",
        type: 0,
        quiz_answer: [],
    },
};

export const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        // setIsCourseInCart: (state, action) => {
        //     for (const cart_item of state.userCart.cart_items) {
        //         if (cart_item.course.course_id === Number(action.payload)) {
        //             state.isCourseInCart = true;
        //             break;
        //         } else state.isCourseInCart = false;
        //     }
        // }
    },
    extraReducers: (builder) => {
        // builder.addCase(getAllCart.pending, (state) => {
        //     state.isGetLoading = true;
        // });
        // builder.addCase(getAllCart.fulfilled, (state, action) => {
        //     state.totalCourseInCart = action.payload.data.cart_items.length;
        //     state.userCart = action.payload.data as Cart;
        //     state.subTotal = getSubTotal(action.payload.data);
        //     state.subTotalRetail = getSubTotalRetail(action.payload.data);
        //     state.isGetLoading = false;
        // });
        // builder.addCase(getAllCart.rejected, (state) => {
        //     state.isGetLoading = false;
        // });
    },
});

export const {} = quizSlice.actions;

export default quizSlice.reducer;
