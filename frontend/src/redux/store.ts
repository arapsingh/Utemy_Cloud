import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth.slice";
import userSlice from "./slices/user.slice";
import sectionSlice from "./slices/section.slice";
import courseSlice from "./slices/course.slice";
import lessonSlice from "./slices/lesson.slice";
import feedbackSlice from "./slices/feedback.slice";
import categorySlice from "./slices/category.slice";
import ratingSlice from "./slices/rating.slice";

// import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";

const store = configureStore({
    reducer: {
        authSlice: authSlice,
        userSlice: userSlice,
        sectionSlice: sectionSlice,
        courseSlice: courseSlice,
        lessonSlice: lessonSlice,
        feedbackSlice: feedbackSlice,
        categorySlice: categorySlice,
        ratingSlice: ratingSlice,
        // fileStorageSlice: fileStorageSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
