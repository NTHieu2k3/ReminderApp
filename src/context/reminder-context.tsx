import { Reminder } from "models/Reminder";
import React, { createContext, useContext, useMemo, useReducer } from "react";

type Action =
  | { type: "GET_ALL"; payload: Reminder[] }
  | { type: "ADD"; payload: Reminder }
  | { type: "UPDATE"; payload: Reminder }
  | { type: "DELETE"; payload: string };

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
    default:
      return state;
  }
}

interface ReminderContextValue {
  reminders: Reminder[];
  setR: (reminder: Reminder[]) => void;
  addR: (reminder: Reminder) => void;
  updateR: (reminder: Reminder) => void;
  deleteR: (id: string) => void;
}

const ReminderContext = createContext<ReminderContextValue | undefined>(
  undefined
);

interface Props {
  readonly children: React.ReactNode;
}

export default function ReminderProvider({ children }: Props) {
  const [reminders, dispatch] = useReducer(reminderReducer, []);

  function setR(reminders: Reminder[]) {
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

  const contextValue = useMemo(
    () => ({
      reminders,
      setR,
      addR,
      updateR,
      deleteR,
    }),
    [reminders]
  );

  return (
    <ReminderContext.Provider value={contextValue}>
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminderContext() {
  const context = useContext(ReminderContext);
  if (context === undefined) {
    throw new Error("useReminder must be used within a ReminderProvider");
  }
  return context;
}
