import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, refreshIdToken, signUp } from "database/AuthDB";
import { User } from "models/User";
import { AuthResponse } from "type/authRespone.type";

export const signUpAccount = createAsyncThunk<AuthResponse, User>(
  "auth/signUp",
  async (user, thunkApi) => {
    try {
      const result = await signUp(user.email, user.password);
      return { ...result, email: user.email };
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ?? "Something went wrong";
      if (message === "EMAIL_EXISTS") {
        return thunkApi.rejectWithValue("Email already exists!");
      }
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const loginAccount = createAsyncThunk<AuthResponse, User>(
  "auth/login",
  async (user, thunkApi) => {
    try {
      const result = await login(user.email, user.password);
      return { ...result, email: user.email };
    } catch (error: any) {
      const message =
        error.message ??
        error?.response?.data?.error?.message ??
        "Login failed";
      console.log(error);

      if (
        message === "EMAIL_NOT_FOUND" ||
        message === "INVALID_LOGIN_CREDENTIALS"
      ) {
        return thunkApi.rejectWithValue("Email or password is incorrect!");
      }

      if (error.message === "Please verify your email before login!") {
        return thunkApi.rejectWithValue("Please verify your email !");
      }

      if (error.message === "Network Error") {
        return thunkApi.rejectWithValue(
          "Check your network and try again later !"
        );
      }

      return thunkApi.rejectWithValue(message);
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string, thunkApi) => {
    try {
      const result = await refreshIdToken(refreshToken);
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        `Refresh token failed ! ${error.message}`
      );
    }
  }
);
