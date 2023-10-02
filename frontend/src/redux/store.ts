import { configureStore } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";

const store: ToolkitStore = configureStore({
    reducer: {
        // authSlice: authSlice,
        // userSlice: userSlice,
        // sectionSlice: sectionSlice,
        // courseSlice: courseSlice,
        // fileStorageSlice: fileStorageSlice,
        // lessonSlice: lessonSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
