import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reminder } from "models/Reminder";
import {
  createReminderThunk,
  deleteReminderThunk,
  getReminders,
  updateReminderThunk,
} from "store/actions/reminderActions";

interface ReminderSliceState {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
}

const initialState: ReminderSliceState = {
  reminders: [],
  loading: false,
  error: null,
};

export const reminderSlice = createSlice({
  name: "reminder",
  initialState,
  reducers: {
    setReminder: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = action.payload;
    },
    addReminder: (state, action: PayloadAction<Reminder>) => {
      state.reminders.push(action.payload);
    },
    updateReminder: (state, action: PayloadAction<Reminder>) => {
      const index = state.reminders.findIndex(
        (item) => item.id == action.payload.id
      );
      if (index !== -1) {
        state.reminders[index] = action.payload;
      }
    },
    deleteReminder: (state, action: PayloadAction<string>) => {
      state.reminders = state.reminders.filter(
        (item) => item.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      //Fetch
      .addCase(getReminders.fulfilled, (state, action) => {
        state.reminders = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getReminders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReminders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Cannot load Your Reminders !";
      })

      //Create
      .addCase(createReminderThunk.fulfilled, (state, action) => {
        state.reminders.push(action.payload);
      })

      //Update
      .addCase(updateReminderThunk.fulfilled, (state, action) => {
        const index = state.reminders.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.reminders[index] = action.payload;
        }
      })

      //Delete
      .addCase(deleteReminderThunk.fulfilled, (state, action) => {
        state.reminders = state.reminders.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export const { setReminder, addReminder, updateReminder, deleteReminder } =
  reminderSlice.actions;

export default reminderSlice.reducer;
