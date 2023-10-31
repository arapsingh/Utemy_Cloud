import { createSlice } from "@reduxjs/toolkit";

type LessonSliceType = {};

const initialState: LessonSliceType = {};

export const lessonSlice = createSlice({
    name: "lesson",
    initialState,
    reducers: {},
    extraReducers: {},
});

export const {} = lessonSlice.actions;

export default lessonSlice.reducer;
