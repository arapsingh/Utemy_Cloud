import { createSlice } from "@reduxjs/toolkit";

type CourseSliceType = {};

const initialState: CourseSliceType = {};

export const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers: {},
});

export const {} = courseSlice.actions;

export default courseSlice.reducer;
