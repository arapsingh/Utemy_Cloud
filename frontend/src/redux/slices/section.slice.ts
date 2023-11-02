import { createSlice } from "@reduxjs/toolkit";
import { Section } from "../../types/section";

type SectionSliceType = {
    sections: Section[];
};

const initialState: SectionSliceType = {
    sections: [],
};

export const sectionSlice = createSlice({
    name: "section",
    initialState,
    reducers: {},
    extraReducers: {},
});

export const {} = sectionSlice.actions;

export default sectionSlice.reducer;
