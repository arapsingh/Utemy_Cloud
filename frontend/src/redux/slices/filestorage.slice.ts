import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FileInformation, UploadFile } from "../../types/fileStorage";
import { Response } from "../../types/response";
import fileStorageApis from "../../api/fileStorage";

type FileStorage = {
    isLoading: boolean;
    fileInformation: FileInformation;
};

export const uploadImage = createAsyncThunk<Response<FileInformation>, UploadFile, { rejectValue: Response<null> }>(
    "fileStorage/uploadImage",
    async (body, ThunkAPI) => {
        try {
            const response = await fileStorageApis.uploadFile(body);
            return response.data as Response<FileInformation>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const uploadAvatar = createAsyncThunk<Response<FileInformation>, UploadFile, { rejectValue: Response<null> }>(
    "fileStorage/uploadAvatar",
    async (body, ThunkAPI) => {
        try {
            const response = await fileStorageApis.uploadAvatar(body);
            return response.data as Response<FileInformation>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

const initialState: FileStorage = {
    isLoading: false,
    fileInformation: {
        public_id: undefined,
        width: undefined,
        height: undefined,
        url: undefined,
        secure_url: undefined,
    },
};

export const fileStorageSlice = createSlice({
    name: "fileStorage",
    initialState: initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(uploadImage.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(uploadImage.fulfilled, (state, action) => {
            state.fileInformation = action.payload.data as FileInformation;
            state.isLoading = false;
        });

        builder.addCase(uploadAvatar.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(uploadAvatar.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(uploadAvatar.fulfilled, (state, action) => {
            state.fileInformation = action.payload.data as FileInformation;
            state.isLoading = false;
        });

        builder.addCase(uploadImage.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export default fileStorageSlice.reducer;
