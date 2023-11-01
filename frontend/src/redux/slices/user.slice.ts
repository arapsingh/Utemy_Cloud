import { createSlice } from "@reduxjs/toolkit";

type UserSliceType = {};

const initialState: UserSliceType = {};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: {},
});

export const {} = userSlice.actions;

export default userSlice.reducer;
