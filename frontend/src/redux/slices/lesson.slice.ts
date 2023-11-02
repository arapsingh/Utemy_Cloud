import { createSlice } from "@reduxjs/toolkit";

type LessonSliceType = {
    nowUrlVideo: string;
};

const initialState: LessonSliceType = {
    nowUrlVideo: "",
};

export const lessonSlice = createSlice({
    name: "lesson",
    initialState,
    reducers: {
        setNowUrlVideo: (state, action) => {
            state.nowUrlVideo = action.payload.data as string;
        },
    },
    extraReducers: {},
});

export const { setNowUrlVideo } = lessonSlice.actions;

export default lessonSlice.reducer;
