import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

type TOrderState = {
  data: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  data: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => (await orderBurgerApi(ingredients)).order
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось оформить заказ';
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
