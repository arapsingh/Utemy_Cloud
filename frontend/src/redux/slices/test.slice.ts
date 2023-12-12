import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import apis from "../../api";
import {
    TestResponse,
    TestDetail,
    TestResultType,
    AfterTest,
    TestProgressType,
    TestHistoryResponse,
} from "../../types/test";
type TestSliceType = {
    isLoading: boolean;
    isGetLoading: boolean;
    test: TestResponse;
    questionList: TestDetail[];
    nowQuestion: TestDetail;
    questionCount: number;
    questionIndex: number;
    duration: number;
    testState: number; //0 là chưa làm, 1 là đang làm, 2 là làm xong
    testResult: TestResultType;
    testHistory: TestHistoryResponse[];
    afterTest: AfterTest;
};

export const getTestByTestId = createAsyncThunk<Response<any>, number, { rejectValue: Response<null> }>(
    "test/1",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.testApis.getTestByTestId(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTestHistory = createAsyncThunk<
    Response<TestHistoryResponse[]>,
    number,
    { rejectValue: Response<null> }
>("test/history", async (body, ThunkAPI) => {
    try {
        const response = await apis.testApis.getTestHistory(body);
        return response.data as Response<TestHistoryResponse[]>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
export const createTestHistory = createAsyncThunk<Response<null>, TestResultType, { rejectValue: Response<null> }>(
    "test/history/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.testApis.createTestHistory(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);

const initialState: TestSliceType = {
    isLoading: false,
    isGetLoading: false,
    test: {
        description: "",
        title: "",
        duration: "",
        is_time_limit: false,
        test_id: 0,
        number_of_question: 0,
        pass_percent: 0,
        test_detail: [],
    },
    duration: 0,
    questionList: [],
    nowQuestion: { quiz_id: 0, question: "", type: 0, quiz_answer: [] },
    questionCount: 0,
    questionIndex: 0,
    testState: 0,
    testResult: {
        test_id: 0,
        test_progress: [],
    },
    testHistory: [],
    afterTest: {
        totalPercent: 0,
        totalQuestionRight: 0,
    },
};

export const testSlice = createSlice({
    name: "test",
    initialState,
    reducers: {
        setNowQuestion: (state, action) => {
            const newIndex = action.payload;
            state.questionIndex = newIndex;
            state.nowQuestion = state.questionList[newIndex];
        },
        setNextQuestion: (state) => {
            const newIndex = (state.questionIndex += 1);
            state.questionIndex = newIndex;
            state.nowQuestion = state.questionList[newIndex];
        },
        setPrevQuestion: (state) => {
            const newIndex = (state.questionIndex -= 1);
            state.questionIndex = newIndex;
            state.nowQuestion = state.questionList[newIndex];
        },
        decrementSeconds: (state) => {
            state.duration -= 1;
        },
        resetCounter: (state) => {
            state.duration = 0;
        },
        setHistoryTest: (state) => {
            state.testState = 3;
        },
        setBeforeTest: (state) => {
            state.testState = 0;
            state.nowQuestion = { quiz_id: 0, question: "", type: 0, quiz_answer: [] };
            state.questionIndex = 0;
            state.testResult.test_progress = [];
            state.afterTest = {
                totalPercent: 0,
                totalQuestionRight: 0,
            };
        },
        setStartTest: (state) => {
            state.testState = 1;
            state.nowQuestion = state.questionList[0];
        },
        setStopTest: (state) => {
            state.testState = 2;
            const totalQuestionRight = getQuestionRightCount(state.testResult.test_progress);
            state.afterTest.totalQuestionRight = totalQuestionRight;
            state.afterTest.totalPercent = Number((totalQuestionRight / state.questionCount).toFixed(2));
        },
        setProgress: (state, action) => {
            state.testResult.test_progress = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getTestByTestId.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTestByTestId.fulfilled, (state, action) => {
            state.test = action.payload.data as TestResponse;
            state.questionCount = action.payload.data.number_of_question;
            state.questionList = action.payload.data.test_detail;
            state.duration = Number(action.payload.data.duration);
            state.testResult.test_id = action.payload.data.test_id;
            state.isGetLoading = false;
        });
        builder.addCase(getTestByTestId.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(createTestHistory.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createTestHistory.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(createTestHistory.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getTestHistory.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTestHistory.fulfilled, (state, action) => {
            state.testHistory = action.payload.data as TestHistoryResponse[];
            state.isGetLoading = false;
        });
        builder.addCase(getTestHistory.rejected, (state) => {
            state.isGetLoading = false;
        });
    },
});

export const {
    setNowQuestion,
    setNextQuestion,
    setPrevQuestion,
    decrementSeconds,
    resetCounter,
    setStartTest,
    setStopTest,
    setProgress,
    setBeforeTest,
    setHistoryTest,
} = testSlice.actions;

export default testSlice.reducer;

export const resetCounterSync = () => (dispatch: any) => {
    dispatch(resetCounter());
};

const getQuestionRightCount = (testProgress: TestProgressType[]) => {
    let count = 0;
    testProgress.forEach((progress) => {
        if (progress.is_correct) count += 1;
    });
    return count;
};
