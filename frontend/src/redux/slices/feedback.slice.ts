import { createSlice } from "@reduxjs/toolkit";

type FeedbackSliceType = {};

const initialState: FeedbackSliceType = {};

export const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {},
    extraReducers: {},
});

export const {} = feedbackSlice.actions;

export default feedbackSlice.reducer;
