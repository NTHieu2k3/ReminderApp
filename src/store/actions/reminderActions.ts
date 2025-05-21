import {
  deleteReminder,
  getAllReminders,
  insertReminder,
  updateReminder,
} from "database/ReminderDB";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Reminder } from "models/Reminder";

export const getReminders = createAsyncThunk("reminder/getAll", async () => {
  const lists = await getAllReminders();
  return lists;
});

export const createReminderThunk = createAsyncThunk(
  "reminder/create",
  async (reminder: Reminder) => {
    await insertReminder(reminder);
    return reminder;
  }
);

export const updateReminderThunk = createAsyncThunk(
  "reminder/update",
  async (reminder: Reminder) => {
    await updateReminder(reminder, reminder.id);
    return reminder;
  }
);

export const deleteReminderThunk = createAsyncThunk(
  "reminder/delete",
  async (id: string) => {
    await deleteReminder(id);
    return id;
  }
);
