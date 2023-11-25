import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth.slice";
import userSlice from "./slices/user.slice";
import sectionSlice from "./slices/section.slice";
import courseSlice from "./slices/course.slice";
import lessonSlice from "./slices/lesson.slice";
import feedbackSlice from "./slices/feedback.slice";
import categorySlice from "./slices/category.slice";
import ratingSlice from "./slices/rating.slice";
import cartSlice from "./slices/cart.slice";
import invoiceSlice from "./slices/invoice.slice";
import vnpaySlice from "./slices/vnpay.slice";
import componentSlice from "./slices/component.slice";
import statisticSlice from "./slices/statistic.slice";

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
        cartSlice: cartSlice,
        invoiceSlice,
        vnpaySlice,
        componentSlice,
        statisticSlice,
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
