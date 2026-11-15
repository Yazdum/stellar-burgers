import {
  getUserApi,
  forgotPasswordApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  resetPasswordApi,
  updateUserApi,
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteCookie, getCookie, setCookie } from '@utils/cookie';

import type { TLoginData, TRegisterData } from '@api';
import type { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

const saveTokens = (accessToken: string, refreshTokenValue: string): void => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshTokenValue);
};

export const checkUserAuth = createAsyncThunk('user/checkUserAuth', async () => {
  if (!getCookie('accessToken')) {
    if (!localStorage.getItem('refreshToken')) {
      return null;
    }
    await refreshToken();
  }
  return (await getUserApi()).user;
});

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk('user/loginUser', async (data: TLoginData) => {
  const response = await loginUserApi(data);
  saveTokens(response.accessToken, response.refreshToken);
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => (await updateUserApi(data)).user
);

export const requestPasswordReset = createAsyncThunk(
  'user/requestPasswordReset',
  forgotPasswordApi
);

export const resetPassword = createAsyncThunk('user/resetPassword', resetPasswordApi);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const setPending = (state: TUserState): void => {
  state.isLoading = true;
  state.error = null;
};

const setUser = (state: TUserState, action: { payload: TUser }): void => {
  state.isLoading = false;
  state.user = action.payload;
};

const setRejected = (
  state: TUserState,
  action: { error: { message?: string } }
): void => {
  state.isLoading = false;
  state.error = action.error.message ?? 'Не удалось выполнить запрос';
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(registerUser.pending, setPending)
      .addCase(registerUser.fulfilled, setUser)
      .addCase(registerUser.rejected, setRejected)
      .addCase(loginUser.pending, setPending)
      .addCase(loginUser.fulfilled, setUser)
      .addCase(loginUser.rejected, setRejected)
      .addCase(updateUser.pending, setPending)
      .addCase(updateUser.fulfilled, setUser)
      .addCase(updateUser.rejected, setRejected)
      .addCase(requestPasswordReset.pending, setPending)
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestPasswordReset.rejected, setRejected)
      .addCase(resetPassword.pending, setPending)
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, setRejected)
      .addCase(logoutUser.pending, setPending)
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, setRejected);
  },
});

export const userReducer = userSlice.reducer;
