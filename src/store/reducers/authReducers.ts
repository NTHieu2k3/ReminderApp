import { createSlice } from "@reduxjs/toolkit";
import {
  forgotPasswordThunk,
  loginAccount,
  refreshTokenThunk,
  signUpAccount,
} from "store/actions/authActions";

interface AuthSliceProps {
  token: string | null;
  refreshToken: string | null;
  uid: string | null;
  email: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthSliceProps = {
  token: null,
  refreshToken: null,
  uid: null,
  email: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.refreshToken = null;
      state.uid = null;
      state.email = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(signUpAccount.fulfilled, (state, action) => {
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
      })
      .addCase(signUpAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginAccount.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAccount.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
