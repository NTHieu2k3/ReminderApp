import { Reminder } from "models/Reminder";
import React, { createContext, useContext, useMemo, useReducer } from "react";

type Action =
  | { type: "GET_ALL"; payload: Reminder[] }
  | { type: "ADD"; payload: Reminder }
  | { type: "UPDATE"; payload: Reminder }
  | { type: "DELETE"; payload: string }
  | { type: "DELETE_ALL" }
  | { type: "DELETE_BY_LIST"; payload: string }
  | { type: "SEARCH"; payload: string };

function reminderReducer(state: Reminder[], action: Action): Reminder[] {
  switch (action.type) {
    case "GET_ALL":
      return action.payload;
    case "ADD":
      return [...state, action.payload];
    case "UPDATE":
      return state.map((reminder) =>
        reminder.id === action.payload.id ? action.payload : reminder
      );
    case "DELETE":
      return state.filter((reminder) => reminder.id !== action.payload);
    case "DELETE_ALL":
      return [];
    case "DELETE_BY_LIST":
      return state.filter((reminder) => reminder.listId !== action.payload);
    case "SEARCH":
      return state.filter((reminder) =>
        reminder.title.toLowerCase().includes(action.payload.toLowerCase())
      );
    default:
      return state;
  }
}

interface ReminderContextValue {
  reminders: Reminder[];
  getAllR: (reminder: Reminder[]) => void;
  addR: (reminder: Reminder) => void;
  updateR: (reminder: Reminder) => void;
  deleteR: (id: string) => void;
  deleteAllR: () => void;
  deleteByListR: (listId: string) => void;
  searchR: (keyword: string) => void;
}

const ReminderContext = createContext<ReminderContextValue | undefined>(
  undefined
);

interface Props {
  readonly children: React.ReactNode;
}

export function ReminderProvider({ children }: Props) {
  const [reminders, dispatch] = useReducer(reminderReducer, []);

  function getAllR(reminders: Reminder[]) {
    dispatch({ type: "GET_ALL", payload: reminders });
  }

  function addR(reminder: Reminder) {
    dispatch({ type: "ADD", payload: reminder });
  }

  function updateR(reminder: Reminder) {
    dispatch({ type: "UPDATE", payload: reminder });
  }

  function deleteR(id: string) {
    dispatch({ type: "DELETE", payload: id });
  }

  function deleteAllR() {
    dispatch({ type: "DELETE_ALL" });
  }

  function deleteByListR(listId: string) {
    dispatch({ type: "DELETE_BY_LIST", payload: listId });
  }

  function searchR(keyword: string) {
    dispatch({ type: "SEARCH", payload: keyword });
  }

  const contextValue = useMemo(
    () => ({
      reminders,
      getAllR,
      addR,
      updateR,
      deleteR,
      deleteAllR,
      deleteByListR,
      searchR,
    }),
    [reminders]
  );

  return (
    <ReminderContext.Provider value={contextValue}>
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminder() {
  const context = useContext(ReminderContext);
  if (context === undefined) {
    throw new Error("useReminder must be used within a ReminderProvider");
  }
  return context;
}
