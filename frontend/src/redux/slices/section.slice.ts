import { createSlice } from "@reduxjs/toolkit";

type SectionSliceType = {};

const initialState: SectionSliceType = {};

export const sectionSlice = createSlice({
    name: "section",
    initialState,
    reducers: {},
    extraReducers: {},
});

export const {} = sectionSlice.actions;

export default sectionSlice.reducer;
