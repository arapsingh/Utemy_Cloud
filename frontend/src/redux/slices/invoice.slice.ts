import { Response } from "../../types/response";
import apis from "../../api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Invoice } from "../../types/invoice";

export const getInvoiceNow = createAsyncThunk<Response<Invoice>, void, { rejectValue: Response<null> }>(
    "invoice/",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.invoiceApis.getInvoiceNow();
            return response.data as Response<Invoice>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getHistoryInvoices = createAsyncThunk<Response<Invoice[]>, void, { rejectValue: Response<null> }>(
    "invoice/all",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.invoiceApis.getHistoryInvoices();
            return response.data as Response<Invoice[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const createInvoice = createAsyncThunk<Response<null>, void, { rejectValue: Response<null> }>(
    "invoice/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.invoiceApis.createInvoice();
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);

type InvoiceSliceType = {
    invoice: Invoice;
    invoices: Invoice[];
    totalPage: number;
    totalRecourd: number;
    isLoading: boolean;
    isGetLoading: boolean;
};

const initialState: InvoiceSliceType = {
    invoice: {
        invoice_id: 0,
        user_id: 0,
        total_money: 0,
        created_at: "",
        invoice_items: [],
    },
    invoices: [],
    totalPage: 0,
    totalRecourd: 0,
    isLoading: false,
    isGetLoading: false,
};
export const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getInvoiceNow.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getInvoiceNow.fulfilled, (state, action) => {
            state.invoice = action.payload.data as Invoice;
            state.isGetLoading = false;
        });
        builder.addCase(getInvoiceNow.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getHistoryInvoices.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getHistoryInvoices.fulfilled, (state, action) => {
            state.invoices = action.payload.data as Invoice[];
            state.isGetLoading = false;
        });
        builder.addCase(getHistoryInvoices.rejected, (state) => {
            state.isGetLoading = false;
        });
    },
});

export const {} = invoiceSlice.actions;

export default invoiceSlice.reducer;
