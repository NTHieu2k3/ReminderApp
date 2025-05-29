import { configureStore } from "@reduxjs/toolkit";
import groupSlice from "./reducers/groupReducer";
import listSlice from "./reducers/listReducer";
import reminderSlice from "./reducers/reminderReducer";
import authSlice from "./reducers/authReducers";

export const store = configureStore({
  reducer: {
    groups: groupSlice,
    list: listSlice,
    reminder: reminderSlice,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
