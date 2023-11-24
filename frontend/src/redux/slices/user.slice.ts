import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthorInformation, UpdateInformation, User } from "../../types/user";
import { Response } from "../../types/response";
import UserApis from "../../api/user";
import { Course } from "../../types/course";

type UserSliceType = {
    courses: Course[];
    user: User;
    isGetLoading: boolean;
    isLoading: boolean;
};

const initialState: UserSliceType = {
    courses: [],
    user: {
        user_id: 0,
        url_avatar: "",
        //password: "",
        first_name: "",
        last_name: "",
        email: "",
        description: "",
    },
    isGetLoading: false,
    isLoading: false
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // builder.addCase(changePassword.pending, (state) => {
        //     state.isLoading = true;
        // });
        // builder.addCase(changePassword.fulfilled, (state) => {
        //     state.isLoading = false;
        // });
        // builder.addCase(changePassword.rejected, (state) => {
        //     state.isLoading = false;
        // });

        builder.addCase(getProfile.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.data as User;
        });
        builder.addCase(getProfile.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(getAuthorProfile.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getAuthorProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.data?.user as User;
            state.courses = action.payload.data?.courses as Course[];
        });
        builder.addCase(getAuthorProfile.rejected, (state) => {
            state.isLoading = false;
        });
    },
});
export const getProfile = createAsyncThunk<Response<User>, null, { rejectValue: Response<null> }>(
    "user/profile",
    async (body, ThunkAPI) => {
        try {
            const response = await UserApis.getProfile();
            return response.data as Response<User>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const updateProfile = createAsyncThunk<
    Response<User>,
    UpdateInformation,
    { rejectValue: Response<null> }
>("user/update-profile", async (body, ThunkAPI) => {
    try {
        const response = await UserApis.updateProfile(body);
        return response.data as Response<User>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});

export const getAuthorProfile = createAsyncThunk<
    Response<AuthorInformation>,
    number,
    { rejectValue: Response<null> }
>("user/getAuthorProfile", async (body, ThunkAPI) => {
    try {
        const response = await UserApis.getAuthorProfile(body);
        return response.data as Response<AuthorInformation>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});

export const {} = userSlice.actions;

export default userSlice.reducer;
