import { Response } from "../../types/response";
import apis from "../../api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Cart, Coupon } from "../../types/cart";
import { Course } from "../../types/course";

export const getAllCart = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "cart/get",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.cartApis.getAllCart();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const addCourseToCart = createAsyncThunk<Response<any>, number, { rejectValue: Response<null> }>(
    "cart/add",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.cartApis.addCourseToCart(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const removeCourseFromCart = createAsyncThunk<Response<any>, number, { rejectValue: Response<null> }>(
    "cart/remove",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.cartApis.removeCourseFromCart(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const changeSaveForLater = createAsyncThunk<Response<any>, number, { rejectValue: Response<null> }>(
    "cart/change",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.cartApis.changeSaveForLater(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
type CartSliceType = {
    userCart: Cart;
    coupons: Coupon[];
    discount: number;
    isCourseInCart: boolean;
    isLoading: boolean;
    isGetLoading: boolean;
    subTotal: number;
    subTotalRetail: number;
    totalCourseInCart: number;
};

const initialState: CartSliceType = {
    userCart: {
        cart_id: 0,
        cart_items: [],
    },
    coupons: [],
    discount: 0,
    isCourseInCart: false,
    isLoading: false,
    isGetLoading: false,
    subTotal: 0,
    subTotalRetail: 0,
    totalCourseInCart: 0,
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setIsCourseInCart: (state, action) => {
            for (const cart_item of state.userCart.cart_items) {
                if (cart_item.course.course_id === Number(action.payload)) {
                    state.isCourseInCart = true;
                    break;
                } else state.isCourseInCart = false;
            }
        },
        getDiscount: (state, action) => {
            state.coupons.forEach((coupon) => {
                if (coupon.coupon_code === action.payload && new Date(coupon.valid_until) < new Date())
                    state.discount = coupon.discount;
            });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllCart.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAllCart.fulfilled, (state, action) => {
            state.totalCourseInCart = action.payload.data.cart_items.length;
            state.userCart = action.payload.data as Cart;
            state.subTotal = getSubTotal(action.payload.data);
            state.subTotalRetail = getSubTotalRetail(action.payload.data);
            state.isGetLoading = false;
        });
        builder.addCase(getAllCart.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(addCourseToCart.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(addCourseToCart.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(addCourseToCart.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(removeCourseFromCart.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(removeCourseFromCart.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(removeCourseFromCart.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(changeSaveForLater.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(changeSaveForLater.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(changeSaveForLater.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setIsCourseInCart, getDiscount } = cartSlice.actions;

export default cartSlice.reducer;

const getPrice = (course: Course) => {
    if (
        course.sale_price &&
        course.price &&
        course.sale_price < course.price &&
        course.sale_until &&
        new Date(course.sale_until) > new Date()
    )
        return course.sale_price;
    else return Number(course.price);
};
const getSubTotal = (cart: Cart) => {
    let subTotal = 0;
    if (cart.cart_items.length > 0) {
        cart.cart_items.forEach((item) => {
            if (item.course && !item.saved_for_later) subTotal += getPrice(item.course);
        });
    }
    return subTotal;
};
const getSubTotalRetail = (cart: Cart) => {
    let subTotalRetail = 0;
    if (cart.cart_items.length > 0) {
        cart.cart_items.forEach((item) => {
            if (item.course && !item.saved_for_later) subTotalRetail += Number(item.course.price);
        });
    }
    return subTotalRetail;
};
